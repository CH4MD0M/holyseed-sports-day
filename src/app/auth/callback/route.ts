import { NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    next = '/';
  }

  if (code) {
    const supabase = await supabaseServer();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // 프로필 완성 여부 체크
      const { data: profile } = await supabase
        .from('profiles')
        .select('department, birth_year')
        .eq('id', data.user.id)
        .single();

      const isProfileComplete = profile?.department && profile?.birth_year;

      // 프로필 미완성이면 setup으로
      if (!isProfileComplete) {
        next = '/profile/setup';
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
