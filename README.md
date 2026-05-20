# 🏃‍♂️ 홀리씨드 체육대회 (Holyseed Sports Day)

체육대회를 위한 이벤트 관리 웹 애플리케이션입니다.
팀 매칭, 체크인, 실시간 추첨 등 체육대회에 필요한 기능을 제공합니다.

<br/>

## 기술 스택

### Frontend

- Next.js15, React19, TypeScript, CSS Modules, Framer Motion, Lucide React
- Zustand, Immer, TanStack Query, React Hook Form, Zod

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Kakao OAuth)
- **Real-time**: Supabase Realtime

<br/>

## 주요 기능

### 👤 프로필 관리

- **카카오 소셜 로그인** - 간편한 카카오톡 계정 연동
- **3단계 프로필 설정**
  1. 기본 정보 입력 (이름, 부서, 출생년도)
  2. 셀 그룹 선택
  3. 리더 선택을 통한 자동 팀 배정
- 프로필 수정 및 조회

<br/>

### 📍 체크인 시스템

- 행사 당일 체크인 기능
- 체크인 시 자동 추첨 번호 부여
- 얼리버드 체크인 상태 트래킹
- 체크인 가능 시간 제한

<br/>

### 🎯 실시간 추첨 시스템

- **관리자 추첨 제어**
  - 경품별 추첨 진행
  - 당첨자 수 설정
  - 추첨 이력 관리
- **실시간 추첨 화면**
  - 참가자용 라이브 뷰
  - 애니메이션 효과를 통한 당첨자 발표
  - 추첨 결과 확인
- 데이터베이스 함수 기반 공정한 추첨 로직

<br/>

### 🎁 경품 관리

- 경품 등록 및 수정
- 경품 목록 조회
- 재고 수량 관리

<br/>

### 👥 팀 관리

- 청팀 / 백팀 자동 배정
- 셀 그룹별 팀 구성
- 팀 현황 조회

<br/>

### 📅 일정 안내

- 행사 일정 조회

<br/><br/>

## 주요 화면

### 메인 화면

<!-- 메인 랜딩 페이지 스크린샷 -->

<br/>

### 로그인

<!-- 카카오 로그인 화면 스크린샷 -->

<br/>

### 프로필 설정

<!-- 3단계 프로필 설정 과정 스크린샷 -->

<br/>

### 체크인

<!-- 체크인 화면 스크린샷 -->

<br/>

### 실시간 추첨

<!-- 추첨 진행 화면 스크린샷 -->

<br/>

### 추첨 결과

<!-- 당첨자 발표 화면 스크린샷 -->

<br/>

### 관리자 대시보드

<!-- 관리자 추첨 제어 화면 스크린샷 -->

<br/><br/>

## 📂 프로젝트 구조

```
holyseed-sports-day/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   │   ├── admin/        # 관리자 페이지
│   │   ├── profile/      # 프로필 관련 페이지
│   │   ├── draw/         # 추첨 화면
│   │   └── ...
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── hooks/           # 커스텀 React 훅
│   ├── lib/             # 비즈니스 로직
│   │   ├── api/         # Supabase API 래퍼
│   │   ├── schemas/     # Zod 스키마
│   │   └── queries/     # React Query 키 팩토리
│   ├── store/           # Zustand 스토어
│   ├── types/           # TypeScript 타입 정의
│   └── utils/           # 유틸리티 함수
├── public/              # 정적 파일
└── ...
```

<br/><br/>

## Database

![schema](/docs/supabase-schema.png)

### 주요 테이블

- `profiles` - 사용자 프로필, 팀 배정, 추첨 번호
- `cell_groups` - 부서 및 팀별 셀 그룹
- `prizes` - 경품 목록 및 재고
- `lottery_events` - 추첨 이벤트
- `lottery_results` - 추첨 결과 및 당첨자
- `lottery_live_status` - 실시간 추첨 상태

### 열거형 (Enums)

- `department_type`: "청년2부" | "청년3부"
- `team_type`: "청팀" | "백팀"
- `user_role`: "user" | "admin" | "developer"

<br/><br/>

## 주요 기능 구현 방식

### 인증 시스템

Kakao OAuth를 Supabase Auth와 연동하여 소셜 로그인을 구현했습니다.

```typescript
const { error } = await supabaseClient.auth.signInWithOAuth({
  provider: 'kakao',
  options: {
    redirectTo: location.origin + '/auth/callback',
  },
});
```

미들웨어를 통해 라우트 보호 및 세션 관리가 자동으로 이루어집니다.

- 보호된 라우트(`/profile/*`)는 로그인하지 않으면 접근 불가
- 쿠키 기반 SSR 세션으로 서버/클라이언트 간 인증 상태 동기화

```typescript
// middleware.ts
const protectedRoutes = ['/profile'];

const {
  data: { user },
} = await supabase.auth.getUser();

if (isProtectedRoute && !user) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```

<br/>

### 팀 자동 배정

프로필 설정은 다단계 폼(Multi-step Form)으로 구현되어 있습니다.
사용자가 선택한 셀 그룹의 리더 정보를 기반으로 팀이 자동 배정됩니다.

```typescript
// useProfileStep 훅을 통한 단계별 자동 진행
const [currentStep] = useProfileStep({ control, trigger });
// 'name' -> 'department' -> 'cell_group' -> 'birth_year' -> 'submit'
```

각 단계는 Zod 스키마로 실시간 검증되며, 유효한 입력이 완료되면 자동으로 다음 단계로 진행됩니다.

<br/>

### 추첨 시스템

PostgreSQL의 `conduct_lottery()` 함수를 통해 서버 사이드에서 공정하게 처리됩니다.
추첨 모드(전체/얼리버드/팀별), 경품, 당첨자 수를 파라미터로 받아 처리합니다.

```typescript
const { data, error } = await supabase.rpc('conduct_lottery', {
  p_prize_id: prizeId,
  p_winner_count: winnerCount,
  p_lottery_mode: lotteryMode, // 'all' | 'early_bird' | 'team_specific'
  p_target_team: targetTeam,
});
```

데이터베이스 함수로 처리하여:

- 트랜잭션 보장 (당첨자 선정 + 기록 + 재고 차감)
- 중복 당첨 방지
- 동시성 문제 해결

<br/>

### 실시간 동기화

Supabase Realtime을 활용하여 추첨 진행 상황이 모든 참가자 화면에 실시간으로 반영됩니다.

```typescript
// lottery_live_status 테이블 구독
supabase
  .channel('lottery-status')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'lottery_live_status' },
    (payload) => {
      // 추첨 상태 업데이트를 모든 클라이언트가 실시간으로 수신
    }
  )
  .subscribe();
```

관리자가 추첨을 진행하면 DB 변경이 즉시 모든 사용자 화면에 반영됩니다.
