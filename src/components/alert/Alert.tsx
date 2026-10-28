/*
 * Serve como entrada padrão para a implementação de alerta.
 * É alcançado pela fachada importada nas telas que exibem notificações.
 * Encaminha a resolução sem sufixo para o componente visual da web.
 */
// Entrada sem sufixo usada como fallback; na web, renderiza o modal visual controlado pela aplicação.
export { default } from './Alert.web';
