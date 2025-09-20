import MainHeader from '../header/main-header';
import styles from './layout.module.css';
interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles['page-layout']}>
      <MainHeader />
      <main className={styles['page-main']}>{children}</main>
    </div>
  );
}
