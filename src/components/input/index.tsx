/*
 * Implementa o campo de texto reutilizável dos formulários.
 * É usado principalmente nas telas do fluxo de autenticação.
 * Combina rótulo fixo, entrada nativa e contorno animável.
 */
import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, Animated, Pressable } from "react-native";
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { styles } from "./styles";

/**
 * Propriedades do campo com rótulo. Todas as opções nativas de TextInput são
 * aceitas, além de uma animação opcional aplicada ao contorno externo.
 */
type Props = TextInputProps & {
  // Texto que identifica claramente o dado esperado no campo.
  label: string;
  // Estilo animado externo, útil para feedback de foco ou validação sem animar o texto.
  animatedStyle?: any;
};

/** Agrupa rótulo e entrada em uma unidade visual reutilizável de formulário. */
export function Input({ label, animatedStyle, secureTextEntry, ...rest }: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <View style={styles.container}>
      {/* O rótulo permanece visível mesmo quando há placeholder ou valor digitado. */}
      <Text style={styles.label}>{label}</Text>

      {/* A animação fica no wrapper para incluir fundo e borda; as propriedades
          restantes são encaminhadas ao TextInput sem limitar sua API nativa. */}
      <Animated.View style={[styles.inputWrapper, animatedStyle]}>
        <TextInput
          {...rest}
          style={[styles.input, secureTextEntry && styles.passwordInput, rest.style]}
          secureTextEntry={Boolean(secureTextEntry) && !passwordVisible}
        />
        {secureTextEntry && (
          <Pressable
            style={styles.visibilityButton}
            onPress={() => setPasswordVisible((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {passwordVisible
              ? <EyeOff size={20} color={Colors.label} />
              : <Eye size={20} color={Colors.label} />}
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}
