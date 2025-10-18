// DrawSetting.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Check, Sparkles } from 'lucide-react';

import type { Prize } from './select-product-modal';

import { conductLottery } from '@/lib/api/draw-lottery-api';
import { useModalStore } from '@/store/use-modal-store';
import { usePrizes } from '@/hooks/use-prizes';

import SelectProductModal from './select-product-modal';
import styles from './draw-setting.module.css';
import LotteryResult from './lottery-result';

type LotteryMode = 'all' | 'team_specific';
type Team = '청팀' | '백팀' | null;
interface Winner {
  user_id: string;
  name: string;
  team: string;
  department: string;
  lottery_number: number | null;
}

const DrawSetting = () => {
  const { data: prizeList = [] } = usePrizes();
  const { openModal } = useModalStore(['openModal']);

  const [lotteryResult, setLotteryResult] = useState<{
    lotteryEventId: string;
    winners: Winner[];
    prizeName: string;
  } | null>(null);

  const [lotteryMode, setLotteryMode] = useState<LotteryMode>('all');
  const [selectedTeam, setSelectedTeam] = useState<Team>(null);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [winnerCount, setWinnerCount] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);

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

  const handleStartDraw = async () => {
    // 유효성 검사
    if (!selectedPrize) {
      alert('상품을 선택해주세요.');
      return;
    }

    if (lotteryMode === 'team_specific' && !selectedTeam) {
      alert('팀을 선택해주세요.');
      return;
    }

    if (winnerCount < 1) {
      alert('뽑을 인원 수를 입력해주세요.');
      return;
    }

    setIsDrawing(true);
    try {
      const result = await conductLottery({
        prizeId: selectedPrize.id,
        winnerCount,
        lotteryMode,
        targetTeam: lotteryMode === 'team_specific' ? selectedTeam : null,
      });

      setLotteryResult({
        lotteryEventId: result.lottery_event_id,
        winners: result.winners,
        prizeName: selectedPrize.name,
      });
    } catch (error) {
      console.error('추첨 실패:', error);
      alert(error instanceof Error ? error.message : '추첨에 실패했습니다.');
    } finally {
      setIsDrawing(false);
    }
  };

  const handleConfirm = () => {
    // 확정 후 초기화
    setLotteryResult(null);
    setSelectedPrize(null);
    setWinnerCount(1);
    // 상품 목록 리프레시 (react-query refetch)
  };

  const handleRedraw = () => {
    // 다시 뽑기 - 결과만 초기화하고 설정 유지
    setLotteryResult(null);
    setIsDrawing(false);
  };

  const isReadyToDraw =
    selectedPrize &&
    winnerCount >= 1 &&
    (lotteryMode === 'all' || (lotteryMode === 'team_specific' && selectedTeam));

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

      {/* 추첨 시작 버튼 */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          className={styles.drawButton}
          onClick={handleStartDraw}
          disabled={!isReadyToDraw || isDrawing}
        >
          {isDrawing ? (
            <>
              <motion.div
                className={styles.spinner}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              추첨 진행 중...
            </>
          ) : (
            <>
              <Sparkles className={styles.sparkleIcon} />
              추첨 시작
            </>
          )}
        </button>
      </motion.div>

      {lotteryResult && (
        <LotteryResult
          lotteryEventId={lotteryResult.lotteryEventId}
          winners={lotteryResult.winners}
          prizeName={lotteryResult.prizeName}
          onConfirm={handleConfirm}
          onRedraw={handleRedraw}
        />
      )}
    </div>
  );
};

export default DrawSetting;
