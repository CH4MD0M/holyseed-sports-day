'use client';

import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

import MainLayout from '@/components/layout/main-layout';
import styles from './coming-soon.module.css';

const ComingSoonPage = () => {
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
            <Construction className={styles.icon} size={56} />
          </motion.div>

          <h1 className={styles.title}>페이지 준비중입니다</h1>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ComingSoonPage;
