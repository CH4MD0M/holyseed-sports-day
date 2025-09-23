'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';

import MainHeader from '@/components/header/main-header';
import { SAMPLE_RAFFLE_ITEMS } from './_data/sample-raffle-items';
import s from './page.module.css';

export default function RafflePage() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalItems = SAMPLE_RAFFLE_ITEMS.reduce((sum, item) => sum + item.totalQuantity, 0);
  const usedItems = SAMPLE_RAFFLE_ITEMS.reduce((sum, item) => sum + item.usedQuantity, 0);
  const remainingItems = totalItems - usedItems;

  const handleMenuToggle = (itemId: string) => {
    setActiveMenuId(activeMenuId === itemId ? null : itemId);
  };

  const handleDelete = (itemId: string) => {
    // TODO: 상품 삭제 기능
    console.log('상품 삭제:', itemId);
    setActiveMenuId(null);
  };

  return (
    <div className={s.container}>
      <MainHeader />

      <main className={s.main}>
        <div className={s.header}>
          <div className={s.headerContent}>
            <h1 className={s.title}>추첨 이력</h1>
            <p className={s.description}>추첨 진행 내역과 당첨자 정보를 확인하고 관리합니다</p>
          </div>
          <Link href="/admin/raffle/add" className={s.addButton}>
            <Plus size={14} />
            상품 추가
          </Link>
        </div>

        <div className={s.content}>
          <div className={s.statsCard}>
            <div className={s.statItem}>
              <div className={s.statNumber}>{totalItems}</div>
              <div className={s.statLabel}>총 상품 개수</div>
            </div>
            <div className={s.divider} />
            <div className={s.statItem}>
              <div className={cn(s.statNumber, s.used)}>{usedItems}</div>
              <div className={s.statLabel}>사용된 개수</div>
            </div>
            <div className={s.divider} />
            <div className={s.statItem}>
              <div className={cn(s.statNumber, s.remaining)}>{remainingItems}</div>
              <div className={s.statLabel}>남은 개수</div>
            </div>
          </div>

          <div className={s.itemList}>
            {SAMPLE_RAFFLE_ITEMS.map((item) => {
              const progressPercentage = (item.usedQuantity / item.totalQuantity) * 100;

              return (
                <div key={item.id} className={s.itemRow}>
                  <div className={s.itemContent}>
                    <div className={s.itemImage}>
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className={s.itemImageImg}
                        />
                      )}
                    </div>
                    <div className={s.itemInfo}>
                      <h3 className={s.itemName}>{item.name}</h3>
                      <div className={s.quantityInfo}>
                        <span className={s.quantityLabel}>수량:</span>
                        <div className={s.quantityContainer}>
                          <div className={s.progressBackground}>
                            {progressPercentage > 0 && (
                              <div
                                className={s.progressBar}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            )}
                          </div>
                          <span className={s.quantityText}>
                            {item.usedQuantity}/{item.totalQuantity}개
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={s.itemActions}>
                    <button className={s.menuButton} onClick={() => handleMenuToggle(item.id)}>
                      <MoreHorizontal size={12} />
                    </button>
                    {activeMenuId === item.id && (
                      <div className={s.dropdown}>
                        <Link
                          href={`/admin/raffle/edit/${item.id}`}
                          className={s.dropdownItem}
                          onClick={() => setActiveMenuId(null)}
                        >
                          <Edit2 size={12} />
                          수정
                        </Link>
                        <button
                          className={cn(s.dropdownItem, s.delete)}
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={12} />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
