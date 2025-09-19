export const queryKeys = {
  user: {
    all: ['user'] as const,
    current: () => [...queryKeys.user.all, 'current'] as const,
    // profile: (id: string) => [...queryKeys.user.all, 'profile', id] as const,
  },
} as const;
