/*
 * Expõe a fachada pública do módulo de cartão de Pokémon.
 * É importada pelas telas de Pokédex, catálogo e time.
 * Delega a plataforma ao bundler e reexporta o contrato comum.
 */
// Fachada estável do módulo: o bundler resolve Card(.ios/.android/.web) sem afetar consumidores.
export { Card } from './Card';
// Reexporta o contrato comum para que todas as plataformas exponham a mesma API tipada.
export * from './types';
