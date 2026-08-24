interface ExplanationErrorProps {
  message: string;
}

export default function ExplanationError({
  message,
}: ExplanationErrorProps) {
  return <p className="explain-ai__error">{message}</p>;
}
