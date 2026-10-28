/*
 * Mantém os tipos, traduções e metadados visuais de Pokémon.
 * É importado por cartões, detalhes e telas do catálogo.
 * Localiza dados da API e deriva ícones, cores e abreviações.
 */
import { Colors } from '@/constants/colors';

/** União dos tipos já localizados que formam o vocabulário visual da aplicação. */
export type PokemonType =
  | 'fogo' | 'água' | 'grama' | 'elétrico' | 'psíquico' | 'gelo'
  | 'dragão' | 'trevas' | 'fada' | 'lutador' | 'veneno' | 'terra'
  | 'pedra' | 'inseto' | 'fantasma' | 'aço' | 'voador' | 'normal';

/**
 * Traduz os identificadores ingleses da API para as chaves portuguesas usadas na UI.
 * O mapeamento desacopla o formato externo dos rótulos, ícones e paletas apresentados ao usuário.
 */
export const TYPE_MAP: Record<string, string> = {
  fire: 'fogo',      water: 'água',     grass: 'grama',
  electric: 'elétrico', psychic: 'psíquico', ice: 'gelo',
  dragon: 'dragão',  dark: 'trevas',    fairy: 'fada',
  fighting: 'lutador', poison: 'veneno', ground: 'terra',
  rock: 'pedra',     bug: 'inseto',     ghost: 'fantasma',
  steel: 'aço',      flying: 'voador',  normal: 'normal',
};

/** Associa cada tipo localizado a um símbolo curto usado em badges e resumos visuais. */
export const TYPE_ICONS: Record<string, string> = {
  fogo: '🔥', água: '💧', grama: '🌿', elétrico: '⚡',
  psíquico: '🔮', gelo: '❄️', dragão: '🐉', trevas: '🌑',
  fada: '✨', lutador: '🥊', veneno: '☠️', terra: '🪨',
  pedra: '💎', inseto: '🐛', fantasma: '👻', aço: '⚙️',
  voador: '🌬️', normal: '⭐',
};

/** Converte chaves de atributos da API em abreviações compactas e consistentes nos cartões. */
export const STAT_ABBR: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.A',
  'special-defense': 'SP.D',
  speed: 'SPD',
};

/**
 * Deriva as cores de badges diretamente de `Colors.types`, evitando uma segunda tabela
 * que poderia divergir da paleta principal. O cast descreve o resultado do `fromEntries`
 * para consumidores que consultam dinamicamente pelo nome do tipo.
 */
export const TYPE_COLORS = Object.fromEntries(
  Object.entries(Colors.types).map(([type, palette]) => [type, palette.badge])
) as Record<string, string>;

/**
 * Dicionário de localização das habilidades retornadas pela API.
 * As chaves preservam os slugs externos para consulta direta; os valores são nomes naturais
 * em português. Habilidades ausentes neste mapa continuam sendo humanizadas pelo componente.
 */
export const ABILITY_MAP: Record<string, string> = {
  adaptability: 'adaptabilidade',
  aftermath: 'consequência',
  'air-lock': 'bloqueio de ar',
  'anger-point': 'ponto de ira',
  anticipation: 'antecipação',
  'arena-trap': 'armadilha de arena',
  'battle-armor': 'armadura de batalha',
  'bad-dreams': 'pesadelos',
  blaze: 'chama',
  chlorophyll: 'clorofila',
  'clear-body': 'corpo puro',
  'cloud-nine': 'nona nuvem',
  'color-change': 'mudança de cor',
  'compound-eyes': 'olhos compostos',
  'cute-charm': 'charme fofo',
  damp: 'umidade',
  download: 'download',
  drizzle: 'chuvisco',
  'dry-skin': 'pele seca',
  drought: 'seca',
  'early-bird': 'madrugador',
  'effect-spore': 'esporo de efeito',
  'flame-body': 'corpo em chamas',
  'flash-fire': 'fogo relâmpago',
  forecast: 'previsão',
  filter: 'filtro',
  'flower-gift': 'presente floral',
  forewarn: 'premonição',
  frisk: 'inspeção',
  gluttony: 'gula',
  guts: 'coragem',
  'huge-power': 'poder imenso',
  hustle: 'agitação',
  hydration: 'hidratação',
  'honey-gather': 'coleta de mel',
  'hyper-cutter': 'cortador poderoso',
  illuminate: 'iluminação',
  immunity: 'imunidade',
  intimidate: 'intimidação',
  'inner-focus': 'foco interior',
  insomnia: 'insônia',
  'iron-fist': 'punho de ferro',
  'ice-body': 'corpo de gelo',
  'keen-eye': 'olhar aguçado',
  levitate: 'levitação',
  'leaf-guard': 'guarda de folhas',
  limber: 'flexibilidade',
  'lightning-rod': 'para-raios',
  'liquid-ooze': 'lodo líquido',
  'magma-armor': 'armadura de magma',
  'magnet-pull': 'atração magnética',
  'marvel-scale': 'escama maravilhosa',
  'magic-guard': 'guarda mágica',
  'mold-breaker': 'quebra-molde',
  multitype: 'multitipo',
  minus: 'menos',
  'natural-cure': 'cura natural',
  'no-guard': 'sem guarda',
  normalize: 'normalização',
  oblivious: 'distração',
  overgrow: 'crescimento excessivo',
  'own-tempo': 'ritmo próprio',
  pickup: 'coleta',
  plus: 'mais',
  'poison-point': 'ponto venenoso',
  pressure: 'pressão',
  'pure-power': 'poder puro',
  'quick-feet': 'pés rápidos',
  'rain-dish': 'prato de chuva',
  reckless: 'imprudência',
  'rock-head': 'cabeça de pedra',
  'rough-skin': 'pele áspera',
  'run-away': 'fuga',
  'sand-stream': 'corrente de areia',
  'sand-veil': 'véu de areia',
  scrappy: 'briguento',
  'serene-grace': 'graça serena',
  'shadow-tag': 'marca sombria',
  'shed-skin': 'troca de pele',
  'shell-armor': 'armadura de concha',
  'shield-dust': 'escudo de pó',
  'skill-link': 'elo de habilidade',
  'slow-start': 'início lento',
  sniper: 'atirador',
  'snow-cloak': 'manto de neve',
  'snow-warning': 'alerta de neve',
  'solar-power': 'poder solar',
  'solid-rock': 'rocha sólida',
  soundproof: 'isolamento acústico',
  'speed-boost': 'impulso de velocidade',
  stall: 'atraso',
  static: 'estática',
  stench: 'fedor',
  'sticky-hold': 'aderência',
  'storm-drain': 'dreno de tempestade',
  sturdy: 'robustez',
  'suction-cups': 'ventosas',
  'super-luck': 'super sorte',
  swarm: 'enxame',
  'swift-swim': 'nado veloz',
  synchronize: 'sincronia',
  'tangled-feet': 'pés emaranhados',
  technician: 'técnico',
  'thick-fat': 'gordura espessa',
  torrent: 'torrente',
  trace: 'rastreamento',
  truant: 'preguiça',
  'tinted-lens': 'lente colorida',
  unaware: 'desatenção',
  unburden: 'desembaraço',
  'vital-spirit': 'espírito vital',
  'volt-absorb': 'absorção de eletricidade',
  'water-absorb': 'absorção de água',
  'water-veil': 'véu de água',
  'white-smoke': 'fumaça branca',
  'wonder-guard': 'guarda misteriosa',
};
