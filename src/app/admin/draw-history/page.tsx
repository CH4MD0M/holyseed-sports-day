'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import cn from 'classnames';
import { toast } from 'react-toastify';

import { getLotteryHistory, type LotteryHistoryItem } from '@/utils/api/lottery';
import { DEPARTMENT_CONFIGS } from '@/lib/mock/sample-raffle-history';

import s from './page.module.css';
import MainLayout from '@/components/layout/main-layout';

// dayjs 설정
dayjs.extend(relativeTime);
dayjs.locale('ko');

type Department = '청년2부' | '청년3부';
type FilterType = 'all' | Department;

export default function RaffleHistoryPage() {
  const [historyData, setHistoryData] = useState<LotteryHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<LotteryHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLotteryHistory();
        setHistoryData(data);
        setFilteredHistory(data);
      } catch (error) {
        console.error('추첨 히스토리 조회 실패:', error);
        toast.error('추첨 히스토리를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 실시간 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 부서 필터 변경 시 즉시 적용 (검색어 유지하면서)
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, historyData]);

  const applyFilters = () => {
    let result = historyData;

    // 부서 필터링
    if (activeFilter !== 'all') {
      result = result.filter((history) => history.department === activeFilter);
    }

    // 검색어 필터링 (검색어가 있으면 항상 적용)
    if (searchTerm.trim()) {
      result = result.filter((history) => {
        return (
          history.winner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history.prize_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredHistory(result);
  };

  const handleSearch = () => {
    // 검색 실행 시 현재 부서 필터 + 검색어 모두 적용
    applyFilters();
    console.log('검색 실행:', { searchTerm, activeFilter, resultCount: filteredHistory.length });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getRelativeTime = (wonAt: string) => {
    return dayjs(wonAt).from(currentTime);
  };

  if (isLoading) {
    return (
      <MainLayout title="추첨 이력">
        <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
      </MainLayout>
    );
  }

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
            <button
              onClick={() => setActiveFilter('청년2부')}
              className={cn(s.filterButton, {
                [s.active]: activeFilter === '청년2부',
              })}
            >
              청년2부
            </button>
            <button
              onClick={() => setActiveFilter('청년3부')}
              className={cn(s.filterButton, {
                [s.active]: activeFilter === '청년3부',
              })}
            >
              청년3부
            </button>
          </div>

          {/* 검색 입력창 */}
          <div className={s.searchContainer}>
            <input
              type="text"
              placeholder="이름, 상품명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className={s.searchInput}
            />
            <button onClick={handleSearch} className={s.searchButton}>
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
              const departmentConfig =
                history.department && DEPARTMENT_CONFIGS[history.department as Department]
                  ? DEPARTMENT_CONFIGS[history.department as Department]
                  : { colors: { background: '#E5E7EB', text: '#374151' } };

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
                            backgroundColor: departmentConfig.colors.background,
                            color: departmentConfig.colors.text,
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
