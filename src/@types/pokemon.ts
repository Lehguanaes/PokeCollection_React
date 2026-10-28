/*
 * Este arquivo define o modelo interno de um Pokémon e seus poderes.
 * Seus tipos são consumidos pelas integrações, contextos e telas do aplicativo.
 * Ele padroniza os dados usados no catálogo, nos detalhes e nas capturas.
 */
// Representa um atributo de batalha já traduzido do formato da PokeAPI para o
// formato consumido pelos componentes. `nome` identifica o atributo e `forca`
// preserva o valor-base numérico retornado pelo serviço externo.
export interface Poder {
    nome: string;
    forca: number;
}

// Modelo canônico de um Pokémon dentro do aplicativo. Os campos obrigatórios
// são suficientes para listagem e detalhes básicos; medidas e habilidades são
// opcionais porque dados persistidos antigos podem não conter essas informações.
export interface Pokemon {
    index: string;
    nome: string;
    imagem: string;
    tipos: string[];
    poderes: Poder[];
    altura?: number;
    peso?: number;
    habilidades?: string[];
}
