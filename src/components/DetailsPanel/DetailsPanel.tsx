import { fetchPokemonByName } from '../../services/pokemonApi';
import { getTypeColor } from '../../utils/typeColors';
import { getPokemonImage, getStatValue } from '../../utils/pokemonStats';
import { Link } from '../../i18n/navigation';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import DetailsImage from './DetailsImage';
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
      <div className="details-card__types">
        {pokemon.types.map((t) => (
          <span key={t.type.name} className="details-card__type-tag">
            {t.type.name}
          </span>
        ))}
      </div>
      <div className="details-card__stats">
        <span>Height: {(pokemon.height / 10).toFixed(1)} m</span>
        <span>Weight: {(pokemon.weight / 10).toFixed(1)} kg</span>
        {hp !== undefined && <span>HP: {hp}</span>}
        {attack !== undefined && <span>Attack: {attack}</span>}
      </div>
    </div>
  );
}
