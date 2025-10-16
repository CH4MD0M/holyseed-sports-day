import { supabaseClient } from '@/utils/supabase/client';

export interface ConductLotteryParams {
  prizeId: string;
  winnerCount: number;
  lotteryMode: 'all' | 'team_specific';
  targetTeam?: string;
}

export interface Winner {
  user_id: string;
  name: string;
  team: string;
  department: string;
}

export interface ConductLotteryResponse {
  success: boolean;
  lottery_event_id?: string;
  winners?: Winner[];
  error?: string;
}

export interface ConfirmLotteryResponse {
  success: boolean;
  message?: string;
  confirmed_count?: number;
  error?: string;
}

interface RpcLotteryResult {
  lottery_event_id: string;
  winners: Winner[];
}

// RPC로 추첨 실행
export const conductLottery = async (
  params: ConductLotteryParams
): Promise<ConductLotteryResponse> => {
  try {
    const { data, error } = await supabaseClient.rpc('conduct_lottery', {
      p_prize_id: params.prizeId,
      p_winner_count: params.winnerCount,
      p_lottery_mode: params.lotteryMode,
      p_target_team: params.targetTeam,
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('추첨 결과를 받지 못했습니다.');
    }

    const result = data as unknown as RpcLotteryResult;

    return {
      success: true,
      lottery_event_id: result.lottery_event_id,
      winners: result.winners,
    };
  } catch (error) {
    console.error('추첨 실행 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '추첨 실행에 실패했습니다.',
    };
  }
};

// Edge Function으로 확정 (confirm은 Edge Function 사용)
export const confirmLottery = async (lotteryEventId: string): Promise<ConfirmLotteryResponse> => {
  try {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
      return {
        success: false,
        error: '로그인이 필요합니다.',
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/confirm-lottery`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          lotteryEventId,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '추첨 확정에 실패했습니다.');
    }

    return result;
  } catch (error) {
    console.error('추첨 확정 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '추첨 확정에 실패했습니다.',
    };
  }
};

// 다시뽑기: temp 결과 삭제
export const clearTempResults = async (
  lotteryEventId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabaseClient
      .from('lottery_temp_results')
      .delete()
      .eq('lottery_event_id', lotteryEventId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('임시 결과 삭제 실패:', error);
    return {
      success: false,
      error: '임시 결과 삭제에 실패했습니다.',
    };
  }
};
