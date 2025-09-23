'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import cn from 'classnames';

import MainHeader from '@/components/header/main-header';
import {
  SAMPLE_RAFFLE_HISTORY,
  DEPARTMENT_CONFIGS,
  type RaffleHistory,
  type Department
} from '../_data/sample-raffle-history';
import { getRaffleItemById } from '../_data/sample-raffle-items';
import s from './page.module.css';

// dayjs 설정
dayjs.extend(relativeTime);
dayjs.locale('ko');

type FilterType = 'all' | Department;

export default function RaffleHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredHistory, setFilteredHistory] = useState<RaffleHistory[]>(SAMPLE_RAFFLE_HISTORY);
  const [currentTime, setCurrentTime] = useState(dayjs());

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
  }, [activeFilter]);

  const applyFilters = () => {
    let result = SAMPLE_RAFFLE_HISTORY;

    // 부서 필터링
    if (activeFilter !== 'all') {
      result = result.filter(history => history.department === activeFilter);
    }

    // 검색어 필터링 (검색어가 있으면 항상 적용)
    if (searchTerm.trim()) {
      result = result.filter(history => {
        const product = getRaffleItemById(history.productId);
        return (
          history.winnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product && product.name.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const getRelativeTime = (raffleTime: Date) => {
    return dayjs(raffleTime).from(currentTime);
  };

  return (
    <div className={s.container}>
      <MainHeader />

      <main className={s.main}>
        {/* 헤더 섹션 */}
        <div className={s.headerSection}>
          <h1 className={s.title}>추첨 이력</h1>
          <p className={s.description}>
            추첨 진행 내역과 당첨자 정보를 확인하고 관리합니다
          </p>
        </div>

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
              const product = getRaffleItemById(history.productId);
              const departmentConfig = DEPARTMENT_CONFIGS[history.department];

              return (
                <div key={history.id} className={s.historyCard}>
                  {/* 상단 영역 */}
                  <div className={s.cardHeader}>
                    <div className={s.userInfo}>
                      <h3 className={s.winnerName}>{history.winnerName}</h3>
                      <div
                        className={s.departmentTag}
                        style={{
                          backgroundColor: departmentConfig.colors.background,
                          color: departmentConfig.colors.text,
                        }}
                      >
                        {history.department}
                      </div>
                      <span className={s.groupInfo}>{history.group}</span>
                    </div>
                    <div className={s.timeInfo}>
                      <span className={s.relativeTime}>
                        {getRelativeTime(history.raffleTime)}
                      </span>
                    </div>
                  </div>

                  {/* 하단 영역 */}
                  <div className={s.cardContent}>
                    <div className={s.productImageContainer}>
                      {product?.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className={s.productImage}
                        />
                      ) : (
                        <div className={s.productImagePlaceholder} />
                      )}
                    </div>
                    <div className={s.productInfo}>
                      <span className={s.productName}>
                        {product?.name || '알 수 없는 상품'}
                      </span>
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
    </div>
  );
}