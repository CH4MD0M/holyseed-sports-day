'use client';

import { useState } from 'react';
import { updateLotteryStatus } from '@/lib/api/draw-status-api';

import MainLayout from '@/components/layout/main-layout';
import DrawSetting from './_components/draw-setting';
import styles from './page.module.css';

type LotteryStatus = 'not_started' | 'announcing' | 'drawing' | 'revealing' | 'completed';

export default function DrawPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: LotteryStatus) => {
    setIsLoading(true);
    try {
      await updateLotteryStatus(status);
      // await updateLotteryStatus('not_started');
      console.log('상태 변경 완료');
    } catch (err) {
      console.error('상태 변경 실패:', err);
      alert(err instanceof Error ? err.message : '상태 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="추첨 진행">
      <div className={styles.container}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            className={styles.announceButton}
            onClick={() => handleStatusChange('not_started')}
            disabled={isLoading}
          >
            {isLoading ? '상태 변경 중...' : '초기 상태'}
          </button>
          <button
            className={styles.announceButton}
            onClick={() => handleStatusChange('announcing')}
            disabled={isLoading}
          >
            {isLoading ? '상태 변경 중...' : '추첨 시작 알림'}
          </button>
          <button
            className={styles.announceButton}
            onClick={() => handleStatusChange('completed')}
            disabled={isLoading}
          >
            {isLoading ? '상태 변경 중...' : '추첨 종료'}
          </button>
        </div>

        <DrawSetting />
      </div>
    </MainLayout>
  );
}
