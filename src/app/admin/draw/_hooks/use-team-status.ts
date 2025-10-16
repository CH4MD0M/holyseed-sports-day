import { useQuery } from '@tanstack/react-query';
import { getTeamCheckInStats } from '@/lib/api/team-check-api';

export const useTeamCheckInStats = () => {
  return useQuery({
    queryKey: ['teamCheckInStats'],
    queryFn: getTeamCheckInStats,
    select: (result) => (result.success ? result.data : undefined),
    // refetchInterval: 5000, // 5초마다 자동 갱신 (실시간 현황용)
  });
};
