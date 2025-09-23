import { redirect } from 'next/navigation';
import { supabaseServer } from '@/utils/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // const supabase = await supabaseServer();
  //
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  //
  // if (!user) {
  //   redirect('/login');
  // }
  //
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('is_admin')
  //   .eq('id', user.id)
  //   .single();
  //
  // if (!profile?.is_admin) {
  //   redirect('/');
  // }

  return <>{children}</>;
}
