import { supabaseClient } from '@/utils/supabase/client';
import { Tables } from '@/types/supabase.type';

export type Profile = Tables<'profiles'>;

export async function getCurrentUserProfile(): Promise<{
  data: Profile | null;
  error: string | null;
}> {
  try {
    // 현재 인증된 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError) {
      return { data: null, error: `인증 오류: ${authError.message}` };
    }

    if (!user) {
      return { data: null, error: '로그인이 필요합니다.' };
    }

    // 사용자 프로필 조회
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { data: null, error: `프로필 조회 실패: ${profileError.message}` };
    }

    return { data: profile, error: null };
  } catch (error) {
    return {
      data: null,
      error: `예상치 못한 오류가 발생했습니다: ${
        error instanceof Error ? error.message : '알 수 없는 오류'
      }`,
    };
  }
}

// export async function getUserProfileById(userId: string): Promise<{
//   data: Profile | null;
//   error: string | null;
// }> {
//   try {
//     const { data: profile, error } = await supabaseClient
//       .from('profiles')
//       .select('*')
//       .eq('id', userId)
//       .single();

//     if (error) {
//       return { data: null, error: `프로필 조회 실패: ${error.message}` };
//     }

//     return { data: profile, error: null };
//   } catch (error) {
//     return {
//       data: null,
//       error: `예상치 못한 오류가 발생했습니다: ${
//         error instanceof Error ? error.message : '알 수 없는 오류'
//       }`,
//     };
//   }
// }
