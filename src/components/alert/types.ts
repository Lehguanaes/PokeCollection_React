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
