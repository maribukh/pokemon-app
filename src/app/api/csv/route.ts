import { NextRequest } from 'next/server';
import { fetchPokemonByName } from '../../../services/pokemonApi';

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids') ?? '';
  const ids = idsParam.split(',').filter(Boolean);

  const pokemons = await Promise.all(ids.map((id) => fetchPokemonByName(id)));

  const header = 'id,name,types,details_url\n';
  const rows = pokemons.map((p) =>
    [
      p.id,
      p.name,
      p.types.map((t) => t.type.name).join('|'),
      `https://pokeapi.co/api/v2/pokemon/${p.id}`,
    ].join(',')
  );
  const csv = header + rows.join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${ids.length}_items.csv"`,
    },
  });
}
