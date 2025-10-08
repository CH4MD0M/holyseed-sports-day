import MainLayout from '@/components/layout/main-layout';
import styles from './page.module.css';

export default async function Home() {
  return (
    <MainLayout>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1 className={styles.title}>HolySeed 체육대회</h1>
        </div>
      </div>
    </MainLayout>
  );
}
