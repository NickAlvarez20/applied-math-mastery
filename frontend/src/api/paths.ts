/**
 * Vercel Services mounts the Go backend at /_/backend (routePrefix).
 * Local dev uses /api (see vite.config.ts proxy).
 */
export const API_V1_PREFIX =
  import.meta.env.VITE_API_PREFIX ??
  (import.meta.env.DEV ? "/api" : "/_/backend");

export function apiV1(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${API_V1_PREFIX}/v1${suffix}`;
}
