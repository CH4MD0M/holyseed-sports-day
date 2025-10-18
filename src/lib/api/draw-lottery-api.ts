import { supabaseClient } from '@/utils/supabase/client';

type LotteryMode = 'all' | 'team_specific';
type Team = '청팀' | '백팀' | null;

interface ConductLotteryParams {
  prizeId: string;
  winnerCount: number;
  lotteryMode: LotteryMode;
  targetTeam: Team;
}

interface Winner {
  user_id: string;
  name: string;
  team: string;
  department: string;
  lottery_number: number | null;
}

interface ConductLotteryResponse {
  success: boolean;
  lottery_event_id: string;
  winners: Winner[];
}

export async function conductLottery(
  params: ConductLotteryParams
): Promise<ConductLotteryResponse> {
  const { data, error } = await supabaseClient.functions.invoke('conduct-lottery', {
    body: {
      prizeId: params.prizeId,
      winnerCount: params.winnerCount,
      lotteryMode: params.lotteryMode,
      targetTeam: params.targetTeam,
    },
  });

  if (error) {
    throw new Error(error.message || '추첨 요청 중 오류가 발생했습니다.');
  }

  if (!data.success) {
    throw new Error(data.error || '추첨에 실패했습니다.');
  }

  return data;
}

// 추첨 확정
export async function confirmLottery(lotteryEventId: string): Promise<void> {
  const { data, error } = await supabaseClient.functions.invoke('confirm-lottery', {
    body: {
      lotteryEventId,
    },
  });

  if (error) {
    throw new Error(error.message || '확정 요청 중 오류가 발생했습니다.');
  }

  if (!data.success) {
    throw new Error(data.error || '확정에 실패했습니다.');
  }
}

// 다시뽑기: temp 결과 삭제
export async function clearTempResults(lotteryEventId: string): Promise<void> {
  const { error } = await supabaseClient
    .from('lottery_temp_results')
    .delete()
    .eq('lottery_event_id', lotteryEventId);

  if (error) {
    throw new Error('임시 결과 삭제에 실패했습니다.');
  }
}
