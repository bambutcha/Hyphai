import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { upgradeWebSocket, websocket } from 'hono/bun';
import { createDb } from './db/kysely.js';
import { verifyToken } from './lib/jwt.js';
import {
  CONVERSATION_CHANNEL_PREFIX,
  redisSub,
} from './lib/redis.js';
import { wsHub } from './lib/ws-hub.js';
import {
  incrementWsConnections,
  metricsMiddleware,
  renderMetrics,
} from './middleware/metrics.js';
import { createAuthRoutes } from './routes/auth.js';
import { createConversationRoutes } from './routes/conversations.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const db = createDb(databaseUrl);
const app = new Hono();

const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use('*', cors({
  origin: corsOrigins,
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', metricsMiddleware);

app.get('/health', (c) => c.json({ status: 'ok', service: 'hyphai-api' }));
app.get('/metrics', (c) => c.text(renderMetrics(), 200, {
  'Content-Type': 'text/plain; version=0.0.4',
}));

app.route('/api/auth', createAuthRoutes(db));
app.route('/api/conversations', createConversationRoutes(db));

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    const token = c.req.query('token');
    const conversationId = c.req.query('conversationId');
    let userId: string | null = null;

    return {
      async onOpen(_event, ws) {
        if (!token || !conversationId) {
          ws.close(4401, 'token and conversationId required');
          return;
        }

        try {
          const payload = await verifyToken(token);
          userId = payload.sub;

          const owned = await db
            .selectFrom('conversations')
            .select('id')
            .where('id', '=', conversationId)
            .where('user_id', '=', userId)
            .executeTakeFirst();

          if (!owned) {
            ws.close(4403, 'forbidden');
            return;
          }

          wsHub.join(conversationId, ws);
          incrementWsConnections(1);
          ws.send(JSON.stringify({ type: 'connected', conversationId }));
        } catch {
          ws.close(4401, 'unauthorized');
        }
      },
      onClose(_event, ws) {
        if (conversationId) {
          wsHub.leave(conversationId, ws);
        }
        incrementWsConnections(-1);
      },
    };
  }),
);

redisSub.psubscribe(`${CONVERSATION_CHANNEL_PREFIX}*`);
redisSub.on('pmessage', (_pattern, channel, message) => {
  const conversationId = channel.replace(CONVERSATION_CHANNEL_PREFIX, '');
  try {
    wsHub.broadcast(conversationId, JSON.parse(message));
  } catch {
    /* ignore malformed */
  }
});

const port = Number(process.env.PORT ?? 3001);
console.log(`Hyphai API listening on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
  websocket,
};
