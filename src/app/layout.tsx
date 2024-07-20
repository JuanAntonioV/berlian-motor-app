import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Info, Settings } from 'luxon';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Berlian Motor | Inventory Management System',
  description:
    'Aplikasi manajemen persediaan barang pada bengkel Berlian Motor',
};

Settings.defaultZone = 'Asia/Jakarta';
Settings.defaultLocale = 'id-ID';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='id'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
