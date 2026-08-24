import type { PokemonType } from '../../types/pokemon.types';

interface DetailsTypesProps {
  types: PokemonType[];
}

export default function DetailsTypes({ types }: DetailsTypesProps) {
  return (
    <div className="details-card__types">
      {types.map((type) => (
        <span key={type.type.name} className="details-card__type-tag">
          {type.type.name}
        </span>
      ))}
    </div>
  );
}
