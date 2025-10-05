import { supabaseClient } from '@/utils/supabase/client';

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    return { user: null, error: error?.message || '로그인이 필요합니다.' };
  }

  return { user, error: null };
}
