import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usePokemonDetailsQuery } from '../../hooks/usePokemonDetailsQuery';
import DetailsLoading from './DetailsLoading';
import DetailsError from './DetailsError';
import DetailsContent from './DetailsContent';
import './PokemonDetails.css';

function PokemonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const {
    data: pokemon,
    isLoading,
    isFetching,
    isError,
    error,
  } = usePokemonDetailsQuery(id);

  const handleClose = () => {
    navigate(`/?${searchParams.toString()}`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['pokemonDetails', id] });
  };

  if (isLoading) {
    return <DetailsLoading />;
  }

  if (isError || !pokemon) {
    const message =
      error instanceof Error ? error.message : 'Pokemon not found';
    return <DetailsError message={message} onClose={handleClose} />;
  }

  return (
    <DetailsContent
      pokemon={pokemon}
      isFetching={isFetching}
      onRefresh={handleRefresh}
      onClose={handleClose}
    />
  );
}

export default PokemonDetails;
