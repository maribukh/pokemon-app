import type { CSSProperties } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import { getTypeColor } from '../../utils/typeColors';
import { getPokemonImage } from '../../utils/pokemonStats';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import DetailsTypes from './DetailsTypes';
import DetailsStats from './DetailsStats';
import './PokemonDetails.css';

function PokemonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pokemon, loading, error } = usePokemonDetails(id);

  const handleClose = () => {
    navigate(`/?${searchParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="details-card">
        <Loader />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="details-card">
        <button className="details-card__close" onClick={handleClose}>
          Close
        </button>
        <ErrorMessage message={error ?? 'Pokemon not found'} />
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const color = getTypeColor(primaryType);
  const cardStyle = { '--type-accent': color.accent } as CSSProperties;

  return (
    <div className="details-card" style={cardStyle}>
      <button className="details-card__close" onClick={handleClose}>
        Close
      </button>
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

export default PokemonDetails;
