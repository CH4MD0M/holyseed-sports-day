import { supabaseClient } from '@/utils/supabase/client';

export interface TeamCheckInStats {
  blueTeamCount: number;
  whiteTeamCount: number;
  totalCheckInCount: number;
}

export interface TeamCheckInStatsResult {
  success: boolean;
  data?: TeamCheckInStats;
  error?: string;
}

export const getTeamCheckInStats = async (): Promise<TeamCheckInStatsResult> => {
  try {
    // 전체 체크인 수
    const { count: totalCount, error: totalError } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('checked_in', true);

    if (totalError) throw totalError;

    // 청팀 체크인 수
    const { count: blueCount, error: blueError } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('checked_in', true)
      .eq('team', '청팀');

    if (blueError) throw blueError;

    // 백팀 체크인 수
    const { count: whiteCount, error: whiteError } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('checked_in', true)
      .eq('team', '백팀');

    if (whiteError) throw whiteError;

    return {
      success: true,
      data: {
        blueTeamCount: blueCount ?? 0,
        whiteTeamCount: whiteCount ?? 0,
        totalCheckInCount: totalCount ?? 0,
      },
    };
  } catch (error) {
    console.error('팀별 체크인 현황 조회 실패:', error);
    return {
      success: false,
      error: '팀별 체크인 현황을 가져오는데 실패했습니다.',
    };
  }
};
