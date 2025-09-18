'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import styles from './page-header.module.css';

interface PageHeaderProps {
  title: string;
  onBackClick?: () => void;
}

export default function PageHeader({ title, onBackClick }: PageHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) onBackClick();
    else router.back();
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.iconButton} onClick={handleBackClick} aria-label="뒤로 가기">
          <ArrowLeft size={24} />
        </button>
      </div>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.rightSection}>{/* 필요시 추가 버튼 */}</div>
    </header>
  );
}
