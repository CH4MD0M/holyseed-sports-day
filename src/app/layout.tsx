import type { Metadata, Viewport } from 'next';
import { pretendard } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: '홀리시드 스포츠데이',
  description: '실시간 게임 진행 및 점수 확인 서비스',
  keywords: ['스포츠데이', '게임', '점수', '실시간'],
  authors: [{ name: 'Holyseed' }],
  creator: 'Holyseed',
  publisher: 'Holyseed',
  manifest: './manifest.ts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="safe-area-top safe-area-bottom container">{children}</body>
    </html>
  );
}
