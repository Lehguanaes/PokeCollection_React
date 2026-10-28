/*
 * Atua como adaptador padrão do cartão para resolução sem plataforma.
 * É importado pela fachada pública do módulo Card.
 * Encaminha a exportação para a implementação destinada à web.
 */
// Entrada padrão usada pelo bundler quando não há sufixo mais específico; aponta para a experiência web.
export { Card } from './Card.web';
