import Image from 'next/image';

import type { Tables } from '@/types/supabase.type';
export type Prize = Tables<'prizes'>;

import { BaseModal } from '@/components/modal/base-modal';
import { useModalStore } from '@/store/use-modal-store';
import styles from './select-product-modal.module.css';

interface SelectProductModalProps {
  prizeList: Prize[];
  onSelectPrize: (prize: Prize) => void;
}

const SelectProductModal = ({ prizeList, onSelectPrize }: SelectProductModalProps) => {
  const { closeModal } = useModalStore(['closeModal']);

  const handlePrizeClick = (prize: Prize) => {
    onSelectPrize(prize);
    closeModal('select-product');
  };

  return (
    <BaseModal name="select-product">
      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>상품 선택</h2>
        <div className={styles.itemList}>
          {prizeList.map((prize) => {
            const isAvailable = prize.remaining_quantity > 0;

            return (
              <button
                key={prize.id}
                className={`${styles.itemRow} ${!isAvailable ? styles.itemDisabled : ''}`}
                onClick={() => isAvailable && handlePrizeClick(prize)}
                disabled={!isAvailable}
              >
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
                    <span
                      className={`${styles.quantityText} ${
                        !isAvailable ? styles.quantityZero : ''
                      }`}
                    >
                      남은 수량: {prize.remaining_quantity}개
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </BaseModal>
  );
};

export default SelectProductModal;
