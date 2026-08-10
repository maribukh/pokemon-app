import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

interface DetailsErrorProps {
  message: string;
  onClose: () => void;
}

function DetailsError({ message, onClose }: DetailsErrorProps) {
  return (
    <div className="details-card">
      <button className="details-card__close" onClick={onClose}>
        Close
      </button>
      <ErrorMessage message={message} />
    </div>
  );
}

export default DetailsError;
