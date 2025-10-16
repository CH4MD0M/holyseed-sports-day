'use client';

import MainLayout from '@/components/layout/main-layout';
import styles from './schedule-page.module.css';
import { motion } from 'framer-motion';

const SchedulePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <MainLayout title="일정 안내">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1부 */}
        <motion.div className={styles.section} variants={sectionVariants}>
          <h2 className={styles.sectionTitle}>1부</h2>
          <div className={styles.scheduleList}>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>12:30~1:00</span>
              <span>체험 부스 게임</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>1:00~1:10</span>
              <span>개회식</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>1:10~1:20</span>
              <span>
                준비운동
                <br />
                몸풀기 레크레이션
              </span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>1:20~1:30</span>
              <span>한마음 달리기</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>1:30~1:40</span>
              <span>맹꽁이 기차</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>1:40~2:10</span>
              <span>
                달려라 줄뺏기(전략)
                <br /> 꼬마야꼬마야
              </span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>2:10~2:30</span>
              <span>발야구</span>
            </div>
          </div>
        </motion.div>

        {/* 2부 */}
        <motion.div className={styles.section} variants={sectionVariants}>
          <h2 className={styles.sectionTitle}>2부</h2>
          <div className={styles.scheduleList}>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>2:30~2:35</span>
              <span>색판뒤집기</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>2:35~2:55</span>
              <span>풍선게임3종</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>2:55~3:10</span>
              <span>큰공배구</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>3:10~3:30</span>
              <span>축구</span>
            </div>
          </div>
        </motion.div>

        {/* 3부 */}
        <motion.div className={styles.section} variants={sectionVariants}>
          <h2 className={styles.sectionTitle}>3부</h2>
          <div className={styles.scheduleList}>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>3:30~3:50</span>
              <span>OX퀴즈</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>3:50~4:05</span>
              <span>단체게임3종</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>4:00~4:15</span>
              <span>미션 계주달리기</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>4:15~4:30</span>
              <span>시상식 및 폐회식</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>4:30~</span>
              <span>가정별 식사</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default SchedulePage;
