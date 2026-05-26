import { Hono } from 'hono';
import type { Kysely } from 'kysely';
import type { DB } from '../db/schema.js';

export function createShareRoutes(db: Kysely<DB>) {
  const routes = new Hono();

  routes.get('/:slug', async (c) => {
    const slug = c.req.param('slug');

    const conversation = await db
      .selectFrom('conversations')
      .select(['id', 'title', 'share_slug'])
      .where('share_slug', '=', slug)
      .executeTakeFirst();

    if (!conversation) return c.json({ error: 'Not found' }, 404);

    const messages = await db
      .selectFrom('messages')
      .selectAll()
      .where('conversation_id', '=', conversation.id)
      .orderBy('created_at', 'asc')
      .execute();

    return c.json({
      conversation: { id: conversation.id, title: conversation.title },
      messages,
    });
  });

  return routes;
}
