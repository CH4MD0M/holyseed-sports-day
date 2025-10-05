export interface CheckInData {
  name: string | null;
  lotteryNumber: number | null;
  isEarlyBird: boolean | null;
}

export interface CheckInStatusData extends CheckInData {
  isCheckedIn: boolean;
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
