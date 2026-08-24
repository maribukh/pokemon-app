import type { ReactNode } from 'react';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { ThemeProvider } from '../../context/ThemeContext';
import Header from '../../components/Header/Header';
import Flyout from '../../components/Flyout/Flyout';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import '../../styles/index.css';
import '../../styles/App.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <div className="app-shell">
                <Header />
                {children}
                <Flyout />
              </div>
            </ErrorBoundary>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
