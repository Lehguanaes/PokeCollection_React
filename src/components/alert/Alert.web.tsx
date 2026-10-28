/*
 * Implementa a apresentação web dos alertas do projeto.
 * É selecionado pela fachada usada nas telas de login, Pokédex e equipe.
 * Exibe um modal animado com cores semânticas, ações e fechamento automático.
 */
import React, { useEffect } from 'react';
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/button';
import { AlertProps } from './types';

const AlertWeb: React.FC<AlertProps> = ({
  title,
  message,
  visible,
  onClose,
  type = 'info',
  actions,
}) => {
  // O valor animado persiste entre renders e controla exclusivamente a entrada por opacidade.
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  // Ações mudam tanto a interação quanto a paleta e impedem o fechamento automático.
  const hasActions = Boolean(actions?.length);

  // Ao abrir, faz fade-in e agenda encerramento apenas para notificações que não exigem decisão.
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (hasActions) return;

      const timer = setTimeout(onClose, 6000);
      return () => clearTimeout(timer);
    }

    fadeAnim.setValue(0);
  }, [visible, fadeAnim, onClose, hasActions]);

  // Relaciona cada intenção do contrato às cores semânticas centralizadas em Colors.
  const semanticColors = {
    error: {
      bg: Colors.semantic.error.bg,
      border: Colors.semantic.error.border,
      text: Colors.semantic.error.text,
    },
    success: {
      bg: Colors.semantic.success.bg,
      border: Colors.semantic.success.border,
      text: Colors.semantic.success.text,
    },
    warning: {
      bg: Colors.semantic.warning.bg,
      border: Colors.semantic.warning.border,
      text: Colors.semantic.warning.text,
    },
    info: {
      bg: Colors.semantic.info.bg,
      border: Colors.semantic.info.border,
      text: Colors.semantic.info.text,
    },
  };

  // Alertas acionáveis usam uma aparência neutra própria; os demais refletem success/error/warning/info.
  const currentColors = hasActions
    ? Colors.semantic.alert.action
    : semanticColors[type];

  return (
    // A web precisa de modal próprio para controlar layout, animação e botões; o nativo usa o diálogo do SO.
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.overlay}>
        {/* Painel: a borda lateral e o texto compartilham a intenção semântica selecionada. */}
        <Animated.View
          style={[
            styles.alertContainer,
            {
              opacity: fadeAnim,
              backgroundColor: currentColors.bg,
              borderLeftColor: currentColors.border,
            },
          ]}
        >
          <View style={styles.content}>
            {/* Conteúdo textual e conjunto opcional de decisões fornecidas pelo chamador. */}
            <Text style={[styles.title, { color: currentColors.text }]}>
              {title}
            </Text>
            <Text style={[styles.message, { color: currentColors.text }]}>
              {message}
            </Text>

            {hasActions && (
              <View style={styles.actions}>
                {actions?.map((action) => (
                  <Button
                    key={action.label}
                    title={action.label}
                    onPress={action.onPress}
                    variant={action.variant ?? 'secondary'}
                    size="small"
                    fullWidth={false}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Notificações passivas oferecem fechamento manual; alertas acionáveis reservam a área aos botões. */}
          {!hasActions && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: currentColors.text }]}>
                X
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Camada modal: escurece a tela e centraliza o alerta com margem segura.
  overlay: {
    flex: 1,
    backgroundColor: Colors.alpha.black50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Painel do alerta: estrutura horizontal e sombra resolvida segundo os recursos de cada plataforma.
  alertContainer: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 6,
    ...Platform.select({
      web: {
        boxShadow: `0px 8px 24px ${Colors.alpha.black20}`,
      },
      default: {
        elevation: 8,
      },
    }),
  },
  // Tipografia e conteúdo: reservam espaço para o fechamento lateral sem comprometer a mensagem.
  content: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
  },
  // Interações: ações ficam alinhadas ao fim e o controle de fechar mantém uma área própria de toque.
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AlertWeb;
