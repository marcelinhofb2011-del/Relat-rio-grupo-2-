import { supabase } from '../supabase/config';

export { supabase };

// Safe general-purpose API placeholder to prevent any compilation or import errors on old branches
export const api = {
  get: async (path: string) => {
    return { success: true, path };
  },
  post: async (path: string, body: any) => {
    return { success: true, path, body };
  }
};
