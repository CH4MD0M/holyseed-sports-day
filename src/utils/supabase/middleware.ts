import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = ['/login', '/auth/callback'];
const profileSetupRoute = '/profile/setup';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProfileSetup = pathname === profileSetupRoute;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 로그인되지 않은 경우
  if (error || !user) {
    // public 경로가 아니면 로그인 페이지로 리다이렉트
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return supabaseResponse;
  }

  // 로그인된 사용자가 login 페이지 접근 시
  if (pathname === '/login') {
    // 프로필 체크 후 적절한 곳으로 리다이렉트
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('department, birth_year')
        .eq('id', user.id)
        .single();

      const isProfileComplete = profile?.department && profile?.birth_year;

      if (!isProfileComplete) {
        return NextResponse.redirect(new URL(profileSetupRoute, request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL(profileSetupRoute, request.url));
    }

    return NextResponse.redirect(new URL('/', request.url));
  }

  // /auth/callback은 그냥 통과
  if (pathname === '/auth/callback') {
    return supabaseResponse;
  }

  // 로그인된 사용자의 프로필 체크
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('department, birth_year')
      .eq('id', user.id)
      .single();

    const isProfileComplete = profile?.department && profile?.birth_year;

    // 프로필 미완성 -> setup으로 리다이렉트
    if (!isProfileComplete && !isProfileSetup) {
      return NextResponse.redirect(new URL(profileSetupRoute, request.url));
    }

    // 프로필 완성됨 -> setup 접근 시 홈으로
    if (isProfileComplete && isProfileSetup) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    // 프로필 조회 실패 시 setup으로
    if (!isProfileSetup) {
      return NextResponse.redirect(new URL(profileSetupRoute, request.url));
    }
  }

  return supabaseResponse;
}
