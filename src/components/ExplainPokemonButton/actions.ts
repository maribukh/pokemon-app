'use server';

import type { Locale } from 'next-intl';
import {
  isExplanationContextWithinLimit,
  isPokemonExplanationContext,
  type PokemonExplanationContext,
} from '../../utils/pokemonExplanationContext';
import {
  generatePokemonExplanation,
  PokemonExplanationError,
  type ExplanationErrorCode,
} from '../../services/ai/pokemonExplanation';

const supportedLocales = ['en', 'ru'] as const;
type ExplanationLocale = (typeof supportedLocales)[number];

export type ExplanationActionResult =
  | { ok: true; explanation: string }
  | { ok: false; code: ExplanationErrorCode | 'invalid_request' };

export async function explainPokemonAction(
  context: PokemonExplanationContext,
  locale: Locale | string
): Promise<ExplanationActionResult> {
  if (
    !isPokemonExplanationContext(context) ||
    !isExplanationContextWithinLimit(context) ||
    !supportedLocales.includes(locale as ExplanationLocale)
  ) {
    return { ok: false, code: 'invalid_request' };
  }

  try {
    return {
      ok: true,
      explanation: await generatePokemonExplanation(context, locale),
    };
  } catch (error) {
    if (error instanceof PokemonExplanationError) {
      return { ok: false, code: error.code };
    }
    return { ok: false, code: 'unknown' };
  }
}
