'use client';

import MainLayout from '@/components/layout/main-layout';
import TeamStatus from './_components/team-status';

import styles from './page.module.css';
import DrawSetting from './_components/draw-setting';

export default function DrawPage() {
  return (
    <MainLayout title="추첨 진행">
      <div className={styles.container}>
        <TeamStatus />
        <DrawSetting />
      </div>
    </MainLayout>
    //   <main className={s.main}>
    //     <div className={s.contentWrapper}>
    //       <div className={s.content}>
    //         {/* 팀 현황 */}
    //         <div className={s.teamStatusCard}>
    //           <h2 className={s.cardTitle}>팀 현황</h2>
    //           <div className={s.teamStats}>
    //             <div className={s.teamStatItem}>
    //               <div className={cn(s.statNumber, s.teamA)}>{teamStats?.teamA || 0}</div>
    //               <div className={s.statLabel}>팀A</div>
    //             </div>
    //             <div className={cn(s.teamStatItem, s.teamB)}>
    //               <div className={cn(s.statNumber, s.teamB)}>{teamStats?.teamB || 0}</div>
    //               <div className={s.statLabel}>팀B</div>
    //             </div>
    //             <div className={s.teamStatItem}>
    //               <div className={s.statNumber}>{teamStats?.total || 0}</div>
    //               <div className={s.statLabel}>총 체크인</div>
    //             </div>
    //           </div>
    //         </div>

    //         {/* 추첨 설정 */}
    //         <div className={s.settingsCard}>
    //           <h2 className={s.cardTitle}>추첨 설정</h2>

    //           <div className={s.settingsContainer}>
    //             {/* 추첨 모드 */}
    //             <div className={s.fieldGroup}>
    //               <label className={s.fieldLabel}>추첨 모드</label>
    //               <div className={s.buttonGroup}>
    //                 <button
    //                   onClick={() => setRaffleMode('전체')}
    //                   className={cn(s.modeButton, {
    //                     [s.active]: raffleMode === '전체',
    //                   })}
    //                 >
    //                   전체 추첨
    //                 </button>
    //                 <button
    //                   onClick={() => setRaffleMode('팀별')}
    //                   className={cn(s.modeButton, {
    //                     [s.active]: raffleMode === '팀별',
    //                   })}
    //                 >
    //                   팀별 추첨
    //                 </button>
    //               </div>
    //             </div>

    //             {/* 팀 선택 (팀별 추첨 모드일 때만) */}
    //             {raffleMode === '팀별' && (
    //               <div className={s.fieldGroup}>
    //                 <label className={s.fieldLabel}>팀 선택</label>
    //                 <div className={s.buttonGroup}>
    //                   <button
    //                     onClick={() => setSelectedTeam('팀A')}
    //                     className={cn(s.modeButton, {
    //                       [s.active]: selectedTeam === '팀A',
    //                     })}
    //                   >
    //                     팀A
    //                   </button>
    //                   <button
    //                     onClick={() => setSelectedTeam('팀B')}
    //                     className={cn(s.modeButton, {
    //                       [s.active]: selectedTeam === '팀B',
    //                     })}
    //                   >
    //                     팀B
    //                   </button>
    //                 </div>
    //               </div>
    //             )}

    //             {/* 상품 선택 */}
    //             <div className={s.fieldGroup}>
    //               <label className={s.fieldLabel}>상품 선택</label>
    //               <button
    //                 onClick={() => setIsProductModalOpen(true)}
    //                 className={cn(s.productSelectButton, {
    //                   [s.selected]: selectedProduct,
    //                 })}
    //               >
    //                 {selectedProduct ? (
    //                   <div className={s.selectedProductInfo}>
    //                     <div className={s.productImageContainer}>
    //                       {selectedProduct.image_url ? (
    //                         <Image
    //                           src={selectedProduct.image_url}
    //                           alt={selectedProduct.name}
    //                           width={32}
    //                           height={32}
    //                           className={s.productImage}
    //                         />
    //                       ) : (
    //                         <div className={s.productImagePlaceholder} />
    //                       )}
    //                     </div>
    //                     <span className={s.productName}>{selectedProduct.name}</span>
    //                     <span className={s.productCount}>
    //                       ({selectedProduct.remaining_quantity}개)
    //                     </span>
    //                   </div>
    //                 ) : (
    //                   <div className={s.productSelectPlaceholder}>
    //                     <Gift size={20} />
    //                     <span>상품을 선택하세요</span>
    //                   </div>
    //                 )}
    //               </button>
    //             </div>

    //             {/* 뽑을 인원 수 */}
    //             <div className={s.fieldGroup}>
    //               <label className={s.fieldLabel}>뽑을 인원 수</label>
    //               <div className={s.drawCountContainer}>
    //                 <input
    //                   type="number"
    //                   min="1"
    //                   max={selectedProduct ? selectedProduct.remaining_quantity : 1}
    //                   value={drawCount}
    //                   onChange={handleDrawCountChange}
    //                   className={s.drawCountInput}
    //                 />
    //                 {selectedProduct && (
    //                   <span className={s.maxCount}>/ {selectedProduct.remaining_quantity}개</span>
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         {/* 추첨 결과 */}
    //         {raffleStatus === '완료' && raffleResult && selectedProduct && (
    //           <RaffleResult
    //             result={raffleResult}
    //             selectedProduct={selectedProduct}
    //             onRedraw={handleRedraw}
    //             onConfirm={handleConfirm}
    //           />
    //         )}
    //       </div>
    //     </div>

    //     {/* 추첨 시작 버튼 */}
    //     <div className={s.bottomButtonContainer}>
    //       <button
    //         onClick={handleDraw}
    //         disabled={!isDrawEnabled || isSubmitting}
    //         className={cn(s.drawButton, {
    //           [s.enabled]: isDrawEnabled && !isSubmitting,
    //         })}
    //       >
    //         {isSubmitting ? '추첨 중...' : '추첨 시작'}
    //       </button>
    //     </div>
    //   </main>

    //   {/* 상품 선택 모달 */}
    //   {isProductModalOpen && (
    //     <ProductSelectionModal
    //       items={prizes}
    //       onSelect={handleProductSelect}
    //       onClose={() => setIsProductModalOpen(false)}
    //     />
    //   )}
    // </MainLayout>
  );
}
