'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

import styles from './not-found.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={styles.errorCode}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: 'spring' }}
        >
          404
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          페이지를 찾을 수 없습니다
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Link href="/" className={styles.homeButton}>
            <Home size={20} />
            홈으로 돌아가기
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
