/*
 * Declara o contrato compartilhado dos alertas do projeto.
 * É usado pelos adaptadores web e nativo e exportado pela fachada pública.
 * Tipifica conteúdo, visibilidade, intenção e ações disponíveis no alerta.
 */
/**
 * Contrato comum das apresentações web e nativa do alerta.
 * `type` seleciona a intenção semântica e `actions` transforma a notificação passiva
 * em uma decisão explícita, preservando rótulo, fluxo e variante de cada ação.
 */
export interface AlertProps {
    title: string;
    message: string;
    visible: boolean;
    onClose: () => void;
    type?: 'success' | 'error' | 'warning' | 'info';
    actions?: {
        label: string;
        onPress: () => void;
        variant?: 'primary' | 'secondary' | 'danger';
    }[];
}
