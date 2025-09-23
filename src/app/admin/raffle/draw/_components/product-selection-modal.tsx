'use client';

import { X } from 'lucide-react';

import { type RaffleItem } from '../../_data/sample-raffle-items';
import s from './product-selection-modal.module.css';

interface ProductSelectionModalProps {
  items: RaffleItem[];
  onSelect: (item: RaffleItem) => void;
  onClose: () => void;
}

export default function ProductSelectionModal({
  items,
  onSelect,
  onClose,
}: ProductSelectionModalProps) {
  // 사용 가능한 상품만 필터링 (남은 수량이 있는 것만)
  const availableItems = items.filter(item => item.totalQuantity - item.usedQuantity > 0);

  const getProductEmoji = (productName: string) => {
    if (productName.includes('에어팟') || productName.includes('AirPods')) return '🎧';
    if (productName.includes('스타벅스') || productName.includes('커피')) return '☕';
    if (productName.includes('치킨') || productName.includes('쿠폰')) return '🍗';
    if (productName.includes('갤럭시') || productName.includes('탭')) return '📱';
    return '🎁';
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        {/* 모달 헤더 */}
        <div className={s.header}>
          <h3 className={s.title}>상품 선택</h3>
          <button onClick={onClose} className={s.closeButton} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        {/* 상품 목록 */}
        <div className={s.content}>
          {availableItems.length === 0 ? (
            <div className={s.emptyState}>
              <p>선택 가능한 상품이 없습니다.</p>
            </div>
          ) : (
            <div className={s.itemList}>
              {availableItems.map((item) => {
                const remainingCount = item.totalQuantity - item.usedQuantity;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={s.itemButton}
                  >
                    <div className={s.itemContent}>
                      <div className={s.itemIcon}>
                        <span className={s.emoji}>{getProductEmoji(item.name)}</span>
                      </div>
                      <div className={s.itemInfo}>
                        <div className={s.itemName}>{item.name}</div>
                        <div className={s.itemCount}>{remainingCount}개 남음</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}