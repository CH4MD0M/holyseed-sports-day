export const queryKeys = {
  user: {
    all: ['user'] as const,
    current: () => [...queryKeys.user.all, 'current'] as const,
  },
  checkIn: {
    all: ['checkIn'] as const,
    status: () => [...queryKeys.checkIn.all, 'status'] as const,
  },
} as const;
