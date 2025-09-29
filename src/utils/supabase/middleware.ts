import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/', '/admin'];
const authRoutes = ['/login'];
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
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isProfileSetup = pathname === profileSetupRoute;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const session = await supabase.auth.getUser();

  // 로그인이 필요한 페이지인데 로그인되지 않은 경우
  if (isProtectedRoute && session.error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 로그인 페이지인데 이미 로그인된 경우
  if (isAuthRoute && !session.error) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 로그인된 사용자 처리
  if (user && !error) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('department, birth_year')
        .eq('id', user.id)
        .single();

      const isProfileComplete = profile?.department && profile?.birth_year;

      // 프로필이 완성되지 않았는데 setup 페이지가 아닌 경우 -> setup으로 리다이렉트
      if (!isProfileComplete && !isProfileSetup) {
        return NextResponse.redirect(new URL(profileSetupRoute, request.url));
      }

      // 프로필이 이미 완성되었는데 setup 페이지에 접근하는 경우 -> 홈으로 리다이렉트
      if (isProfileComplete && isProfileSetup) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // 프로필 조회 실패 시 setup이 아니라면 setup으로 이동
      if (!isProfileSetup) {
        return NextResponse.redirect(new URL(profileSetupRoute, request.url));
      }
    }
  }

  return supabaseResponse;
}
