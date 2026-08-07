import { QueryClient } from '@tanstack/react-query';

const CACHE_TTL_MS = Number(import.meta.env.VITE_CACHE_TTL_MS ?? 5 * 60 * 1000);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TTL_MS,
      retry: false,
    },
  },
});
