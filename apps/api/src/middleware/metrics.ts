import { createMiddleware } from 'hono/factory';

let httpRequestsTotal = 0;
let wsConnections = 0;

export function incrementWsConnections(delta: number) {
  wsConnections += delta;
}

export const metricsMiddleware = createMiddleware(async (c, next) => {
  httpRequestsTotal += 1;
  await next();
});

export function renderMetrics(): string {
  return [
    '# HELP hyphai_http_requests_total Total HTTP requests',
    '# TYPE hyphai_http_requests_total counter',
    `hyphai_http_requests_total ${httpRequestsTotal}`,
    '# HELP hyphai_ws_connections Active WebSocket connections',
    '# TYPE hyphai_ws_connections gauge',
    `hyphai_ws_connections ${wsConnections}`,
  ].join('\n');
}
