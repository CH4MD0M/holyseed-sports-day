export type Team = '청팀' | '백팀' | null;

export interface CheckInData {
  name: string | null;
  lotteryNumber: number | null;
  team?: Team; // 체크인 시에는 선택적
}

export interface CheckInStatusData extends CheckInData {
  isCheckedIn: boolean;
  team: Team; // 상태 확인 시에는 항상 포함
}

export interface CheckInResult {
  success: boolean;
  data?: CheckInData;
  error?: string;
}

export interface CheckInStatusResult {
  success: boolean;
  data?: CheckInStatusData;
  error?: string;
}
