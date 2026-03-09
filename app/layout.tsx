import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Verola Studios — Creative Agency',
    template: '%s | Verola Studios',
  },
  description:
    'Verola Studios is a full-service creative agency crafting compelling visual identities, immersive video productions, and digital experiences for brands that dare to stand out.',
  keywords: ['creative agency', 'brand identity', 'video production', 'photography', 'UI/UX design'],
  openGraph: {
    title: 'Verola Studios — Creative Agency',
    description: 'We build brands that cannot be ignored.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-ink text-cream font-body antialiased overflow-x-hidden">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A2E',
              color: '#F5F0E8',
              border: '1px solid #C9A84C',
              fontFamily: 'var(--font-body)',
            },
          }}
        />
      </body>
    </html>
  );
}
