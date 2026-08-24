'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { PokemonExplanationContext } from '../../utils/pokemonExplanationContext';
import { explainPokemonAction } from './actions';
import ExplanationCard from './ExplanationCard';
import ExplanationError from './ExplanationError';
import ExplainTrigger from './ExplainTrigger';
import './ExplainPokemonButton.css';

type ExplanationStatus = 'idle' | 'pending' | 'success' | 'error';
type RequestMode = 'initial' | 'retry' | 'regenerate';

interface ExplainPokemonButtonProps {
  context: PokemonExplanationContext;
}

export default function ExplainPokemonButton({
  context,
}: ExplainPokemonButtonProps) {
  const t = useTranslations('details.ai');
  const locale = useLocale();
  const requestId = useRef(0);
  const [status, setStatus] = useState<ExplanationStatus>('idle');
  const [mode, setMode] = useState<RequestMode>('initial');
  const [explanation, setExplanation] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const handleRequest = async () => {
    if (status === 'pending') return;

    const nextMode: RequestMode =
      status === 'success'
        ? 'regenerate'
        : status === 'error'
          ? 'retry'
          : 'initial';
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;
    setMode(nextMode);
    setStatus('pending');
    setErrorCode(null);

    const result = await explainPokemonAction(context, locale);
    if (requestId.current !== currentRequest) return;

    if (result.ok) {
      setExplanation(result.explanation);
      setStatus('success');
    } else {
      setErrorCode(result.code);
      setStatus('error');
    }
  };

  const label =
    status === 'pending'
      ? t('pending')
      : status === 'error'
        ? t('retry')
        : t('explain');

  return (
    <section className="explain-ai" aria-live="polite">
      {status === 'success' ? (
        <ExplanationCard
          title={t('title')}
          notice={t('notice')}
          explanation={explanation}
          regenerateLabel={t('regenerate')}
          onRegenerate={handleRequest}
        />
      ) : (
        <ExplainTrigger
          label={label}
          pending={status === 'pending'}
          onClick={handleRequest}
        />
      )}
      {status === 'error' && (
        <ExplanationError message={t(`errors.${errorCode ?? 'unknown'}`)} />
      )}
      {status === 'pending' && mode !== 'initial' && (
        <span className="explain-ai__sr-only">{t('pending')}</span>
      )}
    </section>
  );
}
