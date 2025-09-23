import dayjs from 'dayjs';

export type Department = '청년2부' | '청년3부';
export type Team = '팀A' | '팀B';

export interface Participant {
  id: string;
  name: string;
  department: Department;
  group: string;
  team: Team;
  isEarlyBird: boolean; // 일찍 체크인한 참가자 여부
  checkInTime: Date;
}

export interface RaffleWinner {
  participant: Participant;
  productId: string;
  raffleTime: Date;
}

export const SAMPLE_PARTICIPANTS: Participant[] = [
  // 팀A - 청년2부
  {
    id: '1',
    name: '김민수',
    department: '청년2부',
    group: '96또래',
    team: '팀A',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(2, 'hour').toDate(),
  },
  {
    id: '2',
    name: '이준호',
    department: '청년2부',
    group: '95또래',
    team: '팀A',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(30, 'minute').toDate(),
  },
  {
    id: '3',
    name: '신동혁',
    department: '청년2부',
    group: '97또래',
    team: '팀A',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(90, 'minute').toDate(),
  },
  {
    id: '4',
    name: '박현우',
    department: '청년2부',
    group: '96또래',
    team: '팀A',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(45, 'minute').toDate(),
  },
  {
    id: '5',
    name: '최민호',
    department: '청년2부',
    group: '95또래',
    team: '팀A',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(75, 'minute').toDate(),
  },
  {
    id: '6',
    name: '정승우',
    department: '청년2부',
    group: '94또래',
    team: '팀A',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(20, 'minute').toDate(),
  },
  {
    id: '7',
    name: '김철수',
    department: '청년2부',
    group: '95또래',
    team: '팀A',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(100, 'minute').toDate(),
  },
  {
    id: '8',
    name: '이태호',
    department: '청년2부',
    group: '96또래',
    team: '팀A',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(15, 'minute').toDate(),
  },

  // 팀B - 청년3부
  {
    id: '9',
    name: '박지영',
    department: '청년3부',
    group: '91또래',
    team: '팀B',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(110, 'minute').toDate(),
  },
  {
    id: '10',
    name: '최수진',
    department: '청년3부',
    group: '92또래',
    team: '팀B',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(25, 'minute').toDate(),
  },
  {
    id: '11',
    name: '김지누',
    department: '청년3부',
    group: '94또래',
    team: '팀B',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(85, 'minute').toDate(),
  },
  {
    id: '12',
    name: '이하늘',
    department: '청년3부',
    group: '93또래',
    team: '팀B',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(35, 'minute').toDate(),
  },
  {
    id: '13',
    name: '정미영',
    department: '청년3부',
    group: '92또래',
    team: '팀B',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(95, 'minute').toDate(),
  },
  {
    id: '14',
    name: '한소연',
    department: '청년3부',
    group: '91또래',
    team: '팀B',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(40, 'minute').toDate(),
  },
  {
    id: '15',
    name: '윤서현',
    department: '청년3부',
    group: '93또래',
    team: '팀B',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(80, 'minute').toDate(),
  },

  // 추가 팀A 참가자들
  {
    id: '16',
    name: '조성민',
    department: '청년2부',
    group: '97또래',
    team: '팀A',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(10, 'minute').toDate(),
  },
  {
    id: '17',
    name: '임재현',
    department: '청년2부',
    group: '96또래',
    team: '팀A',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(105, 'minute').toDate(),
  },
  {
    id: '18',
    name: '강동원',
    department: '청년2부',
    group: '94또래',
    team: '팀A',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(50, 'minute').toDate(),
  },
  {
    id: '19',
    name: '송민재',
    department: '청년2부',
    group: '95또래',
    team: '팀A',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(70, 'minute').toDate(),
  },

  // 추가 팀B 참가자들
  {
    id: '20',
    name: '김예린',
    department: '청년3부',
    group: '94또래',
    team: '팀B',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(30, 'minute').toDate(),
  },
  {
    id: '21',
    name: '박서연',
    department: '청년3부',
    group: '92또래',
    team: '팀B',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(120, 'minute').toDate(),
  },
  {
    id: '22',
    name: '이채영',
    department: '청년3부',
    group: '91또래',
    team: '팀B',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(55, 'minute').toDate(),
  },
  {
    id: '23',
    name: '정다은',
    department: '청년3부',
    group: '93또래',
    team: '팀B',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(65, 'minute').toDate(),
  },
  {
    id: '24',
    name: '최윤아',
    department: '청년3부',
    group: '94또래',
    team: '팀B',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(18, 'minute').toDate(),
  },
  {
    id: '25',
    name: '한지민',
    department: '청년3부',
    group: '92또래',
    team: '팀B',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(88, 'minute').toDate(),
  },
  {
    id: '26',
    name: '윤채원',
    department: '청년3부',
    group: '91또래',
    team: '팀B',
    isEarlyBird: false,
    checkInTime: dayjs().subtract(42, 'minute').toDate(),
  },
  {
    id: '27',
    name: '김하늘',
    department: '청년3부',
    group: '93또래',
    team: '팀B',
    isEarlyBird: true,
    checkInTime: dayjs().subtract(92, 'minute').toDate(),
  },
];

// 팀별 참가자 통계
export const getTeamStats = () => {
  const teamA = SAMPLE_PARTICIPANTS.filter(p => p.team === '팀A');
  const teamB = SAMPLE_PARTICIPANTS.filter(p => p.team === '팀B');

  return {
    teamA: teamA.length,
    teamB: teamB.length,
    total: SAMPLE_PARTICIPANTS.length,
  };
};

// 얼리버드 참가자 필터링
export const getEarlyBirdParticipants = () => {
  return SAMPLE_PARTICIPANTS.filter(p => p.isEarlyBird);
};

// 팀별 참가자 필터링
export const getParticipantsByTeam = (team: Team) => {
  return SAMPLE_PARTICIPANTS.filter(p => p.team === team);
};

// 추첨 대상자 필터링 (추첨 모드에 따라)
export const getDrawTargets = (
  mode: '전체' | '얼리버드' | '팀별',
  selectedTeam?: Team
) => {
  let targets = SAMPLE_PARTICIPANTS;

  if (mode === '얼리버드') {
    targets = getEarlyBirdParticipants();
  } else if (mode === '팀별' && selectedTeam) {
    targets = getParticipantsByTeam(selectedTeam);
  }

  return targets;
};

// 랜덤 추첨 함수 (시뮬레이션)
export const drawRandomWinner = (
  participants: Participant[]
): Participant | null => {
  if (participants.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * participants.length);
  return participants[randomIndex];
};