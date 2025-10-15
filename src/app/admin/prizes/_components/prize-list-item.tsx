'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Edit2, EllipsisVertical, Trash2 } from 'lucide-react';

import { useModalStore } from '@/store/use-modal-store';
import { useDeletePrize } from '@/hooks/use-prizes';
import type { Prize } from '@/utils/api/prizes';

import { ConfirmModal } from '@/components/modal/confirm-modal';
import styles from './prize-list-item.module.css';

interface PrizeListItemProps {
  prize: Prize;
}

const PrizeListItem = ({ prize }: PrizeListItemProps) => {
  const { openModal, closeModal } = useModalStore(['openModal', 'closeModal']);
  const { mutate: deletePrizeMutate, isPending } = useDeletePrize();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleMenuToggle = (prizeId: string) => {
    setActiveMenuId(activeMenuId === prizeId ? null : prizeId);
  };

  const handleOpenDeleteModal = (prizeId: string) => {
    openModal(
      'confirm-modal',
      <ConfirmModal
        title="상품 삭제"
        content="상품을 삭제하시겠습니까?"
        closeBtnText="아니오"
        confirmBtnText="예"
        onClose={() => closeModal('confirm-modal')}
        onConfirm={() => handleDelete(prizeId)}
      />,
    );
  };

  const handleDelete = (prizeId: string) => {
    deletePrizeMutate(prizeId, {
      onSuccess: () => {
        toast.success('상품이 삭제되었습니다.');
        setActiveMenuId(null);
        closeModal('confirm-modal');
      },
      onError: (error) => {
        console.error('상품 삭제 실패:', error);
        toast.error('상품 삭제에 실패했습니다.');
      },
    });
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    if (activeMenuId === prize.id) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId, prize.id]);

  const progressPercentage = (prize.remaining_quantity / prize.total_quantity) * 100;

  return (
    <div className={styles.itemRow}>
      <div className={styles.itemImage}>
        {prize.image_url && (
          <Image
            src={prize.image_url}
            alt={prize.name}
            width={80}
            height={80}
            className={styles.itemImageImg}
          />
        )}
      </div>

      <div className={styles.itemInfo}>
        <h3 className={styles.itemName}>{prize.name}</h3>
        <div className={styles.quantityInfo}>
          <div className={styles.progressBackground}>
            {progressPercentage > 0 && (
              <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />
            )}
          </div>
          <span className={styles.quantityText}>
            {prize.remaining_quantity}/{prize.total_quantity}개
          </span>
        </div>
      </div>

      <div className={styles.itemActions} ref={dropdownRef}>
        <button
          className={styles.menuButton}
          onClick={() => handleMenuToggle(prize.id)}
          disabled={isPending}
        >
          <EllipsisVertical size={20} />
        </button>

        <AnimatePresence>
          {activeMenuId === prize.id && (
            <motion.div
              className={styles.dropdown}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <Link
                href={`/admin/prizes/edit/${prize.id}`}
                className={styles.dropdownItem}
                onClick={() => setActiveMenuId(null)}
              >
                <Edit2 size={16} />
                수정
              </Link>
              <button
                className={cn(styles.dropdownItem, styles.delete)}
                onClick={() => handleOpenDeleteModal(prize.id)}
                disabled={isPending}
              >
                <Trash2 size={16} />
                {isPending ? '삭제 중...' : '삭제'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PrizeListItem;
