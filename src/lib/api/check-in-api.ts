import { type CheckInResult, type CheckInStatusResult } from '@/types/CheckIn';

import { supabaseClient } from '@/utils/supabase/client';
import { getCurrentUser } from './auth-check-api';

export const checkInUser = async (): Promise<CheckInResult> => {
  try {
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      return {
        success: false,
        error: authError,
      };
    }

    const { data, error } = await supabaseClient
      .from('profiles')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('name, lottery_number, team')
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        name: data.name,
        lotteryNumber: data.lottery_number,
        team: data.team,
      },
    };
  } catch (error) {
    console.error('체크인 실패:', error);
    return {
      success: false,
      error: '체크인에 실패했습니다.',
    };
  }
};

export const getCheckInStatus = async (): Promise<CheckInStatusResult> => {
  try {
    const { user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      return {
        success: false,
        error: authError || '로그인이 필요합니다.',
      };
    }

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('checked_in, name, lottery_number, team')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        isCheckedIn: data.checked_in || false,
        name: data.name,
        lotteryNumber: data.lottery_number,
        team: data.team,
      },
    };
  } catch (error) {
    console.error('체크인 상태 확인 실패:', error);
    return {
      success: false,
      error: '체크인 상태 확인에 실패했습니다.',
    };
  }
};
