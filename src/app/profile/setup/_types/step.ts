export const STEPS = ['name', 'department', 'birth_year', 'submit'] as const;

export type Step = (typeof STEPS)[number];
