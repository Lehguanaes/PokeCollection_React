// Armazena constantes relacionadas a cores usadas na aplicação, como cores de fundo, texto, botões e outros elementos visuais.
export const Colors = {
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

    labelPrimary: '#FFFFFF',
    txtPrimary: '#121214',

    semantic: {
        error: {
            bg: '#FFEBEE',
            border: '#B71C1C',
            text: '#B71C1C'
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
        }
    },

    gray: {
        100: '#F2F2F2',
        500: '#999999',
        800: '#333333',
    },

      types: {
    fogo:     { bg: '#1a0a00', accent: '#FF6B35', glow: 'rgba(255,107,53,0.5)'   },
    água:     { bg: '#00091a', accent: '#4FC3F7', glow: 'rgba(79,195,247,0.5)'   },
    grama:    { bg: '#001a00', accent: '#66BB6A', glow: 'rgba(102,187,106,0.5)'  },
    elétrico: { bg: '#1a1400', accent: '#FFD600', glow: 'rgba(255,214,0,0.5)'    },
    psíquico: { bg: '#1a0010', accent: '#F06292', glow: 'rgba(240,98,146,0.5)'   },
    gelo:     { bg: '#001218', accent: '#80DEEA', glow: 'rgba(128,222,234,0.5)'  },
    dragão:   { bg: '#06001a', accent: '#7E57C2', glow: 'rgba(126,87,194,0.5)'   },
    trevas:   { bg: '#0d0d0d', accent: '#8D6E63', glow: 'rgba(141,110,99,0.5)'   },
    fada:     { bg: '#1a0018', accent: '#F48FB1', glow: 'rgba(244,143,177,0.5)'  },
    lutador:  { bg: '#1a0500', accent: '#EF5350', glow: 'rgba(239,83,80,0.5)'    },
    veneno:   { bg: '#0f001a', accent: '#AB47BC', glow: 'rgba(171,71,188,0.5)'   },
    terra:    { bg: '#1a1000', accent: '#D4A373', glow: 'rgba(212,163,115,0.5)'  },
    pedra:    { bg: '#141008', accent: '#BCAAA4', glow: 'rgba(188,170,164,0.5)'  },
    inseto:   { bg: '#0a1400', accent: '#AED581', glow: 'rgba(174,213,129,0.5)'  },
    fantasma: { bg: '#0a0014', accent: '#9575CD', glow: 'rgba(149,117,205,0.5)'  },
    aço:      { bg: '#0f0f14', accent: '#90A4AE', glow: 'rgba(144,164,174,0.5)'  },
    voador:   { bg: '#000d1a', accent: '#81D4FA', glow: 'rgba(129,212,250,0.5)'  },
    normal:   { bg: '#111111', accent: '#BDBDBD', glow: 'rgba(189,189,189,0.4)'  },
  } as Record<string, { bg: string; accent: string; glow: string }>,
} as const;


export function getColor(types: string[]): { bg: string; accent: string; glow: string } {
  const primary = types[0] ?? 'normal';
  return Colors.types[primary] ?? Colors.types['normal'];
}