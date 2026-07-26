import type { Pokemon } from '../../types/pokemon.types';

interface DetailsTypesProps {
  types: Pokemon['types'];
}

function DetailsTypes({ types }: DetailsTypesProps) {
  return (
    <div className="details-card__types">
      {types.map((t) => (
        <span key={t.type.name} className="details-card__type-tag">
          {t.type.name}
        </span>
      ))}
    </div>
  );
}

export default DetailsTypes;
