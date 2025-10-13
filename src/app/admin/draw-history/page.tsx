'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import cn from 'classnames';

import { useLotteryHistory } from '@/hooks/use-lottery';
import { DEFAULT_DEPARTMENT_COLORS, DEPARTMENT_COLORS, DEPARTMENTS } from '@/constants/departments';

import s from './page.module.css';
import MainLayout from '@/components/layout/main-layout';

// dayjs 설정
dayjs.extend(relativeTime);
dayjs.locale('ko');

type FilterType = 'all' | string;

export default function RaffleHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentTime, setCurrentTime] = useState(dayjs());

  // React Query로 데이터 가져오기
  const { data: historyData = [] } = useLotteryHistory();

  // 실시간 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 필터링된 히스토리 계산 (useMemo로 최적화)
  const filteredHistory = useMemo(() => {
    return historyData
      .filter((history) => {
        // 부서 필터링
        if (activeFilter === 'all') return true;
        return history.department === activeFilter;
      })
      .filter((history) => {
        // 검색어 필터링
        if (!searchTerm.trim()) return true;
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          history.winner_name.toLowerCase().includes(lowerSearchTerm) ||
          history.prize_name.toLowerCase().includes(lowerSearchTerm)
        );
      });
  }, [historyData, activeFilter, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 검색은 useMemo에서 자동으로 처리되므로 별도 액션 불필요
      // 엔터 시 입력창에서 포커스 제거
      e.currentTarget.blur();
    }
  };

  const getRelativeTime = (wonAt: string) => {
    return dayjs(wonAt).from(currentTime);
  };

  return (
    <MainLayout title="추첨 이력">
      <main className={s.main}>
        {/* 필터 및 검색 섹션 */}
        <div className={s.filterSection}>
          {/* 부서 필터 버튼들 */}
          <div className={s.filterButtons}>
            <button
              onClick={() => setActiveFilter('all')}
              className={cn(s.filterButton, {
                [s.active]: activeFilter === 'all',
              })}
            >
              전체
            </button>
            {DEPARTMENTS.map((department) => (
              <button
                key={department}
                onClick={() => setActiveFilter(department)}
                className={cn(s.filterButton, {
                  [s.active]: activeFilter === department,
                })}
              >
                {department}
              </button>
            ))}
          </div>

          {/* 검색 입력창 */}
          <div className={s.searchContainer}>
            <input
              type="text"
              placeholder="이름, 상품명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className={s.searchInput}
            />
            <button className={s.searchButton}>
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* 결과 섹션 */}
        <div className={s.resultSection}>
          <div className={s.resultCount}>
            <span className={s.countText}>총 {filteredHistory.length}건</span>
          </div>

          {/* 추첨 이력 목록 */}
          <div className={s.historyList}>
            {filteredHistory.map((history) => {
              const departmentColors =
                history.department && DEPARTMENT_COLORS[history.department]
                  ? DEPARTMENT_COLORS[history.department]
                  : DEFAULT_DEPARTMENT_COLORS;

              return (
                <div key={history.id} className={s.historyCard}>
                  {/* 상단 영역 */}
                  <div className={s.cardHeader}>
                    <div className={s.userInfo}>
                      <h3 className={s.winnerName}>{history.winner_name}</h3>
                      {history.department && (
                        <div
                          className={s.departmentTag}
                          style={{
                            backgroundColor: departmentColors.background,
                            color: departmentColors.text,
                          }}
                        >
                          {history.department}
                        </div>
                      )}
                      {history.team && <span className={s.groupInfo}>{history.team}</span>}
                    </div>
                    <div className={s.timeInfo}>
                      <span className={s.relativeTime}>{getRelativeTime(history.won_at)}</span>
                    </div>
                  </div>

                  {/* 하단 영역 */}
                  <div className={s.cardContent}>
                    <div className={s.productImageContainer}>
                      {history.prize_image_url ? (
                        <Image
                          src={history.prize_image_url}
                          alt={history.prize_name}
                          width={48}
                          height={48}
                          className={s.productImage}
                        />
                      ) : (
                        <div className={s.productImagePlaceholder} />
                      )}
                    </div>
                    <div className={s.productInfo}>
                      <span className={s.productName}>{history.prize_name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHistory.length === 0 && (
            <div className={s.emptyState}>
              <p>조건에 맞는 추첨 이력이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}
