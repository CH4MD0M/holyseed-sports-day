import styles from './page.module.css';
import Button from '@/components/ui/Button';
import LogoutButton from './_components/logout-button';

export default async function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Holyseed 체육대회</h1>
        <p className={styles.description}>
          실시간으로 게임 점수를 확인하고
          <br />
          경기 진행 상황을 업데이트하세요
        </p>
      </div>

      <div className={styles.actions}>
        <Button variant="outline" size="lg" fullWidth>
          진행자 페이지 이동
        </Button>
        <LogoutButton />
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🏃‍♂️</div>
          <h3 className={styles.featureTitle}>실시간 점수</h3>
          <p className={styles.featureDesc}>경기 진행 상황을 실시간으로 확인할 수 있어요</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📊</div>
          <h3 className={styles.featureTitle}>순위 확인</h3>
          <p className={styles.featureDesc}>팀별 순위와 점수를 한눈에 볼 수 있어요</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>⚡</div>
          <h3 className={styles.featureTitle}>즉시 업데이트</h3>
          <p className={styles.featureDesc}>점수 변동 시 자동으로 업데이트돼요</p>
        </div>
      </div>
    </main>
  );
}
