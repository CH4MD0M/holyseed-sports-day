import type { Metadata, Viewport } from 'next';

import { pretendard } from '@/lib/fonts';
import { ModalRenderer } from '@/components/modal/modal-renderer';
import ToastProvider from '@/components/provider/toast-provider';
import QueryProvider from '@/components/provider/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: '홀리씨드 체육대회',
  description: '계산교회 청년 2,3부 체육대회 앱',
  keywords: ['체육대회', '추첨', '실시간'],
  authors: [{ name: 'Holyseed' }],
  creator: 'Holyseed',
  publisher: 'Holyseed',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://holyseed.app',
    title: '홀리씨드 체육대회',
    description: '계산교회 청년 2,3부 체육대회 앱',
    siteName: '홀리씨드 체육대회',
    images: [
      {
        url: '/cover-image.png',
        width: 1200,
        height: 630,
        alt: '홀리씨드 체육대회',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '홀리씨드 체육대회',
    description: '계산교회 청년 2,3부 체육대회 앱',
    images: ['/cover-image.png'],
    creator: '@holyseed',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="safe-area-top safe-area-bottom" suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <div className="container">{children}</div>
          </ToastProvider>
        </QueryProvider>

        <ModalRenderer />
      </body>
    </html>
  );
}
