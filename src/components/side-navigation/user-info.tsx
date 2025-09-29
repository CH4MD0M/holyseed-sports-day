'use client';

import { motion } from 'framer-motion';
import { Tables } from '@/types/supabase.type';
import styles from './user-info.module.css';

type UserInfo = Tables<'profiles'>;

interface UserInfoProps {
  user: UserInfo;
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className={styles.userInfoWrapper}>
      <motion.div
        className={styles.nameSection}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <h2 className={styles.userName}>
          {user.birth_year?.toString().slice(2)} {user.name}
        </h2>
        {user.role === 'developer' ? (
          <span className={`${styles.badge} ${styles.developerBadge}`}>developer</span>
        ) : user.is_admin ? (
          <span className={`${styles.badge} ${styles.adminBadge}`}>TF팀</span>
        ) : (
          ''
        )}
      </motion.div>
      <motion.div
        className={styles.userInfo}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <span className={`${styles.infoItem} ${!user.team ? styles.pending : ''}`}>
          {user.team ? `${user.team} 팀` : '팀 분류중'}
        </span>
        <span className={styles.separator}>&#183;</span>
        <span className={`${styles.infoItem} ${!user.department ? styles.pending : ''}`}>
          {user.department || '부서 미입력'}
        </span>
      </motion.div>
    </div>
  );
};

export default UserInfo;
