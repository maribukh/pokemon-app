'use server';

import { redirect } from '../../i18n/navigation';
import type { Locale } from 'next-intl';

export async function searchAction(locale: Locale, formData: FormData) {
  const term = ((formData.get('search') as string) ?? '').trim();
  const params = new URLSearchParams({ page: '1' });
  if (term) {
    params.set('search', term);
  }
  redirect({ href: `/?${params.toString()}`, locale });
}
