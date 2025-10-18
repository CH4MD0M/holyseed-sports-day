import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import styles from './completed-screen.module.css';

const CompletedScreen = () => {
  return (
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

        <h1 className={styles.title}>끝!</h1>

        <p className={styles.description}>추첨이 종료되었습니다</p>
      </motion.div>
    </div>
  );
};

export default CompletedScreen;
