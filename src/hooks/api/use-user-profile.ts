import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queries/queryKey';
import type { UserProfileSchemaType } from '@/lib/schemas/user-profile';

import { getCurrentUserProfile, updateProfile } from '@/lib/api/user-api';

export function useGetUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: async () => {
      const { data, error } = await getCurrentUserProfile();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
    refetchOnMount: false, // 마운트 시 재조회 방지
    refetchOnWindowFocus: false, // 포커스 시 재조회 방지
    refetchOnReconnect: false, // 재연결 시 재조회 방지
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: UserProfileSchemaType) => updateProfile(profileData),
    onSuccess: (result) => {
      if (result.success) {
        // 프로필 쿼리 무효화하여 최신 데이터 다시 가져오기
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.current(),
        });
      }
    },
  });
}
