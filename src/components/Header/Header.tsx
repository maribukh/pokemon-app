'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '../../i18n/navigation';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="header-area">
      <div className="header-container">
        <div className="brand">
          <h1>Poki Land</h1>
        </div>
        <div className="header-right">
          <nav className="header-nav">
            <Link href="/" className="header-nav__link">
              {t('home')}
            </Link>
            <Link href="/about" className="header-nav__link">
              {t('about')}
            </Link>
          </nav>
          <select
            className="language-switcher"
            value={locale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
