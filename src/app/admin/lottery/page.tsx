'use client';

import { useState } from 'react';
import { supabaseClient } from '@/utils/supabase/client';

import PageLayout from '@/components/layout/page-layout';

interface LotteryWinner {
  user_id: string;
  name: string;
  team: string;
  department: string | null;
}

interface LotteryResult {
  lottery_event_id: string;
  winners: LotteryWinner[];
}

// FIXME: 추첨 테스트 페이지. 나중에 변경
const LotteryPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LotteryResult | null>(null);

  const conductLottery = async (
    prizeId: string,
    winnerCount: number,
    lotteryMode: 'all' | 'early_bird' | 'team_specific',
    targetTeam?: string
  ) => {
    try {
      setLoading(true);
      console.log('추첨 시작:', { prizeId, winnerCount, lotteryMode, targetTeam });

      const { data, error } = await supabaseClient.rpc('conduct_lottery', {
        p_prize_id: prizeId,
        p_winner_count: winnerCount,
        p_lottery_mode: lotteryMode,
        p_target_team: targetTeam,
      });

      if (error) {
        console.error('추첨 에러:', error);
        alert(`추첨 실패: ${error.message}`);
        return;
      }

      // 타입 단언을 사용하여 올바른 타입으로 변환

      setResult(data as unknown as LotteryResult);

      console.log('추첨 성공:', data);
    } catch (error) {
      console.error('추첨 예외:', error);
      alert(`추첨 실패: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // 하드코딩된 테스트 상품 ID들 (실제 DB에 있는 상품 ID로 교체 필요)
  const testPrizeIds = {
    airpods: '1897f4ce-5531-4101-8ff3-41af83342426', // 에어팟 프로
    starbucks: '5f3a0867-0d55-4d31-89ff-046b157bd43b', // 스타벅스 기프티콘
    chicken: '3db77661-a8e8-4679-9dde-3b1b4084bc90', // 치킨 쿠폰
  };

  return (
    <PageLayout title="추첨 진행">
      <div>
        {/* 추첨 테스트 버튼들 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            margin: '20px 0',
            padding: '20px',
            border: '2px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <h3>🎲 추첨 테스트</h3>

          <button
            onClick={() => conductLottery(testPrizeIds.airpods, 1, 'all')}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '추첨 중...' : '전체 추첨 (에어팟 1명)'}
          </button>

          <button
            onClick={() => conductLottery(testPrizeIds.starbucks, 2, 'early_bird')}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '추첨 중...' : '얼리버드 추첨 (스타벅스 2명)'}
          </button>

          <button
            onClick={() => conductLottery(testPrizeIds.chicken, 1, 'team_specific', 'A')}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '추첨 중...' : '팀별 추첨 (치킨 1명, 팀A)'}
          </button>
        </div>

        {/* 추첨 결과 표시 */}
        {result && (
          <div
            style={{
              margin: '20px 0',
              padding: '20px',
              backgroundColor: '#f0f8ff',
              border: '2px solid #0066cc',
              borderRadius: '8px',
            }}
          >
            <h3>🎉 추첨 결과</h3>
            <p>
              {result.winners.map((winner) => {
                return <strong key={winner.user_id}>{winner.name}</strong>;
              })}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default LotteryPage;
