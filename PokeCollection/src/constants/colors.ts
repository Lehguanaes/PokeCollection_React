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
        normal:   { bg: '#A8A878', accent: '#A8A878', glow: '#A8A87888' },
        fire:     { bg: '#F08030', accent: '#F08030', glow: '#F0803088' },
        water:    { bg: '#6890F0', accent: '#6890F0', glow: '#6890F088' },
        electric: { bg: '#F8D030', accent: '#F8D030', glow: '#F8D03088' },
        grass:    { bg: '#78C850', accent: '#78C850', glow: '#78C85088' },
        ice:      { bg: '#98D8D8', accent: '#98D8D8', glow: '#98D8D888' },
        fighting: { bg: '#C03028', accent: '#C03028', glow: '#C0302888' },
        poison:   { bg: '#A040A0', accent: '#A040A0', glow: '#A040A088' },
        ground:   { bg: '#E0C068', accent: '#E0C068', glow: '#E0C06888' },
        flying:   { bg: '#A890F0', accent: '#A890F0', glow: '#A890F088' },
        psychic:  { bg: '#F85888', accent: '#F85888', glow: '#F8588888' },
        bug:      { bg: '#A8B820', accent: '#A8B820', glow: '#A8B82088' },
        rock:     { bg: '#B8A038', accent: '#B8A038', glow: '#B8A03888' },
        ghost:    { bg: '#705898', accent: '#705898', glow: '#70589888' },
        dragon:   { bg: '#7038F8', accent: '#7038F8', glow: '#7038F888' },
        dark:     { bg: '#705848', accent: '#705848', glow: '#70584888' },
        steel:    { bg: '#B8B8D0', accent: '#B8B8D0', glow: '#B8B8D088' },
        fairy:    { bg: '#EE99AC', accent: '#EE99AC', glow: '#EE99AC88' },
    },
} as const;

export function getColor(types: string[]): { bg: string; accent: string; glow: string } {
    const primary = types[0] ?? 'normal';
    return (Colors.types as Record<string, { bg: string; accent: string; glow: string }>)[primary]
        ?? Colors.types['normal'];
}