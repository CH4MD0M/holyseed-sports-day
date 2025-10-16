'use client';

import { HashLoader } from 'react-spinners';
import { motion } from 'framer-motion';

import { useTeamCheckInStats } from '../_hooks/use-team-status';
import styles from './team-status.module.css';

const TeamStatus = () => {
  const { data, isLoading } = useTeamCheckInStats();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <HashLoader color="#059669" size={40} speedMultiplier={0.8} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>체크인 현황</h2>
      </motion.div>

      <div className={styles.statsGrid}>
        {/* 전체 체크인 */}
        <motion.div
          className={`${styles.statCard} ${styles.totalCard}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>전체 체크인</span>
          </div>
          <div className={styles.statValue}>{data.totalCheckInCount}</div>
        </motion.div>

        {/* 청팀 */}
        <motion.div
          className={`${styles.statCard} ${styles.blueCard}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>청팀</span>
          </div>
          <div className={styles.statValue}>{data.blueTeamCount}</div>
        </motion.div>

        {/* 백팀 */}
        <motion.div
          className={`${styles.statCard} ${styles.whiteCard}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>백팀</span>
          </div>
          <div className={styles.statValue}>{data.whiteTeamCount}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamStatus;
