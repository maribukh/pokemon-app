interface DetailsStatsProps {
  height: number;
  weight: number;
  hp: number | undefined;
  attack: number | undefined;
}

export default function DetailsStats({
  height,
  weight,
  hp,
  attack,
}: DetailsStatsProps) {
  return (
    <div className="details-card__stats">
      <span>Height: {(height / 10).toFixed(1)} m</span>
      <span>Weight: {(weight / 10).toFixed(1)} kg</span>
      {hp !== undefined && <span>HP: {hp}</span>}
      {attack !== undefined && <span>Attack: {attack}</span>}
    </div>
  );
}
