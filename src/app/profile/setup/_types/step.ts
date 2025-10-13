export const STEPS = ['name', 'department', 'cell_group', 'birth_year', 'submit'] as const;

export type Step = (typeof STEPS)[number];
