import styles from './page.module.css';
import Button from '@/components/ui/Button';
import LogoutButton from './_components/logout-button';
import { supabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect('/login');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Holyseed 체육대회</h1>
        <p className={styles.description}>{profile?.name}님, 안녕하세요!</p>
      </div>

      <div className={styles.actions}>
        <LogoutButton />
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🎁</div>
          <h3 className={styles.featureTitle}>경품추첨</h3>
          <p className={styles.featureDesc}>다양한 경품을 추첨으로 받을 수 있어요</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📅</div>
          <h3 className={styles.featureTitle}>일정확인</h3>
          <p className={styles.featureDesc}>체육대회 일정과 경기 시간을 확인할 수 있어요</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>✅</div>
          <h3 className={styles.featureTitle}>출석 체크인</h3>
          <p className={styles.featureDesc}>간편하게 출석 체크를 할 수 있어요</p>
        </div>
      </div>
    </main>
  );
}
