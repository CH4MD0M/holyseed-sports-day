'use client';

import { useState } from 'react';
import { updateLotteryStatus } from '@/lib/api/draw-status-api';

import MainLayout from '@/components/layout/main-layout';
import DrawSetting from './_components/draw-setting';
import styles from './page.module.css';

export default function DrawPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleAnnounce = async () => {
    setIsLoading(true);
    try {
      await updateLotteryStatus('announcing');
      // await updateLotteryStatus('not_started');
      console.log('announcing 상태로 변경 완료');
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
        <button className={styles.announceButton} onClick={handleAnnounce} disabled={isLoading}>
          {isLoading ? '상태 변경 중...' : '추첨 시작 알림'}
        </button>

        <DrawSetting />
      </div>
    </MainLayout>
  );
}
