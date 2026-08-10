import type { Pokemon } from '../../types/pokemon.types';
import { getStatValue } from '../../utils/pokemonStats';

interface DetailsStatsProps {
  pokemon: Pokemon;
}

function DetailsStats({ pokemon }: DetailsStatsProps) {
  const hp = getStatValue(pokemon, 'hp');
  const attack = getStatValue(pokemon, 'attack');

  return (
    <div className="details-card__stats">
      <span>Height: {(pokemon.height / 10).toFixed(1)} m</span>
      <span>Weight: {(pokemon.weight / 10).toFixed(1)} kg</span>
      {hp !== undefined && <span>HP: {hp}</span>}
      {attack !== undefined && <span>Attack: {attack}</span>}
    </div>
  );
}

export default DetailsStats;
