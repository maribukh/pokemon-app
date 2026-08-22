import { fetchPokemonByName } from '../../services/pokemonApi';
import { getLocale } from 'next-intl/server';
import { getTypeColor } from '../../utils/typeColors';
import { getPokemonImage, getStatValue } from '../../utils/pokemonStats';
import { buildPokemonExplanationContext } from '../../utils/pokemonExplanationContext';
import { Link } from '../../i18n/navigation';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ExplainPokemonButton from '../ExplainPokemonButton/ExplainPokemonButton';
import DetailsImage from './DetailsImage';
import DetailsStats from './DetailsStats';
import DetailsTypes from './DetailsTypes';
import './DetailsPanel.css';

interface DetailsPanelProps {
  id: string;
  page: number;
  search: string;
}

export default async function DetailsPanel({
  id,
  page,
  search,
}: DetailsPanelProps) {
  const closeParams = new URLSearchParams({ page: String(page) });
  if (search) closeParams.set('search', search);
  const closeHref = `/?${closeParams.toString()}`;

  let pokemon;
  try {
    pokemon = await fetchPokemonByName(id);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Pokemon not found';
    return (
      <div className="details-card">
        <Link className="details-card__close" href={closeHref}>
          Close
        </Link>
        <ErrorMessage message={message} />
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const color = getTypeColor(primaryType);
  const hp = getStatValue(pokemon, 'hp');
  const attack = getStatValue(pokemon, 'attack');
  const locale = await getLocale();

  return (
    <div
      className="details-card"
      style={{ '--type-accent': color.accent } as React.CSSProperties}
    >
      <Link className="details-card__close" href={closeHref}>
        Close
      </Link>
      <DetailsImage src={getPokemonImage(pokemon)} alt={pokemon.name} />
      <h2 className="details-card__name">{pokemon.name}</h2>
      <DetailsTypes types={pokemon.types} />
      <DetailsStats
        height={pokemon.height}
        weight={pokemon.weight}
        hp={hp}
        attack={attack}
      />
      <ExplainPokemonButton
        key={`${pokemon.id}-${locale}`}
        context={buildPokemonExplanationContext(pokemon)}
      />
    </div>
  );
}
