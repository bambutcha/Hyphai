import { Hono } from 'hono';
import { FREE_LLM_MODELS, getDefaultModelId } from '../llm/models.js';
import type { AuthEnv } from '../middleware/auth.js';
import { requireAuth } from '../middleware/auth.js';

export function createLlmRoutes() {
  const routes = new Hono<AuthEnv>();

  routes.use('*', requireAuth);

  routes.get('/models', (c) => {
    return c.json({
      models: FREE_LLM_MODELS,
      defaultModelId: getDefaultModelId(),
    });
  });

  return routes;
}
