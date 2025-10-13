'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { Gift } from 'lucide-react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { getPrizes, type Prize } from '@/utils/api/prizes';
import {
  conductLottery,
  type ConductLotteryResult,
  getTeamStats,
  type LotteryMode,
  type TeamStats,
} from '@/utils/api/lottery';

import ProductSelectionModal from './_components/product-selection-modal';
import s from './page.module.css';
import MainLayout from '@/components/layout/main-layout';

type RaffleMode = '전체' | '얼리버드' | '팀별';
type RaffleStatus = '준비' | '진행중' | '완료';
type Team = '팀A' | '팀B';

export default function DrawPage() {
  const router = useRouter();

  // 데이터 상태
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);

  // 추첨 설정 상태
  const [raffleMode, setRaffleMode] = useState<RaffleMode>('전체');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Prize | null>(null);
  const [drawCount, setDrawCount] = useState<number>(1);

  // UI 상태
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [raffleStatus, setRaffleStatus] = useState<RaffleStatus>('준비');
  const [raffleResult, setRaffleResult] = useState<ConductLotteryResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prizesData, teamStatsData] = await Promise.all([
          getPrizes(),
          getTeamStats(),
        ]);
        setPrizes(prizesData);
        setTeamStats(teamStatsData);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      }
    };
    loadData();
  }, []);

  // 추첨 가능 여부 체크
  const isDrawEnabled =
    selectedProduct &&
    drawCount > 0 &&
    (raffleMode !== '팀별' || selectedTeam) &&
    !isSubmitting;

  // 상품 선택 핸들러
  const handleProductSelect = (product: Prize) => {
    setSelectedProduct(product);
    setIsProductModalOpen(false);

    // 상품 재고에 따라 뽑을 인원 수 제한
    if (drawCount > product.remaining_quantity) {
      setDrawCount(Math.max(1, product.remaining_quantity));
    }
  };

  // 뽑을 인원 수 변경 핸들러
  const handleDrawCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const maxCount = selectedProduct ? selectedProduct.remaining_quantity : 1;
    setDrawCount(Math.min(Math.max(1, value), maxCount));
  };

  // 추첨 실행
  const handleDraw = async () => {
    if (!isDrawEnabled || !selectedProduct) return;

    try {
      setIsSubmitting(true);
      setRaffleStatus('진행중');

      // 추첨 모드 변환
      let lotteryMode: LotteryMode = 'all';
      if (raffleMode === '얼리버드') {
        lotteryMode = 'early_bird';
      } else if (raffleMode === '팀별') {
        lotteryMode = 'team_specific';
      }

      // 추첨 실행
      const result = await conductLottery(
        selectedProduct.id,
        drawCount,
        lotteryMode,
        selectedTeam || undefined,
      );

      setRaffleResult(result);
      setRaffleStatus('완료');
      toast.success('추첨이 완료되었습니다!');

      // 데이터 새로고침
      const [prizesData, teamStatsData] = await Promise.all([
        getPrizes(),
        getTeamStats(),
      ]);
      setPrizes(prizesData);
      setTeamStats(teamStatsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '추첨 실행에 실패했습니다.';
      toast.error(errorMessage);
      setRaffleStatus('준비');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 다시 뽑기
  const handleRedraw = () => {
    setRaffleResult(null);
    setRaffleStatus('준비');
  };

  // 확정하기
  const handleConfirm = () => {
    // 상태 초기화
    setRaffleResult(null);
    setRaffleStatus('준비');
    setSelectedProduct(null);
    setDrawCount(1);

    toast.success('추첨 결과가 확정되었습니다!');

    // 히스토리 페이지로 이동
    router.push('/admin/draw-history');
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
                  <div className={cn(s.statNumber, s.teamA)}>{teamStats?.teamA || 0}</div>
                  <div className={s.statLabel}>팀A</div>
                </div>
                <div className={cn(s.teamStatItem, s.teamB)}>
                  <div className={cn(s.statNumber, s.teamB)}>{teamStats?.teamB || 0}</div>
                  <div className={s.statLabel}>팀B</div>
                </div>
                <div className={s.teamStatItem}>
                  <div className={s.statNumber}>{teamStats?.total || 0}</div>
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
                        <span className={s.productCount}>({selectedProduct.remaining_quantity}개)</span>
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
                      max={selectedProduct ? selectedProduct.remaining_quantity : 1}
                      value={drawCount}
                      onChange={handleDrawCountChange}
                      className={s.drawCountInput}
                    />
                    {selectedProduct && (
                      <span className={s.maxCount}>/ {selectedProduct.remaining_quantity}개</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 추첨 결과 */}
            {raffleStatus === '완료' && raffleResult && selectedProduct && (
              <div className={s.container}>
                <div className={s.header}>
                  <h2 className={s.title}>🎉 추첨 결과</h2>
                </div>

                {/* 당첨자 목록 */}
                <div className={s.winnerCard}>
                  {raffleResult.winners.map((winner, index) => (
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
                </div>

                {/* 액션 버튼 */}
                <div className={s.actionButtons}>
                  <button onClick={handleRedraw} className={s.redrawButton}>
                    다시뽑기
                  </button>
                  <button onClick={handleConfirm} className={s.confirmButton}>
                    확정하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 추첨 시작 버튼 */}
        <div className={s.bottomButtonContainer}>
          <button
            onClick={handleDraw}
            disabled={!isDrawEnabled || isSubmitting}
            className={cn(s.drawButton, {
              [s.enabled]: isDrawEnabled && !isSubmitting,
            })}
          >
            {isSubmitting ? '추첨 중...' : '추첨 시작'}
          </button>
        </div>
      </main>

      {/* 상품 선택 모달 */}
      {isProductModalOpen && (
        <ProductSelectionModal
          items={prizes}
          onSelect={handleProductSelect}
          onClose={() => setIsProductModalOpen(false)}
        />
      )}
    </MainLayout>
  );
}
