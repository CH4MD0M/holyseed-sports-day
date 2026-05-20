'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPrize,
  deletePrize,
  getPrizeById,
  getPrizes,
  type PrizeInsert,
  type PrizeUpdate,
  updatePrize,
} from '@/utils/api/prizes';

/**
 * 전체 상품 목록 조회 훅
 */
export function usePrizes() {
  return useQuery({
    queryKey: ['prizes'],
    queryFn: getPrizes,
    refetchOnMount: true,
  });
}

/**
 * 특정 상품 조회 훅
 */
export function usePrize(id: string) {
  return useQuery({
    queryKey: ['prizes', id],
    queryFn: () => getPrizeById(id),
    enabled: !!id,
    refetchOnMount: true,
  });
}

/**
 * 상품 생성 훅
 */
export function useCreatePrize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prize: Omit<PrizeInsert, 'id' | 'created_at' | 'updated_at'>) =>
      createPrize(prize),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] });
    },
  });
}

/**
 * 상품 수정 훅
 */
export function useUpdatePrize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, prize }: { id: string; prize: PrizeUpdate }) => updatePrize(id, prize),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] });
      queryClient.invalidateQueries({ queryKey: ['prizes', variables.id] });
    },
  });
}

/**
 * 상품 삭제 훅
 */
export function useDeletePrize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePrize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prizes'] });
    },
  });
}
