import { supabaseClient } from '@/utils/supabase/client';

const LOTTERY_STATUS_ID = '580536d6-4ccd-48e5-8714-5151888a6a29';
type LotteryStatus = 'not_started' | 'announcing' | 'drawing' | 'revealing' | 'completed';

export async function updateLotteryStatus(status: LotteryStatus): Promise<void> {
  const { error } = await supabaseClient
    .from('lottery_live_status')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', LOTTERY_STATUS_ID);

  if (error) {
    throw new Error(`상태 변경 실패: ${error.message}`);
  }
}
