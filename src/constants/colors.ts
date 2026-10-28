/*
 * Mantém o catálogo central de cores e paletas do projeto.
 * É importado por componentes, estilos e telas web e nativas.
 * Oferece tokens semânticos e funções para derivar cores.
 */
/**
 * Fonte única de cores da aplicação.
 *
 * Os grupos separam papéis visuais, escalas reutilizáveis, transparências e paletas
 * de domínio. Consumidores devem escolher o papel semântico adequado em vez de repetir
 * literais, garantindo consistência entre componentes web e nativos.
 */
export const Colors = {
    // Base global e identidade principal usadas por superfícies, textos e elementos de marca.
    transparent: 'transparent',
    background: '#ecf4f2',

    primary: '#66cdaa',
    secondary: '#8ed8c3',

    title: '#E53935',
    subtitle: '#7fbfaf',

    label: '#5fa895',
    placeholder: '#5fa895',

    text: '#333',
    white: '#fff',

    inputBackground: '#f2fffb',
    inputBorder: '#c7e9df',

    pokeballRed: '#f83e3e',
    black: '#111',

    details: '#feee3d',
    imageBackground: '#F4F4F4',

    // Contrastes explícitos para conteúdo sobre ações ou superfícies de maior destaque.
    labelPrimary: '#FFFFFF',
    txtPrimary: '#121214',

    // Cores semânticas comunicam intenção; componentes não precisam conhecer os hexadecimais.
    semantic: {
        // Estados de feedback mantêm fundo suave, borda enfática e texto legível da mesma família.
        error: {
            bg: '#FFEBEE',
            border: '#B71C1C',
            text: '#B71C1C',
            softBorder: '#F4B4B2',
        },
        success: {
            bg: '#E8F5E9',
            border: '#1B5E20',
            text: '#1B5E20'
        },
        warning: {
            bg: '#FFF8E1',
            border: '#FF8F00',
            text: '#FF8F00'
        },
        info: {
            bg: '#E3F2FD',
            border: '#2196F3',
            text: '#0D47A1'
        },
        // Neutros semânticos cobrem superfícies, divisórias e diferentes níveis de hierarquia textual.
        muted: {
            background: '#F1F5F9',
            surface: '#F8FAFC',
            border: '#E2E8F0',
            text: '#64748B',
            subtleText: '#94A3B8',
            strongText: '#334155',
            heading: '#172033',
        },
        // Variantes de ação definem o trio fundo/borda/texto consumido por botões e decisões.
        action: {
            primary: {
                background: '#E53935',
                border: '#E53935',
                text: '#FFFFFF',
            },
            secondary: {
                background: '#FFFFFF',
                border: '#CBD5E1',
                text: '#334155',
            },
            danger: {
                background: '#FFF1F2',
                border: '#FDA4AF',
                text: '#BE123C',
            },
        },
        // Alertas com ações usam uma paleta própria para não sugerir sucesso ou erro antes da decisão.
        alert: {
            action: {
                bg: '#E9FFF7',
                border: '#66cdaa',
                text: '#1F4F43',
            },
        }
    },

    // Escala cinza curta para elementos neutros que não exigem toda a gradação slate.
    gray: {
        100: '#F2F2F2',
        500: '#999999',
        800: '#333333',
    },

    // Escala slate oferece progressão consistente de superfícies claras até textos e títulos escuros.
    slate: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        700: '#334155',
        800: '#1E293B',
        900: '#172033',
    },

    // Neutros absolutos e cinza de apoio usados quando a cor não deve carregar significado.
    neutral: {
        black: '#000000',
        white: '#FFFFFF',
        softGray: '#ECECEC',
    },

    // Transparências nomeadas evitam recompor RGBA e documentam a intensidade esperada de overlays e sombras.
    alpha: {
        transparentWhite: 'rgba(255,255,255,0)',
        white72: 'rgba(255,255,255,0.72)',
        white88: 'rgba(255, 255, 255, .88)',
        white94: 'rgba(255, 255, 255, 0.94)',
        white95: 'rgba(255, 255, 255, .95)',
        black04: 'rgba(0,0,0,0.04)',
        black10: 'rgba(0,0,0,0.10)',
        black16: 'rgba(0,0,0,0.16)',
        black20: 'rgba(0, 0, 0, 0.2)',
        black25: 'rgba(0, 0, 0, .25)',
        black28: 'rgba(0, 0, 0, .28)',
        black50: 'rgba(0, 0, 0, 0.5)',
        black55: 'rgba(17, 17, 17, 0.55)',
        slate72: 'rgba(15, 23, 42, 0.72)',
        night66: 'rgba(4, 12, 18, 0.66)',
        primary12: 'rgba(102,205,170,0.12)',
        primary28: 'rgba(102,205,170,0.28)',
        gold55: 'rgba(255, 200, 0, 0.55)',
    },

    // Superfícies específicas nomeiam contextos que não pertencem a um estado semântico geral.
    surface: {
        captureNotice: '#FFFDF7',
    },

    // Paleta do mapa distingue terreno, textos auxiliares, posição atual e estados vazios.
    map: {
        background: '#F7FAF9',
        mutedText: '#5f756f',
        subduedText: '#526a63',
        currentPosition: '#2f80ed',
        locationBadge: '#EAF8F3',
        emptyIcon: '#FDECEC',
    },

    // Cores do efeito de revelação da captura formam flashes e brilhos de alta energia.
    captureReveal: {
        cyan: '#5DE2E7',
        yellow: '#FFE45C',
        flash: '#FDF59A',
    },

      // Cada tipo localizado possui fundo, destaque, badge e glow; as mesmas chaves alimentam cartões e detalhes.
      types: {
    fogo:     { bg: '#1a0a00', accent: '#FF6B35', badge: '#f08e49', glow: 'rgba(255,107,53,0.5)'   },
    água:     { bg: '#00091a', accent: '#4FC3F7', badge: '#7e9fea', glow: 'rgba(79,195,247,0.5)'   },
    grama:    { bg: '#001a00', accent: '#66BB6A', badge: '#9bdb78', glow: 'rgba(102,187,106,0.5)'  },
    elétrico: { bg: '#1a1400', accent: '#FFD600', badge: '#F8D030', glow: 'rgba(255,214,0,0.5)'    },
    psíquico: { bg: '#1a0010', accent: '#F06292', badge: '#F85888', glow: 'rgba(240,98,146,0.5)'   },
    gelo:     { bg: '#001218', accent: '#80DEEA', badge: '#98D8D8', glow: 'rgba(128,222,234,0.5)'  },
    dragão:   { bg: '#06001a', accent: '#7E57C2', badge: '#7038F8', glow: 'rgba(126,87,194,0.5)'   },
    trevas:   { bg: '#0d0d0d', accent: '#8D6E63', badge: '#705848', glow: 'rgba(141,110,99,0.5)'   },
    fada:     { bg: '#1a0018', accent: '#F48FB1', badge: '#EE99AC', glow: 'rgba(244,143,177,0.5)'  },
    lutador:  { bg: '#1a0500', accent: '#EF5350', badge: '#C03028', glow: 'rgba(239,83,80,0.5)'    },
    veneno:   { bg: '#0f001a', accent: '#AB47BC', badge: '#A040A0', glow: 'rgba(171,71,188,0.5)'   },
    terra:    { bg: '#1a1000', accent: '#D4A373', badge: '#E0C068', glow: 'rgba(212,163,115,0.5)'  },
    pedra:    { bg: '#141008', accent: '#BCAAA4', badge: '#B8A038', glow: 'rgba(188,170,164,0.5)'  },
    inseto:   { bg: '#0a1400', accent: '#AED581', badge: '#c9d461', glow: 'rgba(174,213,129,0.5)'  },
    fantasma: { bg: '#0a0014', accent: '#9575CD', badge: '#705898', glow: 'rgba(149,117,205,0.5)'  },
    aço:      { bg: '#0f0f14', accent: '#90A4AE', badge: '#B8B8D0', glow: 'rgba(144,164,174,0.5)'  },
    voador:   { bg: '#000d1a', accent: '#81D4FA', badge: '#A890F0', glow: 'rgba(129,212,250,0.5)'  },
    normal:   { bg: '#111111', accent: '#BDBDBD', badge: '#A8A878', glow: 'rgba(189,189,189,0.4)'  },
  } as Record<string, { bg: string; accent: string; badge: string; glow: string }>,
} as const;


/**
 * Resolve a paleta pelo primeiro tipo, tratado como tipo principal do Pokémon.
 * A reserva `normal` mantém todos os consumidores renderizáveis quando a lista está vazia
 * ou quando a API fornece uma tipagem ainda não mapeada.
 */
export function getColor(types: string[]): { bg: string; accent: string; glow: string } {
  const primary = types[0] ?? 'normal';
  return Colors.types[primary] ?? Colors.types['normal'];
}

/**
 * Converte uma cor hexadecimal curta ou completa em RGBA com a opacidade solicitada.
 * Valores que não são hexadecimais válidos retornam intactos, permitindo que o chamador
 * use outras representações de cor sem provocar uma conversão incorreta.
 */
export function withAlpha(color: string, alpha: number) {
  const value = color.replace('#', '');
  // Expande #RGB para #RRGGBB antes de separar os canais.
  const normalized = value.length === 3
    ? value.split('').map((character) => character + character).join('')
    : value;

  // A validação antecede parseInt para impedir que entradas parciais produzam canais inválidos.
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return color;

  // Cada par hexadecimal vira um canal decimal preservado na string RGBA final.
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
