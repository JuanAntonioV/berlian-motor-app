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

// @ts-ignore
// BigInt.prototype.toJSON = function () {
//   const int = Number.parseInt(this.toString());
//   return int ?? this.toString();
// };

Settings.defaultZone = 'Asia/Jakarta';
Settings.defaultLocale = 'id-ID';

Info.monthsFormat('long', {
  locale: 'id',
});
Info.monthsFormat('short', {
  locale: 'id',
});
Info.weekdaysFormat('long', {
  locale: 'id',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
