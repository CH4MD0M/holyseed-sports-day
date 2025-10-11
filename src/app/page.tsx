import MainLayout from '@/components/layout/main-layout';
import styles from './page.module.css';

export default async function Home() {
  return (
    <MainLayout>
      <div className={styles.videoContainer}>
        <video className={styles.video} autoPlay muted playsInline preload="auto">
          <source src="/main-video.mp4" type="video/mp4" />
          비디오를 재생할 수 없습니다.
        </video>
      </div>
    </MainLayout>
  );
}
