// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/utils/supabase/server';

export default async function DrawLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 체크
  if (!user) {
    redirect('/login');
  }

  // 프로필 완성도 + 권한 체크 (한 번에 조회)
  const { data: profile } = await supabase
    .from('profiles')
    .select('department, birth_year, role')
    .eq('id', user.id)
    .single();

  // 프로필 미완성
  const isProfileComplete = profile?.department && profile?.birth_year;
  if (!isProfileComplete) {
    redirect('/profile/setup');
  }

  return <>{children}</>;
}
