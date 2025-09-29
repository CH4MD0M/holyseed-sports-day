import dayjs from 'dayjs';

export type Department = '청년2부' | '청년3부';

export interface RaffleHistory {
  id: string;
  winnerName: string;
  department: Department;
  group: string;
  productId: string; // SAMPLE_RAFFLE_ITEMS의 id와 연결
  raffleTime: Date;
}

export interface DepartmentConfig {
  name: Department;
  colors: {
    background: string;
    text: string;
  };
}

export const DEPARTMENT_CONFIGS: Record<Department, DepartmentConfig> = {
  '청년2부': {
    name: '청년2부',
    colors: {
      background: '#D6E7FD',
      text: '#1E40AF',
    },
  },
  '청년3부': {
    name: '청년3부',
    colors: {
      background: '#DBEAFE',
      text: '#166534',
    },
  },
};

export const SAMPLE_RAFFLE_HISTORY: RaffleHistory[] = [
  {
    id: '1',
    winnerName: '김민수',
    department: '청년2부',
    group: '96또래',
    productId: '1', // 삼성 갤럭시 탭
    raffleTime: dayjs().subtract(1, 'minute').toDate(),
  },
  {
    id: '2',
    winnerName: '박지영',
    department: '청년3부',
    group: '91또래',
    productId: '2', // 에어팟 프로
    raffleTime: dayjs().subtract(3, 'minute').toDate(),
  },
  {
    id: '3',
    winnerName: '이준호',
    department: '청년2부',
    group: '95또래',
    productId: '3', // 스타벅스 기프티콘
    raffleTime: dayjs().subtract(5, 'minute').toDate(),
  },
  {
    id: '4',
    winnerName: '최수진',
    department: '청년3부',
    group: '92또래',
    productId: '4', // 치킨 쿠폰
    raffleTime: dayjs().subtract(8, 'minute').toDate(),
  },
  {
    id: '5',
    winnerName: '김지누',
    department: '청년3부',
    group: '94또래',
    productId: '4', // 치킨 쿠폰
    raffleTime: dayjs().subtract(8, 'minute').toDate(),
  },
  {
    id: '6',
    winnerName: '신동혁',
    department: '청년2부',
    group: '97또래',
    productId: '2', // 에어팟 프로
    raffleTime: dayjs().subtract(15, 'minute').toDate(),
  },
];

export const getProductByHistoryId = (historyId: string) => {
  return SAMPLE_RAFFLE_HISTORY.find(history => history.id === historyId);
};