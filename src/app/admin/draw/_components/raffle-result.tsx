'use client';

import { type RaffleWinner } from '../../../../lib/mock/sample-participants';
import { type RaffleItem } from '../../../../lib/mock/sample-raffle-items';
import { DEPARTMENT_CONFIGS } from '../../../../lib/mock/sample-raffle-history';
import s from './raffle-result.module.css';

interface RaffleResultProps {
  result: RaffleWinner;
  selectedProduct: RaffleItem | null;
  onRedraw: () => void;
  onConfirm: () => void;
}

export default function RaffleResult({
  result,
  selectedProduct,
  onRedraw,
  onConfirm,
}: RaffleResultProps) {
  const { participant } = result;
  const departmentConfig = DEPARTMENT_CONFIGS[participant.department];

  const getProductEmoji = (productName?: string) => {
    if (!productName) return '🎁';
    if (productName.includes('에어팟') || productName.includes('AirPods')) return '🎧';
    if (productName.includes('스타벅스') || productName.includes('커피')) return '☕';
    if (productName.includes('치킨') || productName.includes('쿠폰')) return '🍗';
    if (productName.includes('갤럭시') || productName.includes('탭')) return '📱';
    return '🎁';
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>🎉 추첨 결과</h2>
      </div>

      {/* 당첨자 정보 */}
      <div className={s.winnerCard}>
        <div className={s.winnerInfo}>
          <div className={s.winnerName}>{participant.name}</div>
          <div className={s.winnerDetails}>
            <span>{participant.group}</span>
            <span>·</span>
            <span
              className={s.departmentTag}
              style={{
                backgroundColor: departmentConfig.colors.background,
                color: departmentConfig.colors.text,
              }}
            >
              {participant.department}
            </span>
            <span>·</span>
            <span>{participant.team}</span>
          </div>
        </div>

        {/* 당첨 상품 */}
        {selectedProduct && (
          <div className={s.productInfo}>
            <span className={s.productEmoji}>{getProductEmoji(selectedProduct.name)}</span>
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
