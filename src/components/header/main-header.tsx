'use client';

import { Menu } from 'lucide-react';
import styles from './main-header.module.css';

interface MainHeaderProps {
  onMenuClick?: () => void;
}

export default function MainHeader({ onMenuClick }: MainHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>{/* 필요시 추가 버튼 */}</div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton} onClick={onMenuClick} aria-label="메뉴">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
