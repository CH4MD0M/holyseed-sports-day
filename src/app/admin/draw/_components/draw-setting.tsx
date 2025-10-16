'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Check } from 'lucide-react';

import { useModalStore } from '@/store/use-modal-store';
import { usePrizes } from '@/hooks/use-prizes';
import SelectProductModal from './select-product-modal';
import type { Prize } from './select-product-modal';

import styles from './draw-setting.module.css';

type LotteryMode = 'all' | 'team_specific';
type Team = '청팀' | '백팀' | null;

const DrawSetting = () => {
  const { data: prizeList = [] } = usePrizes();
  const { openModal } = useModalStore(['openModal']);

  const [lotteryMode, setLotteryMode] = useState<LotteryMode>('all');
  const [selectedTeam, setSelectedTeam] = useState<Team>(null);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [winnerCount, setWinnerCount] = useState<number>(1);

  const handleModeChange = (mode: LotteryMode) => {
    setLotteryMode(mode);
    if (mode === 'all') {
      setSelectedTeam(null);
    }
  };

  const handlePrizeSelect = (prize: Prize) => {
    setSelectedPrize(prize);
    // 선택한 상품의 남은 수량보다 크면 조정
    if (winnerCount > prize.remaining_quantity) {
      setWinnerCount(prize.remaining_quantity);
    }
  };

  const handleOpenPrizeModal = () => {
    openModal(
      'select-product',
      <SelectProductModal prizeList={prizeList} onSelectPrize={handlePrizeSelect} />
    );
  };

  const handleWinnerCountChange = (value: number) => {
    if (!selectedPrize) {
      setWinnerCount(Math.max(1, value));
      return;
    }

    // 상품이 선택된 경우 남은 수량을 초과할 수 없음
    const maxCount = selectedPrize.remaining_quantity;
    setWinnerCount(Math.max(1, Math.min(value, maxCount)));
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>추첨 설정</h2>
      </motion.div>

      {/* 추첨 모드 */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className={styles.sectionTitle}>추첨 모드</h3>
        <div className={styles.modeGrid}>
          <button
            className={`${styles.modeButton} ${
              lotteryMode === 'all' ? styles.modeButtonActive : ''
            }`}
            onClick={() => handleModeChange('all')}
          >
            전체 추첨
          </button>
          <button
            className={`${styles.modeButton} ${
              lotteryMode === 'team_specific' ? styles.modeButtonActive : ''
            }`}
            onClick={() => handleModeChange('team_specific')}
          >
            팀별 추첨
          </button>
        </div>
      </motion.div>

      {/* 팀 선택 (팀별 추첨일 때만) */}
      <AnimatePresence>
        {lotteryMode === 'team_specific' && (
          <motion.div
            className={styles.section}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={styles.sectionTitle}>팀 선택</h3>
            <div className={styles.teamGrid}>
              <button
                className={`${styles.teamButton} ${styles.blueTeam} ${
                  selectedTeam === '청팀' ? styles.teamButtonActive : ''
                }`}
                onClick={() => setSelectedTeam('청팀')}
              >
                청팀
              </button>
              <button
                className={`${styles.teamButton} ${styles.whiteTeam} ${
                  selectedTeam === '백팀' ? styles.teamButtonActive : ''
                }`}
                onClick={() => setSelectedTeam('백팀')}
              >
                백팀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 상품 선택 */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className={styles.sectionTitle}>상품 선택</h3>
        <button className={styles.prizeSelectButton} onClick={handleOpenPrizeModal}>
          {selectedPrize ? (
            <>
              <Check className={styles.checkIcon} />
              <div className={styles.selectedPrizeInfo}>
                <span className={styles.selectedPrizeName}>{selectedPrize.name}</span>
                <span className={styles.selectedPrizeQuantity}>
                  남은 수량: {selectedPrize.remaining_quantity}개
                </span>
              </div>
            </>
          ) : (
            <>
              <Gift className={styles.prizeIcon} />
              <span className={styles.prizeText}>상품을 선택하세요</span>
            </>
          )}
        </button>
      </motion.div>

      {/* 뽑을 인원 수 */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className={styles.sectionTitle}>뽑을 인원 수</h3>
        <div className={styles.countInputWrapper}>
          <input
            type="number"
            min="1"
            max={selectedPrize?.remaining_quantity || undefined}
            value={winnerCount}
            onChange={(e) => handleWinnerCountChange(parseInt(e.target.value) || 1)}
            className={styles.countInput}
          />
          {selectedPrize && (
            <span className={styles.maxCount}>/ {selectedPrize.remaining_quantity}</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DrawSetting;
