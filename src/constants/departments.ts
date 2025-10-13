/**
 * 부서 목록
 * DB의 department enum과 동기화 필요
 */
export const DEPARTMENTS = ['청년2부', '청년3부'] as const;

export type Department = (typeof DEPARTMENTS)[number];

/**
 * 부서별 색상 설정
 * UI에서 사용되는 부서별 색상 테마
 */
export interface DepartmentColors {
  background: string;
  text: string;
}

export const DEPARTMENT_COLORS: Record<string, DepartmentColors> = {
  청년2부: {
    background: '#D6E7FD',
    text: '#1E40AF',
  },
  청년3부: {
    background: '#DBEAFE',
    text: '#166534',
  },
};

/**
 * 기본 부서 색상 (부서 정보가 없는 경우)
 */
export const DEFAULT_DEPARTMENT_COLORS: DepartmentColors = {
  background: '#E5E7EB',
  text: '#374151',
};
