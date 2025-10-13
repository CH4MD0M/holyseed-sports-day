'use client';

import { useQuery } from '@tanstack/react-query';
import { getLotteryHistory } from '@/utils/api/lottery';

/**
 * 추첨 히스토리 조회 훅
 */
export function useLotteryHistory() {
  return useQuery({
    queryKey: ['lottery', 'history'],
    queryFn: getLotteryHistory,
  });
}
