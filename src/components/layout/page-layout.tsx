import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import styles from './layout.module.css';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export default function PageLayout({
  title,
  children,
  onBackClick,
  showBackButton = true,
}: PageLayoutProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) onBackClick();
    else router.back();
  };

  return (
    <div className={styles['page-layout']}>
      <header className={styles['page-header']}>
        <div className={styles.leftSection}>
          {showBackButton && (
            <button className={styles.iconButton} onClick={handleBackClick} aria-label="뒤로 가기">
              <ArrowLeft size={24} />
            </button>
          )}
        </div>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.rightSection}>{/* 필요시 추가 버튼 */}</div>
      </header>
      <main className={styles['page-main']}>{children}</main>
    </div>
  );
}
