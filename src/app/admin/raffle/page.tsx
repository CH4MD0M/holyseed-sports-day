'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import cn from 'classnames';

import MainHeader from '@/components/header/main-header';
import s from './page.module.css';

interface RaffleItem {
  id: string;
  name: string;
  totalQuantity: number;
  usedQuantity: number;
  image?: string;
}

const SAMPLE_RAFFLE_ITEMS: RaffleItem[] = [
  {
    id: '1',
    name: '삼성 갤럭시 탭',
    totalQuantity: 1,
    usedQuantity: 1,
  },
  {
    id: '2',
    name: '에어팟 프로',
    totalQuantity: 3,
    usedQuantity: 1,
  },
  {
    id: '3',
    name: '스타벅스 기프티콘',
    totalQuantity: 5,
    usedQuantity: 3,
  },
  {
    id: '4',
    name: '치킨 쿠폰',
    totalQuantity: 10,
    usedQuantity: 7,
  },
];

export default function RafflePage() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalItems = SAMPLE_RAFFLE_ITEMS.reduce((sum, item) => sum + item.totalQuantity, 0);
  const usedItems = SAMPLE_RAFFLE_ITEMS.reduce((sum, item) => sum + item.usedQuantity, 0);
  const remainingItems = totalItems - usedItems;


  const handleMenuToggle = (itemId: string) => {
    setActiveMenuId(activeMenuId === itemId ? null : itemId);
  };

  const handleEdit = (itemId: string) => {
    // TODO: 상품 수정 페이지로 이동
    console.log('상품 수정:', itemId);
    setActiveMenuId(null);
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
            <p className={s.description}>
              추첨 진행 내역과 당첨자 정보를 확인하고 관리합니다
            </p>
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
                    <div className={s.itemImage} />
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
                    <button
                      className={s.menuButton}
                      onClick={() => handleMenuToggle(item.id)}
                    >
                      <MoreHorizontal size={12} />
                    </button>
                    {activeMenuId === item.id && (
                      <div className={s.dropdown}>
                        <button
                          className={s.dropdownItem}
                          onClick={() => handleEdit(item.id)}
                        >
                          <Edit2 size={12} />
                          수정
                        </button>
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