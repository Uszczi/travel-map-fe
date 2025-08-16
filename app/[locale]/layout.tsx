import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';

import Navbar from '@/components/Navbar';
import '../globals.css';


async function loadMessages(locale: string) {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return messages;
  } catch {
    notFound();
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await loadMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-dvh bg-white text-gray-800 dark:bg-zinc-800 dark:text-zinc-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <main className="container py-8">{children}</main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
