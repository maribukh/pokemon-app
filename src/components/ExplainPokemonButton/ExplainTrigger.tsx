interface ExplainTriggerProps {
  label: string;
  pending: boolean;
  onClick: () => void;
}

export default function ExplainTrigger({
  label,
  pending,
  onClick,
}: ExplainTriggerProps) {
  return (
    <button
      className="explain-ai__button"
      type="button"
      onClick={onClick}
      disabled={pending}
    >
      {pending && <span className="explain-ai__spinner" aria-hidden="true" />}
      {label}
    </button>
  );
}
