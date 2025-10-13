'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

import { type Prize } from '@/utils/api/prizes';
import s from './product-selection-modal.module.css';

interface ProductSelectionModalProps {
  items: Prize[];
  onSelect: (item: Prize) => void;
  onClose: () => void;
}

export default function ProductSelectionModal({
  items,
  onSelect,
  onClose,
}: ProductSelectionModalProps) {
  // 사용 가능한 상품만 필터링 (남은 수량이 있는 것만)
  const availableItems = items.filter((item) => item.remaining_quantity > 0);

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
              {availableItems.map((item) => (
                <button key={item.id} onClick={() => onSelect(item)} className={s.itemButton}>
                  <div className={s.itemContent}>
                    <div className={s.itemImageContainer}>
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={48}
                          height={48}
                          className={s.itemImage}
                        />
                      ) : (
                        <div className={s.itemImagePlaceholder} />
                      )}
                    </div>
                    <div className={s.itemInfo}>
                      <div className={s.itemName}>{item.name}</div>
                      <div className={s.itemCount}>{item.remaining_quantity}개 남음</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
