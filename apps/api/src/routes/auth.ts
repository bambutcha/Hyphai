import { Hono } from 'hono';
import type { Kysely } from 'kysely';
import type { DB } from '../db/schema.js';
import { signToken } from '../lib/jwt.js';

export function createAuthRoutes(db: Kysely<DB>) {
  const routes = new Hono();

  routes.post('/register', async (c) => {
    const body = await c.req.json<{
      email?: string;
      password?: string;
      displayName?: string;
    }>();

    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? '';
    const displayName = body.displayName?.trim() || email?.split('@')[0] || 'User';

    if (!email || !password || password.length < 6) {
      return c.json({ error: 'Email and password (min 6 chars) required' }, 400);
    }

    const existing = await db
      .selectFrom('users')
      .select('id')
      .where('email', '=', email)
      .executeTakeFirst();

    if (existing) {
      return c.json({ error: 'Email already registered' }, 409);
    }

    const passwordHash = await Bun.password.hash(password, { algorithm: 'bcrypt' });

    const user = await db
      .insertInto('users')
      .values({ email, password_hash: passwordHash, display_name: displayName })
      .returning(['id', 'email', 'display_name', 'created_at'])
      .executeTakeFirstOrThrow();

    const token = await signToken({ sub: user.id, email: user.email });

    return c.json({ token, user }, 201);
  });

  routes.post('/login', async (c) => {
    const body = await c.req.json<{ email?: string; password?: string }>();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? '';

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const valid = await Bun.password.verify(password, user.password_hash);
    if (!valid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await signToken({ sub: user.id, email: user.email });

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at,
      },
    });
  });

  return routes;
}
