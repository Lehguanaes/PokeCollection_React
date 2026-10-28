/*
 * Adapta os alertas do projeto para plataformas nativas.
 * É selecionado pela fachada usada nas telas de login, Pokédex e equipe.
 * Converte as propriedades declarativas em um diálogo do sistema operacional.
 */
import { useEffect, useRef, type FC } from 'react';
import { Alert as NativeAlert, Platform } from 'react-native';

import { AlertProps } from './types';

const AlertNative: FC<AlertProps> = ({
  title,
  message,
  visible,
  onClose,
  type = 'info',
  actions,
}) => {
  // A ref impede que novas renderizações abram múltiplos diálogos do sistema para a mesma visibilidade.
  const isShowing = useRef(false);

  // No nativo, o componente apenas sincroniza props declarativas com a API imperativa NativeAlert.
  useEffect(() => {
    if (!visible) {
      isShowing.current = false;
      return;
    }
    if (isShowing.current) return;
    isShowing.current = true;

    NativeAlert.alert(
      title,
      message,
      actions?.length
        // Converte as variantes da aplicação nos estilos limitados oferecidos pelo diálogo do sistema.
        ? actions.map((action) => ({
            text: action.label,
            onPress: action.onPress,
            style:
              action.variant === 'danger'
                ? 'destructive'
                : action.variant === 'secondary'
                  ? 'cancel'
                  : 'default',
          }))
        : [
            // Sem ações customizadas, fornece fechamento padrão e comunica erro como ação destrutiva.
            {
              text: 'OK',
              onPress: onClose,
              style: type === 'error' ? 'destructive' : 'default',
            },
          ],
      // iOS não deve dispensar o alerta fora dos botões; Android mantém a configuração padrão da API.
      Platform.OS === 'ios' ? { cancelable: false } : undefined
    );
  }, [actions, message, onClose, title, type, visible]);

  // A interface é desenhada pelo sistema operacional, portanto não há árvore visual React a renderizar.
  return null;
};

export default AlertNative;
