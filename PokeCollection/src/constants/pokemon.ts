// Armazena constantes relacionadas a Pokémon, como nomes, ícones e cores relacionados a cada tipo.
export type PokemonType =
  | 'fogo' | 'água' | 'grama' | 'elétrico' | 'psíquico' | 'gelo'
  | 'dragão' | 'trevas' | 'fada' | 'lutador' | 'veneno' | 'terra'
  | 'pedra' | 'inseto' | 'fantasma' | 'aço' | 'voador' | 'normal';

export const TYPE_MAP: Record<string, string> = {
  fire: 'fogo',      water: 'água',     grass: 'grama',
  electric: 'elétrico', psychic: 'psíquico', ice: 'gelo',
  dragon: 'dragão',  dark: 'trevas',    fairy: 'fada',
  fighting: 'lutador', poison: 'veneno', ground: 'terra',
  rock: 'pedra',     bug: 'inseto',     ghost: 'fantasma',
  steel: 'aço',      flying: 'voador',  normal: 'normal',
};

export const TYPE_ICONS: Record<string, string> = {
  fogo: '🔥', água: '💧', grama: '🌿', elétrico: '⚡',
  psíquico: '🔮', gelo: '❄️', dragão: '🐉', trevas: '🌑',
  fada: '✨', lutador: '🥊', veneno: '☠️', terra: '🪨',
  pedra: '💎', inseto: '🐛', fantasma: '👻', aço: '⚙️',
  voador: '🌬️', normal: '⭐',
};

export const TYPE_COLORS: Record<string, string> = {
  fogo: '#f08e49',
  água: '#7e9fea',
  grama: '#9bdb78',
  elétrico: '#F8D030',
  psíquico: '#F85888',
  gelo: '#98D8D8',

  dragão: '#7038F8',
  trevas: '#705848',
  fada: '#EE99AC',

  lutador: '#C03028',
  veneno: '#A040A0',
  terra: '#E0C068',

  pedra: '#B8A038',
  inseto: '#c9d461',
  fantasma: '#705898',

  aço: '#B8B8D0',
  voador: '#A890F0',
  normal: '#A8A878',
};