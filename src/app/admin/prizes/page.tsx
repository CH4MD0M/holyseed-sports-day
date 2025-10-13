'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

import { usePrizes } from '@/hooks/use-prizes';

import MainLayout from '@/components/layout/main-layout';
import PrizeSummary from './_components/prize-summary';
import PrizeListItem from './_components/prize-list-item';

import styles from './page.module.css';

export default function RafflePage() {
  const { data: prizes = [] } = usePrizes();

  return (
    <MainLayout title="추첨 상품 관리">
      <div className={styles.container}>
        <PrizeSummary prizes={prizes} />

        <div className={styles.itemList}>
          {prizes.map((prize) => {
            return <PrizeListItem key={prize.id} prize={prize} />;
          })}
        </div>

        <Link href="/admin/prizes/add" className={styles.addButton}>
          <Plus size={20} /> 상품추가
        </Link>
      </div>
    </MainLayout>
  );
}
