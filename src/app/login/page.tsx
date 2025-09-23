'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './login.module.css';

import { supabaseClient } from '@/utils/supabase/client';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginBtnClick = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: location.origin + '/auth/callback',
        },
      });

      if (error) {
        setIsLoading(false);
        throw error;
      }
    } catch (error) {
      console.error('로그인 에러:', error);

      setIsLoading(false);
    }
  };

  return (
    <main className={styles.loginMain}>
      <div className={styles.logoWrapper}>
        <Image width={400} height={400} src="/logo.svg" alt="logo" />
        <h2>청년 2, 3부 연합 체육대회</h2>
      </div>
      <button className={styles.kakaoBtn} disabled={isLoading} onClick={handleLoginBtnClick}>
        {isLoading ? (
          <>
            <div className={styles.spinner} />
            <span>로그인 중</span>
          </>
        ) : (
          <>
            <Image width={20} height={20} src="/kakao-login-btn.svg" alt="kakao-login-btn" />
            <span>{isLoading ? '로그인 중..' : '카카오로 로그인하기'}</span>
          </>
        )}
      </button>
    </main>
  );
};

export default LoginPage;
