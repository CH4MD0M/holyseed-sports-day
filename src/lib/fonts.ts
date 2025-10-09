import localFont from 'next/font/local';

export const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const schoolSafetyWave = localFont({
  src: [
    {
      path: '../../public/fonts/TTHakgyoansimMulgyeolR.woff2',
      weight: '400',
    },
    {
      path: '../../public/fonts/TTHakgyoansimMulgyeolB.woff2',
      weight: '700',
    },
  ],
  display: 'swap',
  variable: '--font-school-safety-wave',
});
