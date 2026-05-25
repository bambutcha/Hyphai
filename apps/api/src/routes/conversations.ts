import { Hono } from 'hono';
import type { Kysely } from 'kysely';
import type { DB } from '../db/schema.js';
import { publishConversationEvent } from '../lib/redis.js';
import type { AuthEnv } from '../middleware/auth.js';
import { requireAuth } from '../middleware/auth.js';

export function createConversationRoutes(db: Kysely<DB>) {
  const routes = new Hono<AuthEnv>();

  routes.use('*', requireAuth);

  routes.get('/', async (c) => {
    const userId = c.get('userId');
    const rows = await db
      .selectFrom('conversations')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('updated_at', 'desc')
      .execute();

    return c.json(rows);
  });

  routes.post('/', async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json<{ title?: string }>().catch(() => ({}));
    const title = body.title?.trim() || 'New conversation';

    const row = await db
      .insertInto('conversations')
      .values({ title, user_id: userId })
      .returningAll()
      .executeTakeFirstOrThrow();

    return c.json(row, 201);
  });

  routes.get('/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const row = await db
      .selectFrom('conversations')
      .selectAll()
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .executeTakeFirst();

    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  });

  routes.delete('/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const result = await db
      .deleteFrom('conversations')
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .executeTakeFirst();

    if (result.numDeletedRows === 0n) {
      return c.json({ error: 'Not found' }, 404);
    }

    return c.body(null, 204);
  });

  routes.get('/:id/messages', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const conversation = await db
      .selectFrom('conversations')
      .select('id')
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .executeTakeFirst();

    if (!conversation) return c.json({ error: 'Not found' }, 404);

    const rows = await db
      .selectFrom('messages')
      .selectAll()
      .where('conversation_id', '=', id)
      .orderBy('created_at', 'asc')
      .execute();

    return c.json(rows);
  });

  routes.post('/:id/messages', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const body = await c.req.json<{ content?: string }>();

    const content = body.content?.trim();
    if (!content) return c.json({ error: 'Content is required' }, 400);

    const conversation = await db
      .selectFrom('conversations')
      .select('id')
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .executeTakeFirst();

    if (!conversation) return c.json({ error: 'Not found' }, 404);

    const userMessage = await db
      .insertInto('messages')
      .values({
        conversation_id: id,
        role: 'user',
        content,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const assistantMessage = await db
      .insertInto('messages')
      .values({
        conversation_id: id,
        role: 'assistant',
        content: `Hyphai received: "${content}" — connect an LLM harness here for real replies.`,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await db
      .updateTable('conversations')
      .set({ updated_at: new Date() })
      .where('id', '=', id)
      .execute();

    const event = {
      type: 'messages.created' as const,
      conversationId: id,
      messages: [userMessage, assistantMessage],
    };

    await publishConversationEvent(id, event);

    return c.json({ user: userMessage, assistant: assistantMessage }, 201);
  });

  return routes;
}
