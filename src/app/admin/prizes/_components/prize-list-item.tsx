'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'classnames';
import { EllipsisVertical, Edit2, Trash2 } from 'lucide-react';

import { type RaffleItem } from '@/lib/mock/sample-raffle-items';
import styles from './prize-list-item.module.css';

interface PrizeListItemProps {
  item: RaffleItem;
}

const PrizeListItem = ({ item }: PrizeListItemProps) => {
  const path = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleMenuToggle = (itemId: string) => {
    setActiveMenuId(activeMenuId === itemId ? null : itemId);
  };

  const handleDelete = (itemId: string) => {
    // TODO: 상품 삭제 기능
    console.log('상품 삭제:', itemId);
    setActiveMenuId(null);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    if (activeMenuId === item.id) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuId, item.id]);

  const progressPercentage = (item.usedQuantity / item.totalQuantity) * 100;

  return (
    <div className={styles.itemRow}>
      <div className={styles.itemImage}>
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className={styles.itemImageImg}
          />
        )}
      </div>

      <div className={styles.itemInfo}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <div className={styles.quantityInfo}>
          <div className={styles.progressBackground}>
            {progressPercentage > 0 && (
              <div className={styles.progressBar} style={{ width: `${progressPercentage}%` }} />
            )}
          </div>
          <span className={styles.quantityText}>
            {item.usedQuantity}/{item.totalQuantity}
          </span>
        </div>
      </div>

      <div className={styles.itemActions} ref={dropdownRef}>
        <button className={styles.menuButton} onClick={() => handleMenuToggle(item.id)}>
          <EllipsisVertical size={20} />
        </button>

        <AnimatePresence>
          {activeMenuId === item.id && (
            <motion.div
              className={styles.dropdown}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <Link
                href={`${path}/edit/${item.id}`}
                className={styles.dropdownItem}
                onClick={() => setActiveMenuId(null)}
              >
                <Edit2 size={16} />
                수정
              </Link>
              <button
                className={cn(styles.dropdownItem, styles.delete)}
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 size={16} />
                삭제
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PrizeListItem;
