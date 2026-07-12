export interface TypeColor {
  from: string;
  to: string;
  accent: string;
}

const TYPE_COLORS: Record<string, TypeColor> = {
  fire: { from: '#F0A868', to: '#D9714B', accent: '#C2542E' },
  water: { from: '#7FB8D9', to: '#4A8DB8', accent: '#3D6E94' },
  grass: { from: '#8FBF8A', to: '#5A9161', accent: '#4A7850' },
  electric: { from: '#F0D584', to: '#D9AE4F', accent: '#B8903A' },
  psychic: { from: '#C9A8DB', to: '#9B72B8', accent: '#7D5A99' },
  ice: { from: '#B8E0E8', to: '#8AC4D0', accent: '#5FA3B0' },
  dark: { from: '#6B6570', to: '#3D3842', accent: '#2E2A33' },
  fairy: { from: '#F0C4D4', to: '#DB94AF', accent: '#B8708F' },
  dragon: { from: '#5A6B94', to: '#2E3D5C', accent: '#3D4D70' },
  normal: { from: '#C4BFB5', to: '#A39D8F', accent: '#8A8477' },
  fighting: { from: '#D99B7F', to: '#B8664A', accent: '#96513A' },
  flying: { from: '#A8B8D9', to: '#7A8FB8', accent: '#5F7396' },
  poison: { from: '#B894D9', to: '#8A5FB8', accent: '#704A96' },
  ground: { from: '#D9BC8A', to: '#B8935A', accent: '#96784A' },
  rock: { from: '#C4B8A0', to: '#A3947A', accent: '#847860' },
  bug: { from: '#A8C480', to: '#7FA355', accent: '#658545' },
  ghost: { from: '#A894C4', to: '#7D5FA3', accent: '#644A85' },
  steel: { from: '#B0BAC4', to: '#8A97A3', accent: '#707B85' },
};

const DEFAULT_COLOR: TypeColor = {
  from: '#C4BFB5',
  to: '#A39D8F',
  accent: '#8A8477',
};

export function getTypeColor(typeName: string): TypeColor {
  return TYPE_COLORS[typeName] ?? DEFAULT_COLOR;
}
