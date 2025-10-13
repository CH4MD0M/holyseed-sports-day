'use client';

import Image from 'next/image';
import { type ConductLotteryResult } from '@/utils/api/lottery';
import { type Prize } from '@/utils/api/prizes';
import s from './raffle-result.module.css';

interface RaffleResultProps {
  result: ConductLotteryResult;
  selectedProduct: Prize | null;
  onRedraw: () => void;
  onConfirm: () => void;
}

export default function RaffleResult({
  result,
  selectedProduct,
  onRedraw,
  onConfirm,
}: RaffleResultProps) {
  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>🎉 추첨 결과</h2>
      </div>

      {/* 당첨자 목록 */}
      <div className={s.winnerCard}>
        {result.winners.map((winner, index) => (
          <div key={winner.user_id} className={s.winnerInfo}>
            <div className={s.winnerName}>
              {index + 1}. {winner.name}
            </div>
            <div className={s.winnerDetails}>
              <span>{winner.team || '미지정'}</span>
              <span>·</span>
              <span>{winner.department || '미지정'}</span>
            </div>
          </div>
        ))}

        {/* 당첨 상품 */}
        {selectedProduct && (
          <div className={s.productInfo}>
            <div className={s.productImageContainer}>
              {selectedProduct.image_url ? (
                <Image
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  width={32}
                  height={32}
                  className={s.productImage}
                />
              ) : (
                <div className={s.productImagePlaceholder} />
              )}
            </div>
            <span className={s.productName}>{selectedProduct.name}</span>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className={s.actionButtons}>
        <button onClick={onRedraw} className={s.redrawButton}>
          다시뽑기
        </button>
        <button onClick={onConfirm} className={s.confirmButton}>
          확정하기
        </button>
      </div>
    </div>
  );
}
