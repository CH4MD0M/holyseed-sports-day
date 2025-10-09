'use client';

import cn from 'classnames';
import styles from './prize-summary.module.css';

import { SAMPLE_RAFFLE_ITEMS } from '@/lib/mock/sample-raffle-items';

const PrizeSummary = () => {
  const totalItems = SAMPLE_RAFFLE_ITEMS.reduce((sum, item) => sum + item.totalQuantity, 0);
  const usedItems = SAMPLE_RAFFLE_ITEMS.reduce((sum, item) => sum + item.usedQuantity, 0);
  const remainingItems = totalItems - usedItems;

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
