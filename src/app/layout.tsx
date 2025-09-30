import type { Metadata } from 'next';
// eslint-disable-next-line import/order
import { Inter, Space_Grotesk } from 'next/font/google';

import './globals.css';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '700', '800', '900'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'DevFlow',
  description:
    'A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.',
  icons: {
    icon: '/images/site-logo.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-right" richColors />
            {children}
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
