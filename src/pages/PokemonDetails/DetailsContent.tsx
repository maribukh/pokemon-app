import type { CSSProperties } from 'react';
import type { Pokemon } from '../../types/pokemon.types';
import { getTypeColor } from '../../utils/typeColors';
import { getPokemonImage } from '../../utils/pokemonStats';
import RefreshButton from '../../components/RefreshButton/RefreshButton';
import DetailsTypes from './DetailsTypes';
import DetailsStats from './DetailsStats';

interface DetailsContentProps {
  pokemon: Pokemon;
  isFetching: boolean;
  onRefresh: () => void;
  onClose: () => void;
}

function DetailsContent({
  pokemon,
  isFetching,
  onRefresh,
  onClose,
}: DetailsContentProps) {
  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const color = getTypeColor(primaryType);
  const cardStyle = { '--type-accent': color.accent } as CSSProperties;

  return (
    <div className="details-card" style={cardStyle}>
      <div className="details-card__toolbar">
        <RefreshButton onClick={onRefresh} isFetching={isFetching} />
        <button className="details-card__close" onClick={onClose}>
          Close
        </button>
      </div>
      <img
        className="details-card__image"
        src={getPokemonImage(pokemon)}
        alt={pokemon.name}
      />
      <h2 className="details-card__name">{pokemon.name}</h2>
      <DetailsTypes types={pokemon.types} />
      <DetailsStats pokemon={pokemon} />
    </div>
  );
}

export default DetailsContent;
