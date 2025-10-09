import { supabaseClient } from '@/utils/supabase/client';

import { Tables } from '@/types/supabase.type';
export type Profile = Tables<'profiles'>;
import { type UserProfileSchemaType } from '../schemas/user-profile';

import { getCurrentUser } from './auth-check-api';

export async function getCurrentUserProfile(): Promise<{
  data: Profile | null;
  error: string | null;
}> {
  try {
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
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

export async function updateProfile(profileData: UserProfileSchemaType) {
  try {
    // 현재 로그인된 사용자 정보 가져오기
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      return {
        success: false,
        error: authError,
      };
    }

    // 프로필 데이터 업데이트
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({
        name: profileData.name,
        department: profileData.department,
        birth_year: profileData.birth_year,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: '프로필 업데이트 중 오류가 발생했습니다.',
    };
  }
}
