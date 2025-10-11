import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queries/queryKey';
import { checkInUser, getCheckInStatus } from '@/lib/api/check-in-api';

export const useCheckInStatus = () => {
  return useQuery({
    queryKey: queryKeys.checkIn.status(),
    queryFn: getCheckInStatus,
    select: (result) => (result.success ? result.data : undefined),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkInUser,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.checkIn.status(),
        });
      }
    },
  });
};
