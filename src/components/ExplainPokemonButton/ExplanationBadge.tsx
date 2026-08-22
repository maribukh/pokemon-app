interface ExplanationBadgeProps {
	label: string;
}

export default function ExplanationBadge({ label }: ExplanationBadgeProps) {
	return (
		<span className="explain-ai__badge">
			<span className="explain-ai__badge-icon" aria-hidden="true">
				i
			</span>
			{label}
		</span>
	);
}
