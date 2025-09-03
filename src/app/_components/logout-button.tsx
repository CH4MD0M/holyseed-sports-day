'use client';

import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/utils/supabase/client';
import Button from '@/components/ui/Button';

const LogoutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = supabaseClient();
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <Button variant="primary" size="lg" fullWidth onClick={handleSignOut}>
      로그아웃
    </Button>
  );
};

export default LogoutButton;
