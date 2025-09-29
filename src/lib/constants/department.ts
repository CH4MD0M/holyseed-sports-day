export const DEPARTMENTS = ['청년2부', '청년3부'] as const;

export type Department = (typeof DEPARTMENTS)[number];
