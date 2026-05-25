import { createMiddleware } from 'hono/factory';
import { verifyToken } from '../lib/jwt.js';

export type AuthEnv = {
  Variables: {
    userId: string;
    userEmail: string;
  };
};

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await verifyToken(header.slice(7));
    c.set('userId', payload.sub);
    c.set('userEmail', payload.email);
    await next();
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});
