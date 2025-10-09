import { supabaseClient } from '@/utils/supabase/client';

export async function getCurrentUser() {
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error || !session) {
    return { user: null, error: error?.message || '로그인이 필요합니다.' };
  }

  return { user: session.user, error: null };
}
