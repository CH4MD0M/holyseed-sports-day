import { supabaseClient } from '@/utils/supabase/client';

export interface UserLotteryResult {
  id: string;
  won_at: string;
  prize_name: string;
  prize_description: string | null;
  prize_image_url: string | null;
}

// 사용자의 당첨 내역 조회
export async function getLotteryResult(): Promise<UserLotteryResult | null> {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabaseClient
    .from('lottery_results')
    .select(
      `
      id,
      won_at,
      lottery_event:lottery_events!lottery_event_id (
        prize:prizes!prize_id (
          name,
          description,
          image_url
        )
      )
    `
    )
    .eq('winner_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // 당첨 안됨
    console.error('당첨 내역 조회 실패:', error);
    throw error;
  }

  // null 체크
  if (!data.won_at || !data.lottery_event?.prize) {
    return null;
  }

  return {
    id: data.id,
    won_at: data.won_at,
    prize_name: data.lottery_event.prize.name,
    prize_description: data.lottery_event.prize.description,
    prize_image_url: data.lottery_event.prize.image_url,
  };
}

// 추첨 이벤트 여부 체크
export async function checkLotteryCompleted(): Promise<boolean> {
  const { data, error } = await supabaseClient
    .from('lottery_live_status')
    .select('status')
    .single();

  if (error) return false;

  // 추첨이 완료된 상태인지 확인
  return data.status === 'completed';
}
