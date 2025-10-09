'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { SAMPLE_RAFFLE_ITEMS } from '@/lib/mock/sample-raffle-items';

import MainLayout from '@/components/layout/main-layout';
import PrizeSummary from './_components/prize-summary';
import PrizeListItem from './_components/prize-list-item';

import styles from './page.module.css';

export default function RafflePage() {
  const path = usePathname();

  return (
    <MainLayout title="추첨 상품 관리">
      <div className={styles.container}>
        <PrizeSummary />

        <div className={styles.itemList}>
          {SAMPLE_RAFFLE_ITEMS.map((item) => {
            return <PrizeListItem key={item.id} item={item} />;
          })}
        </div>

        <Link href={`${path}/add`} className={styles.addButton}>
          <Plus size={20} /> 상품추가
        </Link>
      </div>
    </MainLayout>
  );
}
