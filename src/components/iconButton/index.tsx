/*
 * Oferece uma ação circular compacta baseada somente em ícone.
 * É importado pelas telas de Pokédex e equipe.
 * Renderiza um ícone acessível com tons, bloqueio e feedback de pressão.
 */
import { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

/**
 * Propriedades de uma ação circular compacta baseada somente em ícone.
 * Permanece separado do Button textual porque seu rótulo acessível é obrigatório
 * e sua composição circular de 38x38 atende especificamente ações sem texto.
 */
interface IconButtonProps {
  // Nome obrigatório da ação anunciado por tecnologias assistivas.
  accessibilityLabel: string;
  // Conteúdo visual central, normalmente um ícone.
  icon: ReactNode;
  // Função executada quando a ação é acionada.
  onPress: () => void;
  // Ajusta a borda para comunicar uma ação normal ou destrutiva.
  tone?: 'primary' | 'danger';
  // Bloqueia a interação e aplica a aparência indisponível.
  disabled?: boolean;
}

/** Renderiza uma ação de ícone pequena, acessível e com feedback de pressão. */
export function IconButton({
  accessibilityLabel,
  icon,
  onPress,
  tone = 'primary',
  disabled = false,
}: IconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        // Os estilos de estado são compostos sobre a base; o feedback de pressão
        // não é aplicado quando desabilitado para não sugerir uma ação possível.
        styles.button,
        tone === 'danger' && styles.danger,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      {/* O chamador escolhe o símbolo, enquanto este componente cuida da área de toque. */}
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Forma circular e centralização criam uma área de ação compacta e consistente.
  button: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  // As variações abaixo comunicam intenção e estado sem alterar as dimensões,
  // evitando que o conteúdo ao redor se mova durante uma interação.
  danger: {
    borderColor: Colors.semantic.error.softBorder,
  },
  disabled: {
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.gray[100],
  },
  pressed: {
    opacity: 0.75,
  },
});
