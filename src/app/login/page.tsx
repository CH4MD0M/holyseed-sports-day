'use client';

import styles from './login.module.css';
import Image from 'next/image';
import { supabaseClient } from '@/utils/supabase/client';

const LoginPage = () => {
  const handleLoginBtnClick = () => {
    const supabase = supabaseClient();
    supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: location.origin + '/auth/callback',
      },
    });
  };

  return (
    <>
      <div className={styles.logoWrapper}>
        <Image width={300} height={300} src="/logo.png" alt="logo" />
        <h2>청년 2, 3부 연합 체육대회</h2>
      </div>
      <button className={styles.kakaoBtn} onClick={handleLoginBtnClick} type="button">
        <Image width={20} height={20} src="/kakao-login-btn.svg" alt="kakao-login-btn" />
        <span>카카오로 로그인하기</span>
      </button>
    </>
  );
};

export default LoginPage;
