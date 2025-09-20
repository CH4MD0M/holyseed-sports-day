import PageHeader from '../header/page-header';
import styles from './layout.module.css';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  onBackClick?: () => void;
}

export default function PageLayout({ title, children, onBackClick }: PageLayoutProps) {
  return (
    <div className={styles['page-layout']}>
      <PageHeader title={title} onBackClick={onBackClick} />
      <main className={styles['page-main']}>{children}</main>
    </div>
  );
}
