'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

import SideNavigation from '../side-navigation/side-navigation';
import styles from './layout.module.css';

import Image from 'next/image';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  console.log(isScrolled);

  const onMenuClick = () => {
    setIsSideNavOpen((prevState) => !prevState);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  return (
    <div className={styles['page-layout']}>
      <header className={`${styles['main-header']} ${isScrolled ? styles['scrolled'] : ''}`}>
        <div className={styles.leftSection}>
          <Image src="/logo.svg" alt="Logo" width={50} height={50} aria-label="로고" />
        </div>

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
