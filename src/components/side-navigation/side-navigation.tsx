'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { LogOut, X } from 'lucide-react';

import { useGetCurrentUser } from '@/hooks/api/useUser';
import { supabaseClient } from '@/utils/supabase/client';

import { MENU_ITEMS, ADMIN_MENU_ITEMS } from './menu.constants';
import styles from './side-navigation.module.css';
import UserInfo from './user-info';

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNavigation = ({ isOpen, onClose }: SideNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading, error } = useGetCurrentUser();

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.replace('/login');
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.nav
            className={styles.sideNav}
            onClick={(e) => e.stopPropagation()}
            role="navigation"
            aria-label="사이드 네비게이션"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 25,
            }}
          >
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
                  <div className={styles.closeBtnWrapper}>
                    <button className={styles.closeButton} onClick={onClose} aria-label="메뉴 닫기">
                      <X size={24} />
                    </button>
                  </div>
                  <UserInfo user={user} />
                </div>

                <div className={styles.content}>
                  <div className={styles.listWrapper}>
                    <ul className={styles.menuList}>
                      {MENU_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = item.href === pathname;
                        return (
                          <motion.li
                            key={item.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.2 + index * 0.03,
                              duration: 0.25,
                            }}
                          >
                            <a
                              href={item.href}
                              className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                            >
                              <Icon size={20} />
                              {item.label}
                            </a>
                          </motion.li>
                        );
                      })}
                    </ul>

                    {user.is_admin && (
                      <motion.div
                        className={styles.adminWrapper}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.3 }}
                      >
                        <h3>관리자 메뉴</h3>
                        <ul className={styles.menuList}>
                          {ADMIN_MENU_ITEMS.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = item.href === pathname;
                            return (
                              <motion.li
                                key={item.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: 0.4 + index * 0.03,
                                  duration: 0.25,
                                }}
                              >
                                <a
                                  href={item.href}
                                  className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                                >
                                  <Icon size={20} />
                                  {item.label}
                                </a>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    className={styles.logOut}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.3 }}
                  >
                    <button type="button" onClick={handleSignOut}>
                      <LogOut size={20} /> 로그아웃
                    </button>
                  </motion.div>
                </div>
              </>
            ) : null}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SideNavigation;
