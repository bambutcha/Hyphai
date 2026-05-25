import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createDb } from './db/kysely.js';
import { createConversationRoutes } from './routes/conversations.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const db = createDb(databaseUrl);
const app = new Hono();

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  }),
);

app.get('/health', (c) => c.json({ status: 'ok', service: 'hyphai-api' }));
app.route('/api/conversations', createConversationRoutes(db));

const port = Number(process.env.PORT ?? 3001);
console.log(`Hyphai API listening on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
