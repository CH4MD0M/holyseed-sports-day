'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';

import SideNavigation from '../side-navigation/side-navigation';
import styles from './layout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const onMenuClick = () => {
    setIsSideNavOpen((prevState) => !prevState);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  return (
    <div className={styles['page-layout']}>
      <header className={styles['main-header']}>
        <div className={styles.leftSection}>{/* 필요시 추가 버튼 */}</div>

        <div className={styles.rightSection}>
          <button className={styles.iconButton} onClick={onMenuClick} aria-label="메뉴">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <SideNavigation isOpen={isSideNavOpen} onClose={closeSideNav} />
      <main className={styles['page-main']}>{children}</main>
    </div>
  );
}
