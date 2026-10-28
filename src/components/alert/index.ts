/*
 * Define a fachada pública do componente de alerta.
 * É importada pelas telas de login, Pokédex e equipe.
 * Expõe a implementação resolvida por plataforma e seus tipos compartilhados.
 */
// Fachada pública: mantém imports estáveis enquanto o bundler escolhe Alert.web ou Alert.native.
export { default as Alert } from './Alert';
// O contrato é compartilhado para que consumidores não dependam da implementação da plataforma.
export * from './types';
