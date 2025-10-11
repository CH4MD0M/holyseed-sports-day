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
  manifest: './manifest.webmanifest',
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
      <body className="safe-area-top safe-area-bottom">
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
