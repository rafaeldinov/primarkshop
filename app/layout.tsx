import type { Metadata } from 'next';
import {
  inter,
  roboto_mono,
  montserrat,
  cookie,
  gotham,
  poppins,
} from './custom-fonts';
import './globals.css';
import { getServerSession } from 'next-auth';

import SessionProvider from '@/components/session-provider/session-provider';
import { authConfig } from './api/auth/[...nextauth]/route';
import Header from '@/components/header/header';
import CommingSoon from '@/components/comming-soon/comming-soon';

export const metadata: Metadata = {
  title: 'Primark спільні покупки',
  description: 'Спільні закупки за кордоном',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  const role = session?.user.role;

  return (
    <html lang='ua'>
      <link rel='icon' href='/favicon/favicon.ico' sizes='any' />
      <link
        rel='icon'
        href='/favicon/icon.png'
        type='image/png'
        sizes='512x512'
      />
      <body
        className={`${inter.variable} ${roboto_mono.variable} ${montserrat.variable} ${cookie.variable} ${poppins.variable} ${gotham.variable}`}
      >
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
