'use client';

import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';

import MainLayout from '@/components/layout/main-layout';
import styles from './live-draw.module.css';

const LiveDrawPage = () => {
  return (
    <MainLayout>
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

          <h1 className={styles.title}>실시간 추첨</h1>

          <p className={styles.description}>체육대회 당일날 확인하실 수 있습니다</p>

          <motion.div
            className={styles.notice}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AlertCircle size={18} className={styles.noticeIcon} />
            <span className={styles.noticeText}>추첨이 진행되면 자동으로 화면이 표시됩니다</span>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default LiveDrawPage;
