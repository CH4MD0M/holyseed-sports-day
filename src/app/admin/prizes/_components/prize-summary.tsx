'use client';

import cn from 'classnames';
import styles from './prize-summary.module.css';

import type { Prize } from '@/utils/api/prizes';

interface PrizeSummaryProps {
  prizes: Prize[];
}

const PrizeSummary = ({ prizes }: PrizeSummaryProps) => {
  // 총 상품 수량 계산
  const totalItems = prizes.reduce((sum, prize) => sum + prize.total_quantity, 0);

  // 남은 수량 계산
  const remainingItems = prizes.reduce((sum, prize) => sum + prize.remaining_quantity, 0);

  // 사용된 수량 = 총 수량 - 남은 수량
  const usedItems = totalItems - remainingItems;

  return (
    <div className={styles.statsCard}>
      <div className={styles.statItem}>
        <div className={styles.statNumber}>{totalItems}</div>
        <div className={styles.statLabel}>총 상품</div>
      </div>
      <div className={styles.divider} />
      <div className={styles.statItem}>
        <div className={cn(styles.statNumber, styles.used)}>{usedItems}</div>
        <div className={styles.statLabel}>사용됨</div>
      </div>
      <div className={styles.divider} />
      <div className={styles.statItem}>
        <div className={cn(styles.statNumber, styles.remaining)}>{remainingItems}</div>
        <div className={styles.statLabel}>남은 개수</div>
      </div>
    </div>
  );
};

export default PrizeSummary;
