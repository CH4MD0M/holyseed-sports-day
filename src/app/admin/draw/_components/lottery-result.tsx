'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RotateCcw, Trophy } from 'lucide-react';

import { clearTempResults, confirmLottery } from '@/lib/api/draw-lottery-api';
import { updateLotteryStatus } from '@/lib/api/draw-status-api';
import styles from './lottery-result.module.css';

interface Winner {
  user_id: string;
  name: string;
  team: string;
  department: string;
  lottery_number: number | null;
}

interface LotteryResultProps {
  lotteryEventId: string;
  winners: Winner[];
  prizeName: string;
  onConfirm: () => void;
  onRedraw: () => void;
}

const LotteryResult = ({
  lotteryEventId,
  winners,
  prizeName,
  onConfirm,
  onRedraw,
}: LotteryResultProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRedrawing, setIsRedrawing] = useState(false);

  const handleReveal = async () => {
    setIsLoading(true);
    try {
      await updateLotteryStatus('revealing');
      console.log('revealing 상태로 변경 완료');
    } catch (err) {
      console.error('상태 변경 실패:', err);
      alert(err instanceof Error ? err.message : '상태 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await confirmLottery(lotteryEventId);
      alert('추첨이 확정되었습니다!');
      onConfirm();
    } catch (error) {
      console.error('확정 실패:', error);
      alert(error instanceof Error ? error.message : '확정에 실패했습니다.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRedraw = async () => {
    if (confirm('다시 추첨하시겠습니까? 현재 결과는 삭제됩니다.')) {
      setIsRedrawing(true);
      try {
        await clearTempResults(lotteryEventId);
        await updateLotteryStatus('drawing');

        onRedraw();
      } catch (error) {
        console.error('다시 뽑기 실패:', error);
        alert(error instanceof Error ? error.message : '다시 뽑기에 실패했습니다.');
      } finally {
        setIsRedrawing(false);
      }
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 헤더 */}
      <div className={styles.header}>
        <Trophy className={styles.trophyIcon} />
        <h2 className={styles.title}>추첨 결과</h2>
      </div>

      {/* 상품명 */}
      <div className={styles.prizeInfo}>
        <span className={styles.prizeLabel}>당첨 상품</span>
        <span className={styles.prizeName}>{prizeName}</span>
      </div>

      {/* 당첨자 목록 */}
      <div className={styles.winnersSection}>
        <h3 className={styles.winnersTitle}>당첨자 ({winners.length}명)</h3>
        <div className={styles.winnersList}>
          {winners.map((winner, index) => (
            <motion.div
              key={winner.user_id}
              className={styles.winnerCard}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.winnerNumber}>{winner.lottery_number}</div>
              <div className={styles.winnerInfo}>
                <span className={styles.winnerName}>{winner.name}</span>
                <span className={styles.winnerDetail}>
                  {winner.team} · {winner.department}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <button className={styles.revealButton} onClick={handleReveal} disabled={isLoading}>
        {isLoading ? '상태 변경 중...' : '당첨자 공개'}
      </button>

      {/* 액션 버튼 */}
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.redrawButton}`}
          onClick={handleRedraw}
          disabled={isConfirming || isRedrawing}
        >
          <RotateCcw className={styles.buttonIcon} />
          다시 뽑기
        </button>
        <button
          className={`${styles.button} ${styles.confirmButton}`}
          onClick={handleConfirm}
          disabled={isConfirming || isRedrawing}
        >
          {isConfirming ? (
            <>
              <motion.div
                className={styles.spinner}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              확정 중...
            </>
          ) : (
            <>
              <CheckCircle className={styles.buttonIcon} />
              확정하기
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default LotteryResult;
