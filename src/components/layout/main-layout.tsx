'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Calendar, Trophy, User } from 'lucide-react';
import styles from './layout.module.css';
import { useEffect, useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: '홈', href: '/', icon: Home },
  { label: '일정 안내', href: '/schedule', icon: Calendar },
  { label: '추첨', href: '/live-draw', icon: Trophy },
  { label: '프로필', href: '/profile', icon: User },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

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

  return (
    <div className={styles['page-layout']}>
      <header className={`${styles['main-header']} ${isScrolled ? styles['scrolled'] : ''}`}>
        <div className={styles.leftSection}>
          <Image src="/logo.svg" alt="Logo" width={40} height={40} aria-label="로고" />
        </div>
      </header>

      <main className={styles['page-main']}>{children}</main>

      <nav className={styles['bottom-nav']}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles['nav-item']} ${isActive ? styles.active : ''}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
