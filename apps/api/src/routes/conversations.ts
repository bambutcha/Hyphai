import { Hono } from 'hono';
import type { Kysely } from 'kysely';
import type { DB } from '../db/schema.js';

export function createConversationRoutes(db: Kysely<DB>) {
  const routes = new Hono();

  routes.get('/', async (c) => {
    const rows = await db
      .selectFrom('conversations')
      .selectAll()
      .orderBy('updated_at', 'desc')
      .execute();

    return c.json(rows);
  });

  routes.post('/', async (c) => {
    const body = await c.req.json<{ title?: string }>().catch(() => ({}));
    const title = body.title?.trim() || 'New conversation';

    const row = await db
      .insertInto('conversations')
      .values({ title })
      .returningAll()
      .executeTakeFirstOrThrow();

    return c.json(row, 201);
  });

  routes.get('/:id', async (c) => {
    const id = c.req.param('id');

    const row = await db
      .selectFrom('conversations')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  });

  routes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const result = await db
      .deleteFrom('conversations')
      .where('id', '=', id)
      .executeTakeFirst();

    if (result.numDeletedRows === 0n) {
      return c.json({ error: 'Not found' }, 404);
    }

    return c.body(null, 204);
  });

  routes.get('/:id/messages', async (c) => {
    const id = c.req.param('id');

    const conversation = await db
      .selectFrom('conversations')
      .select('id')
      .where('id', '=', id)
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
    const id = c.req.param('id');
    const body = await c.req.json<{ content?: string }>();

    const content = body.content?.trim();
    if (!content) return c.json({ error: 'Content is required' }, 400);

    const conversation = await db
      .selectFrom('conversations')
      .select('id')
      .where('id', '=', id)
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

    return c.json({ user: userMessage, assistant: assistantMessage }, 201);
  });

  return routes;
}
