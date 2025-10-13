'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServer } from '@/utils/supabase/server';


export type LotteryMode = 'all' | 'early_bird' | 'team_specific';

/**
 * 추첨 실행 결과 타입
 */
export interface ConductLotteryResult {
  lottery_event_id: string;
  winners: Array<{
    user_id: string;
    name: string;
    team: string | null;
    department: string | null;
  }>;
}

/**
 * 추첨 히스토리 아이템 타입
 */
export interface LotteryHistoryItem {
  id: string;
  winner_name: string;
  department: string | null;
  team: string | null;
  prize_id: string;
  prize_name: string;
  prize_image_url: string | null;
  won_at: string;
  lottery_mode: string;
  target_team: string | null;
}

/**
 * 팀 통계 타입
 */
export interface TeamStats {
  teamA: number;
  teamB: number;
  total: number;
}

/**
 * 대상자 수 타입
 */
export interface EligibleCounts {
  all: number;
  early_bird: number;
  team_a: number;
  team_b: number;
}

/**
 * 추첨 실행
 * PostgreSQL의 conduct_lottery 함수 호출
 */
export async function conductLottery(
  prizeId: string,
  winnerCount: number,
  lotteryMode: LotteryMode,
  targetTeam?: string | null,
): Promise<ConductLotteryResult> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc('conduct_lottery', {
    p_prize_id: prizeId,
    p_winner_count: winnerCount,
    p_lottery_mode: lotteryMode,
    p_target_team: (targetTeam ?? undefined) as string | undefined,
  });

  if (error) {
    console.error('추첨 실행 실패:', error);
    throw new Error(error.message || '추첨 실행에 실패했습니다.');
  }

  revalidatePath('/admin/draw');
  revalidatePath('/admin/draw-history');
  revalidatePath('/admin/prizes');

  return data as unknown as ConductLotteryResult;
}

/**
 * 추첨 히스토리 조회
 */
export async function getLotteryHistory(): Promise<LotteryHistoryItem[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from('lottery_results')
    .select(
      `
      id,
      won_at,
      winner_id,
      profiles!lottery_results_winner_id_fkey (
        name,
        department,
        team
      ),
      lottery_events!lottery_results_lottery_event_id_fkey (
        lottery_mode,
        target_team,
        prize_id,
        prizes!lottery_events_prize_id_fkey (
          name,
          image_url
        )
      )
    `,
    )
    .order('won_at', { ascending: false });

  if (error) {
    console.error('추첨 히스토리 조회 실패:', error);
    throw new Error('추첨 히스토리를 불러오는데 실패했습니다.');
  }

  // 데이터 변환
  return (data || []).map((item) => ({
    id: item.id,
    winner_name: item.profiles?.name || '알 수 없음',
    department: item.profiles?.department || null,
    team: item.profiles?.team || null,
    prize_id: item.lottery_events?.prize_id || '',
    prize_name: item.lottery_events?.prizes?.name || '알 수 없는 상품',
    prize_image_url: item.lottery_events?.prizes?.image_url || null,
    won_at: item.won_at || new Date().toISOString(),
    lottery_mode: item.lottery_events?.lottery_mode || 'all',
    target_team: item.lottery_events?.target_team || null,
  }));
}

/**
 * 팀별 체크인 통계 조회
 */
export async function getTeamStats(): Promise<TeamStats> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from('profiles')
    .select('team')
    .eq('checked_in', true);

  if (error) {
    console.error('팀 통계 조회 실패:', error);
    throw new Error('팀 통계를 불러오는데 실패했습니다.');
  }

  const teamA = (data || []).filter((p) => p.team === '팀A').length;
  const teamB = (data || []).filter((p) => p.team === '팀B').length;

  return {
    teamA,
    teamB,
    total: teamA + teamB,
  };
}

/**
 * 추첨 모드별 대상자 수 조회
 * 이미 당첨된 사람은 제외
 */
export async function getEligibleParticipantsCount(): Promise<EligibleCounts> {
  const supabase = await supabaseServer();

  // 이미 당첨된 사람 ID 목록
  const { data: winners } = await supabase.from('lottery_results').select('winner_id');

  const winnerIds = (winners || []).map((w) => w.winner_id).filter((id) => id !== null);

  // 체크인한 사람 중 당첨되지 않은 사람들
  let query = supabase.from('profiles').select('team, is_early_bird').eq('checked_in', true);

  if (winnerIds.length > 0) {
    query = query.not('id', 'in', `(${winnerIds.join(',')})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('대상자 수 조회 실패:', error);
    throw new Error('대상자 수를 불러오는데 실패했습니다.');
  }

  const profiles = data || [];

  const all = profiles.length;
  const early_bird = profiles.filter((p) => p.is_early_bird === true).length;
  const team_a = profiles.filter((p) => p.team === '팀A').length;
  const team_b = profiles.filter((p) => p.team === '팀B').length;

  return {
    all,
    early_bird,
    team_a,
    team_b,
  };
}
