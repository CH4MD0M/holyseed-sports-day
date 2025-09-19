import { useQuery } from '@tanstack/react-query';

import { getCurrentUserProfile } from '@/lib/api/user-api';
import { queryKeys } from '@/lib/queries/queryKey';

export function useGetCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: async () => {
      const { data, error } = await getCurrentUserProfile();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
