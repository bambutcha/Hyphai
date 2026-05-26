import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import type { Kysely } from 'kysely';
import type { DB } from '../db/schema.js';
import { buildOpenRouterMessages } from '../llm/history.js';
import { isLlmError } from '../llm/errors.js';
import { completeChat } from '../llm/openrouter.js';
import { streamChat } from '../llm/openrouter-stream.js';
import { resolveModelId } from '../llm/models.js';
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
    const title = body.title?.trim() || 'Новый диалог';

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

  routes.patch('/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const body = await c.req.json<{ title?: string }>().catch(() => ({}));
    const title = body.title?.trim();

    if (!title || title.length > 120) {
      return c.json({ error: 'Title must be 1-120 characters' }, 400);
    }

    const row = await db
      .updateTable('conversations')
      .set({ title, updated_at: new Date() })
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .returningAll()
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
    const body = await c.req.json<{ content?: string; model?: string }>();

    const content = body.content?.trim();
    const modelId = resolveModelId(body.model);
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

    const historyRows = await db
      .selectFrom('messages')
      .select(['role', 'content'])
      .where('conversation_id', '=', id)
      .orderBy('created_at', 'asc')
      .execute();

    let assistantContent: string;
    try {
      assistantContent = await completeChat(buildOpenRouterMessages(historyRows), modelId);
    } catch (err) {
      if (isLlmError(err)) {
        return c.json({ error: err.message }, err.status);
      }
      console.error('[messages] LLM error', err);
      return c.json({ error: 'LLM unavailable' }, 502);
    }

    const assistantMessage = await db
      .insertInto('messages')
      .values({
        conversation_id: id,
        role: 'assistant',
        content: assistantContent,
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

  routes.post('/:id/messages/stream', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const body = await c.req.json<{ content?: string; model?: string }>();

    const content = body.content?.trim();
    const requestedModel = resolveModelId(body.model);
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

    const historyRows = await db
      .selectFrom('messages')
      .select(['role', 'content'])
      .where('conversation_id', '=', id)
      .orderBy('created_at', 'asc')
      .execute();

    const openRouterMessages = buildOpenRouterMessages(historyRows);

    return streamSSE(c, async (stream) => {
      await stream.writeSSE({
        event: 'user_message',
        data: JSON.stringify(userMessage),
      });

      try {
        for await (const event of streamChat(openRouterMessages, requestedModel)) {
          if (event.kind === 'delta') {
            await stream.writeSSE({
              event: 'chunk',
              data: JSON.stringify({ delta: event.text }),
            });
            continue;
          }

          const assistantMessage = await db
            .insertInto('messages')
            .values({
              conversation_id: id,
              role: 'assistant',
              content: event.text,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

          await db
            .updateTable('conversations')
            .set({ updated_at: new Date() })
            .where('id', '=', id)
            .execute();

          await publishConversationEvent(id, {
            type: 'messages.created',
            conversationId: id,
            messages: [userMessage, assistantMessage],
          });

          await stream.writeSSE({
            event: 'done',
            data: JSON.stringify({
              assistant: assistantMessage,
              modelUsed: event.meta.modelUsed,
              requestedModel: event.meta.requestedModel,
              usedFallback: event.meta.usedFallback,
            }),
          });
        }
      } catch (err) {
        const message = isLlmError(err) ? err.message : 'LLM unavailable';
        const status = isLlmError(err) ? err.status : 502;
        await stream.writeSSE({
          event: 'error',
          data: JSON.stringify({ error: message, status }),
        });
      }
    });
  });

  return routes;
}
