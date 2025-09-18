'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { supabaseClient } from '@/utils/supabase/client';
import Button from '@/components/ui/Button';

const LogoutButton = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabaseClient.auth.signOut();
    router.replace('/login');

    setIsLoading(false);
  };

  return (
    <Button variant="primary" size="lg" fullWidth onClick={handleSignOut} loading={isLoading}>
      {isLoading ? '로그아웃 중..' : '로그아웃'}
    </Button>
  );
};

export default LogoutButton;
