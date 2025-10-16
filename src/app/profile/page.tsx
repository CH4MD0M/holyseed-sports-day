'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipLoader } from 'react-spinners';

import { type LucideIcon, CheckCircle, Trophy, Gift, PlayCircle, LogOut } from 'lucide-react';

import { useGetUserProfile } from '@/hooks/api/use-user-profile';
import { supabaseClient } from '@/utils/supabase/client';

import MainLayout from '@/components/layout/main-layout';
import UserInfo from './_components/user-info';
import styles from './profile-page.module.css';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const MENU_ITEMS: MenuItem[] = [
  { label: '체크인', href: 'profile/check-in', icon: CheckCircle },
  { label: '추첨 결과', href: '/draw/result', icon: Trophy },
];

const ADMIN_MENU_ITEMS: MenuItem[] = [
  { label: '추첨 상품 관리', href: '/admin/prizes', icon: Gift },
  { label: '추첨 진행', href: '/admin/draw', icon: PlayCircle },
];

const ProfilePage = () => {
  const pathname = usePathname();

  const { data: user, isLoading, error } = useGetUserProfile();

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    window.location.href = '/';
  };

  return (
    <MainLayout title="프로필">
      <AnimatePresence>
        <div className={styles.container}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <ClipLoader color="#059669" size={50} speedMultiplier={0.8} />
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>사용자 정보를 불러올 수 없습니다.</p>
              <button onClick={() => window.location.reload()}>다시 시도</button>
            </div>
          ) : user ? (
            <>
              <div className={styles.header}>
                <UserInfo user={user} />
              </div>

              <div className={styles.content}>
                <div className={styles.menuWrapper}>
                  <motion.div
                    className={styles.menuSection}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <h3 className={styles.menuTitle}>메뉴</h3>
                    <ul className={styles.menuList}>
                      {MENU_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = item.href === pathname;
                        return (
                          <motion.li
                            key={item.label}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.15 + index * 0.05,
                              duration: 0.2,
                            }}
                          >
                            <Link
                              href={item.href}
                              className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                            >
                              <Icon size={20} />
                              {item.label}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </motion.div>

                  {user.is_admin && (
                    <motion.div
                      className={styles.menuSection}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <h3 className={styles.menuTitle}>관리자 메뉴</h3>
                      <ul className={styles.menuList}>
                        {ADMIN_MENU_ITEMS.map((item, index) => {
                          const Icon = item.icon;
                          const isActive = item.href === pathname;
                          return (
                            <motion.li
                              key={item.label}
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: 0.3 + index * 0.05,
                                duration: 0.2,
                              }}
                            >
                              <Link
                                href={item.href}
                                className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                              >
                                <Icon size={20} />
                                {item.label}
                              </Link>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </div>

                <motion.div
                  className={styles.logoutSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                >
                  <button type="button" onClick={handleSignOut} className={styles.logoutButton}>
                    <LogOut size={20} /> 로그아웃
                  </button>
                </motion.div>
              </div>
            </>
          ) : null}
        </div>
      </AnimatePresence>
    </MainLayout>
  );
};

export default ProfilePage;
