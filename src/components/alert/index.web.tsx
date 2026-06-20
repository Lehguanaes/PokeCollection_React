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
import { AlertProps } from './types';

const AlertWeb: React.FC<AlertProps> = ({
  title,
  message,
  visible,
  onClose,
  type = 'info',
  actions,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const hasActions = Boolean(actions?.length);

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

  const currentColors = hasActions
    ? {
        bg: '#E9FFF7',
        border: Colors.primary,
        text: '#1F4F43',
      }
    : semanticColors[type];

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.overlay}>
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
            <Text style={[styles.title, { color: currentColors.text }]}>
              {title}
            </Text>
            <Text style={[styles.message, { color: currentColors.text }]}>
              {message}
            </Text>

            {hasActions && (
              <View style={styles.actions}>
                {actions?.map((action) => (
                  <TouchableOpacity
                    key={action.label}
                    onPress={action.onPress}
                    style={[
                      styles.actionButton,
                      action.variant === 'primary' && styles.primaryAction,
                      action.variant === 'danger' && styles.dangerAction,
                      (!action.variant || action.variant === 'secondary') &&
                        styles.secondaryAction,
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        action.variant === 'primary' && styles.primaryText,
                        action.variant === 'danger' && styles.dangerText,
                        (!action.variant || action.variant === 'secondary') &&
                          styles.secondaryText,
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
      },
      default: {
        elevation: 8,
      },
    }),
  },
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    minWidth: 104,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 2,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderColor: Colors.inputBorder,
  },
  dangerAction: {
    backgroundColor: Colors.semantic.error.border,
    borderColor: Colors.semantic.error.border,
  },
  actionText: {
    fontWeight: '900',
    fontSize: 14,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.gray[800],
  },
  dangerText: {
    color: Colors.white,
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
