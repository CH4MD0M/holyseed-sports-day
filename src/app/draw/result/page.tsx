'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { HashLoader } from 'react-spinners';
import { Gift, Sparkles, Calendar, AlertCircle } from 'lucide-react';

import { useGetLotteryResult } from './_hooks/use-get-lottery-result';

import MainLayout from '@/components/layout/main-layout';
import styles from './draw-result.module.css';
import { useEffect, useState } from 'react';
import { checkLotteryCompleted } from '@/lib/api/lottery_result';

const DrawResultPage = () => {
  const { data: result, isLoading, error } = useGetLotteryResult();
  const [isLotteryCompleted, setIsLotteryCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    checkLotteryCompleted().then(setIsLotteryCompleted);
  }, []);

  // 로딩 상태
  if (isLoading || isLotteryCompleted === null) {
    return (
      <MainLayout title="추첨 결과">
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <HashLoader color="#059669" size={50} speedMultiplier={0.8} />
          </div>
        </div>
      </MainLayout>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <MainLayout title="추첨 결과">
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.errorText}>오류가 발생했습니다.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 추첨 전 상태
  if (!isLotteryCompleted) {
    return (
      <MainLayout title="추첨 결과">
        <div className={styles.container}>
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.iconWrapper}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 15 }}
            >
              <Calendar className={styles.icon} size={56} />
            </motion.div>

            <h1 className={styles.title}>추첨 전입니다</h1>
            <p className={styles.description}>체육대회 당일 추첨이 진행됩니다</p>

            <motion.div
              className={styles.notice}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AlertCircle size={18} className={styles.noticeIcon} />
              <span className={styles.noticeText}>
                추첨이 끝나면 이 페이지에서 결과를 확인하실 수 있습니다
              </span>
            </motion.div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  // 미당첨 상태
  if (!result) {
    return (
      <MainLayout title="추첨 결과">
        <div className={styles.container}>
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.iconWrapper}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 15 }}
            >
              <Gift className={styles.icon} size={56} />
            </motion.div>

            <h1 className={styles.title}>아쉽게도...</h1>

            <p className={styles.description}>이번 추첨에서는 당첨되지 않으셨습니다</p>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  // 당첨 상태
  return (
    <MainLayout title="추첨 결과">
      <div className={styles.container}>
        <motion.div
          className={styles.winnerContent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 당첨 표시 */}
          <motion.div
            className={styles.winnerBadge}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles size={20} />
            <span>당첨</span>
            <Sparkles size={20} />
          </motion.div>

          {/* 상품 이미지 */}
          {result.prize_image_url && (
            <motion.div
              className={styles.prizeImageWrapper}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
            >
              <Image
                src={result.prize_image_url}
                alt={result.prize_name}
                width={300}
                height={300}
                className={styles.prizeImage}
              />
            </motion.div>
          )}

          {/* 상품 정보 */}
          <motion.div
            className={styles.prizeInfo}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className={styles.prizeName}>{result.prize_name}</h2>
            {result.prize_description && (
              <p className={styles.prizeDescription}>{result.prize_description}</p>
            )}
          </motion.div>

          {/* 안내 문구 */}
          <motion.div
            className={styles.notice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AlertCircle size={18} className={styles.noticeIcon} />
            <span className={styles.noticeText}>경품은 디렉팀에서 추후에 전달드리겠습니다.</span>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default DrawResultPage;
