import { useQuery } from '@tanstack/react-query';
import { getLotteryResult } from '@/lib/api/lottery_result';

export const LOTTERY_RESULT_KEY = ['lottery-result'] as const;

export const useGetLotteryResult = () => {
  return useQuery({
    queryKey: LOTTERY_RESULT_KEY,
    queryFn: getLotteryResult,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
