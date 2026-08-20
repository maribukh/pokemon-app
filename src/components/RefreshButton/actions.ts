'use server';

import { revalidateTag } from 'next/cache';

export async function refreshPokemonDataAction() {
  revalidateTag('pokemon', 'max');
}
