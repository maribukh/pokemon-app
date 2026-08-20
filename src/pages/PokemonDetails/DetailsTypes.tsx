import type { Pokemon } from '../../types/pokemon.types';

interface DetailsTypesProps {
  types: Pokemon['types'];
}

function DetailsTypes({ types }: DetailsTypesProps) {
  return (
    <div className="details-card__types">
      {types.map((item) => (
        <span key={item.type.name} className="details-card__type-tag">
          {item.type.name}
        </span>
      ))}
    </div>
  );
}

export default DetailsTypes;
