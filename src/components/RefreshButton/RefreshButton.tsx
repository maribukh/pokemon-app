'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '../../i18n/navigation';
import { refreshPokemonDataAction } from './actions';
import './RefreshButton.css';

export default function RefreshButton() {
  const t = useTranslations('refresh');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = () => {
    setIsRefreshing(true);
    startTransition(async () => {
      await refreshPokemonDataAction();
      router.refresh();
      setIsRefreshing(false);
    });
  };

  const busy = isPending || isRefreshing;

  return (
    <button
      className="refresh-button"
      onClick={handleClick}
      disabled={busy}
      aria-label={busy ? t('loading') : t('idle')}
    >
      <span
        className={`refresh-button__icon ${busy ? 'refresh-button__icon--spinning' : ''}`}
      >
        ⟳
      </span>
      {busy ? t('loading') : t('idle')}
    </button>
  );
}
