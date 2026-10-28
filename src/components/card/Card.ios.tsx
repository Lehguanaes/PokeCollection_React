/*
 * Atua como adaptador de plataforma do cartão para iOS.
 * É escolhido automaticamente ao importar a fachada Card.
 * Reexporta a composição nativa mantida na implementação Android.
 */
// iOS compartilha a composição nativa com Android; o arquivo existe para a resolução automática por plataforma.
export { Card } from './Card.android';
