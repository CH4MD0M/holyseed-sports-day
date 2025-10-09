'use client';

import { useState } from 'react';
import { Gift } from 'lucide-react';
import cn from 'classnames';

import { SAMPLE_RAFFLE_ITEMS, type RaffleItem } from '@/lib/mock/sample-raffle-items';
import {
  getTeamStats,
  getDrawTargets,
  drawRandomWinner,
  type Team,
  type RaffleWinner,
} from '@/lib/mock/sample-participants';

import ProductSelectionModal from './_components/product-selection-modal';
import RaffleResult from './_components/raffle-result';
import s from './page.module.css';
import MainLayout from '@/components/layout/main-layout';

type RaffleMode = '전체' | '얼리버드' | '팀별';
type RaffleStatus = '준비' | '진행중' | '완료';

export default function DrawPage() {
  // 추첨 설정 상태
  const [raffleMode, setRaffleMode] = useState<RaffleMode>('전체');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<RaffleItem | null>(null);
  const [drawCount, setDrawCount] = useState<number>(1);

  // UI 상태
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [raffleStatus, setRaffleStatus] = useState<RaffleStatus>('준비');
  const [raffleResult, setRaffleResult] = useState<RaffleWinner | null>(null);

  const teamStats = getTeamStats();

  // 추첨 가능 여부 체크
  const isDrawEnabled = selectedProduct && drawCount > 0 && (raffleMode !== '팀별' || selectedTeam);

  // 상품 선택 핸들러
  const handleProductSelect = (product: RaffleItem) => {
    setSelectedProduct(product);
    setIsProductModalOpen(false);

    // 상품 재고에 따라 뽑을 인원 수 제한
    if (drawCount > product.totalQuantity - product.usedQuantity) {
      setDrawCount(Math.max(1, product.totalQuantity - product.usedQuantity));
    }
  };

  // 뽑을 인원 수 변경 핸들러
  const handleDrawCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const maxCount = selectedProduct
      ? selectedProduct.totalQuantity - selectedProduct.usedQuantity
      : 1;
    setDrawCount(Math.min(Math.max(1, value), maxCount));
  };

  // 추첨 실행
  const handleDraw = () => {
    if (!isDrawEnabled) return;

    setRaffleStatus('진행중');

    const targets = getDrawTargets(raffleMode, selectedTeam || undefined);
    const winner = drawRandomWinner(targets);

    if (winner) {
      const result: RaffleWinner = {
        participant: winner,
        productId: selectedProduct!.id,
        raffleTime: new Date(),
      };
      setRaffleResult(result);
      setRaffleStatus('완료');
    } else {
      // 추첨 대상자가 없는 경우
      alert('추첨 대상자가 없습니다.');
      setRaffleStatus('준비');
    }
  };

  // 다시 뽑기
  const handleRedraw = () => {
    setRaffleResult(null);
    setRaffleStatus('준비');
  };

  // 확정하기
  const handleConfirm = () => {
    // TODO: 실제 추첨 결과 저장 로직
    console.log('추첨 결과 확정:', raffleResult);

    // 상품 사용 수량 업데이트 (시뮬레이션)
    if (selectedProduct) {
      // TODO: 실제 데이터 업데이트 로직
      console.log('상품 사용 수량 업데이트:', selectedProduct.id);
    }

    // 상태 초기화
    setRaffleResult(null);
    setRaffleStatus('준비');
    setSelectedProduct(null);
    setDrawCount(1);

    alert('추첨이 완료되었습니다!');
  };

  return (
    <MainLayout title="추첨 진행">
      <main className={s.main}>
        <div className={s.contentWrapper}>
          {/* 헤더 섹션 */}
          <div className={s.headerSection}>
            <h1 className={s.title}>추첨 진행</h1>
            <p className={s.description}>체크인한 참가자를 대상으로 추첨을 진행합니다</p>
          </div>

          <div className={s.content}>
            {/* 팀 현황 */}
            <div className={s.teamStatusCard}>
              <h2 className={s.cardTitle}>팀 현황</h2>
              <div className={s.teamStats}>
                <div className={s.teamStatItem}>
                  <div className={cn(s.statNumber, s.teamA)}>{teamStats.teamA}</div>
                  <div className={s.statLabel}>팀A</div>
                </div>
                <div className={cn(s.teamStatItem, s.teamB)}>
                  <div className={cn(s.statNumber, s.teamB)}>{teamStats.teamB}</div>
                  <div className={s.statLabel}>팀B</div>
                </div>
                <div className={s.teamStatItem}>
                  <div className={s.statNumber}>{teamStats.total}</div>
                  <div className={s.statLabel}>총 체크인</div>
                </div>
              </div>
            </div>

            {/* 추첨 설정 */}
            <div className={s.settingsCard}>
              <h2 className={s.cardTitle}>추첨 설정</h2>

              <div className={s.settingsContainer}>
                {/* 추첨 모드 */}
                <div className={s.fieldGroup}>
                  <label className={s.fieldLabel}>추첨 모드</label>
                  <div className={s.buttonGroup}>
                    <button
                      onClick={() => setRaffleMode('전체')}
                      className={cn(s.modeButton, {
                        [s.active]: raffleMode === '전체',
                      })}
                    >
                      전체 추첨
                    </button>
                    <button
                      onClick={() => setRaffleMode('얼리버드')}
                      className={cn(s.modeButton, {
                        [s.active]: raffleMode === '얼리버드',
                      })}
                    >
                      얼리버드
                    </button>
                    <button
                      onClick={() => setRaffleMode('팀별')}
                      className={cn(s.modeButton, {
                        [s.active]: raffleMode === '팀별',
                      })}
                    >
                      팀별 추첨
                    </button>
                  </div>
                </div>

                {/* 팀 선택 (팀별 추첨 모드일 때만) */}
                {raffleMode === '팀별' && (
                  <div className={s.fieldGroup}>
                    <label className={s.fieldLabel}>팀 선택</label>
                    <div className={s.buttonGroup}>
                      <button
                        onClick={() => setSelectedTeam('팀A')}
                        className={cn(s.modeButton, {
                          [s.active]: selectedTeam === '팀A',
                        })}
                      >
                        팀A
                      </button>
                      <button
                        onClick={() => setSelectedTeam('팀B')}
                        className={cn(s.modeButton, {
                          [s.active]: selectedTeam === '팀B',
                        })}
                      >
                        팀B
                      </button>
                    </div>
                  </div>
                )}

                {/* 상품 선택 */}
                <div className={s.fieldGroup}>
                  <label className={s.fieldLabel}>상품 선택</label>
                  <button
                    onClick={() => setIsProductModalOpen(true)}
                    className={cn(s.productSelectButton, {
                      [s.selected]: selectedProduct,
                    })}
                  >
                    {selectedProduct ? (
                      <div className={s.selectedProductInfo}>
                        <span className={s.productEmoji}>🎧</span>
                        <span className={s.productName}>{selectedProduct.name}</span>
                        <span className={s.productCount}>
                          ({selectedProduct.totalQuantity - selectedProduct.usedQuantity}개)
                        </span>
                      </div>
                    ) : (
                      <div className={s.productSelectPlaceholder}>
                        <Gift size={20} />
                        <span>상품을 선택하세요</span>
                      </div>
                    )}
                  </button>
                </div>

                {/* 뽑을 인원 수 */}
                <div className={s.fieldGroup}>
                  <label className={s.fieldLabel}>뽑을 인원 수</label>
                  <div className={s.drawCountContainer}>
                    <input
                      type="number"
                      min="1"
                      max={
                        selectedProduct
                          ? selectedProduct.totalQuantity - selectedProduct.usedQuantity
                          : 1
                      }
                      value={drawCount}
                      onChange={handleDrawCountChange}
                      className={s.drawCountInput}
                    />
                    {selectedProduct && (
                      <span className={s.maxCount}>
                        / {selectedProduct.totalQuantity - selectedProduct.usedQuantity}개
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 추첨 결과 */}
            {raffleStatus === '완료' && raffleResult && (
              <RaffleResult
                result={raffleResult}
                selectedProduct={selectedProduct}
                onRedraw={handleRedraw}
                onConfirm={handleConfirm}
              />
            )}
          </div>
        </div>

        {/* 추첨 시작 버튼 */}
        <div className={s.bottomButtonContainer}>
          <button onClick={handleDraw} className={cn(s.drawButton, s.enabled)}>
            추첨 시작
          </button>
        </div>
      </main>

      {/* 상품 선택 모달 */}
      {isProductModalOpen && (
        <ProductSelectionModal
          items={SAMPLE_RAFFLE_ITEMS}
          onSelect={handleProductSelect}
          onClose={() => setIsProductModalOpen(false)}
        />
      )}
    </MainLayout>
  );
}
