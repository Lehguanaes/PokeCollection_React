/*
 * Este arquivo define os contratos da coleção, captura e equipe.
 * Seus tipos são consumidos pelo contexto e pela persistência local.
 * Ele padroniza localizações, resultados e o limite de integrantes do time.
 */
import { Pokemon } from '@/@types/pokemon';

// Centraliza o limite do time para que validação, normalização e interface usem
// a mesma regra de seis integrantes das batalhas Pokémon.
export const MAX_TEAM_SIZE = 6;

// Fotografia das coordenadas no instante da captura. A precisão pode ser nula
// quando o provedor de localização não consegue estimá-la, e o timestamp mantém
// o instante original da leitura independentemente da data de persistência.
export type CaptureLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

// Estende o catálogo da PokeAPI com os metadados pertencentes ao treinador.
// `capturedAt` é obrigatório para ordenar/exibir o evento; a localização é
// opcional porque permissões ou disponibilidade do dispositivo podem impedi-la.
export type CapturedPokemon = Pokemon & {
  capturedAt: string;
  location?: CaptureLocation;
};

// Documento persistido por usuário. As capturas guardam os dados completos,
// enquanto o time armazena somente ids para evitar duplicação e manter sua ordem.
export type PokemonCollection = {
  captures: CapturedPokemon[];
  teamIds: string[];
};

// Resultado explícito da captura permite à tela distinguir criação de uma
// tentativa repetida sem depender de exceções para um caso esperado.
export type CaptureResult = 'created' | 'duplicate';

// Enumera todos os desfechos esperados ao montar o time, permitindo que a UI
// apresente mensagens específicas para sucesso, repetição, lotação ou ausência.
export type AddToTeamResult =
  | 'added'
  | 'duplicate'
  | 'full'
  | 'not-captured';
