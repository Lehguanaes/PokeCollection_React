// Definição do que vamos requisitar da API do Pokémon
export interface Poder {
    nome: string;
    forca: number;
}

export interface Pokemon {
    index: string;
    nome: string;
    imagem: string;
    tipos: string[];
    poderes: Poder[];
}