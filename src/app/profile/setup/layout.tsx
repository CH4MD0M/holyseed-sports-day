import { redirect } from 'next/navigation';
import { supabaseServer } from '@/utils/supabase/server';

export default async function ProfileSetupLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('department, birth_year')
      .eq('id', user.id)
      .single();

    const isProfileComplete = profile?.department && profile?.birth_year;

    if (isProfileComplete) {
      redirect('/');
    }
  } else {
    redirect('/');
  }

  return <>{children}</>;
}
