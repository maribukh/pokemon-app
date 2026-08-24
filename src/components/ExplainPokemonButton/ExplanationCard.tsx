import ExplanationBadge from './ExplanationBadge';

interface ExplanationCardProps {
  title: string;
  notice: string;
  explanation: string;
  regenerateLabel: string;
  onRegenerate: () => void;
}

export default function ExplanationCard({
  title,
  notice,
  explanation,
  regenerateLabel,
  onRegenerate,
}: ExplanationCardProps) {
  return (
    <article className="explain-ai__card">
      <div className="explain-ai__card-header">
        <h3 className="explain-ai__title">{title}</h3>
        <ExplanationBadge label={notice} />
      </div>
      <p className="explain-ai__result">{explanation}</p>
      <button
        className="explain-ai__regenerate"
        type="button"
        onClick={onRegenerate}
      >
        {regenerateLabel}
      </button>
    </article>
  );
}
