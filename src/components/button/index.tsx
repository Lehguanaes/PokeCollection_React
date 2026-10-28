/*
 * Implementa o botão reutilizável da interface do projeto.
 * É usado em telas, alertas, cartões e modais de detalhes.
 * Aplica variantes, tamanhos, acessibilidade e estados de interação e carregamento.
 */
import React, { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { styles } from './styles';

// As uniões limitam as opções às combinações visuais realmente implementadas.
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium';

/**
 * Contrato do botão reutilizável. Ele herda eventos e atributos do Pressable,
 * mas controla o próprio conteúdo para manter texto, ícone e loading coerentes.
 */
type Props = Omit<PressableProps, 'children'> & {
  // Texto visível e também rótulo acessível padrão.
  title: string;
  // Define a intenção visual; `primary` é usada quando nenhuma opção é passada.
  variant?: ButtonVariant;
  // Alterna dimensões e tipografia sem exigir estilos externos.
  size?: ButtonSize;
  // Mostra progresso e impede novos acionamentos enquanto uma ação está em curso.
  loading?: boolean;
  // Elemento opcional exibido antes do título quando o botão não está carregando.
  icon?: ReactNode;
  // Permite que botões pequenos ocupem apenas o espaço necessário.
  fullWidth?: boolean;
  // Permite ajustes tipográficos locais sem alterar as variantes compartilhadas.
  textStyle?: StyleProp<TextStyle>;
};

// Mapas centralizam a correspondência entre uma variante semântica e sua
// aparência, evitando condicionais repetidas dentro da árvore de renderização.
const variantStyles = {
  primary: styles.primary,
  secondary: styles.secondary,
  danger: styles.danger,
} satisfies Record<ButtonVariant, object>;

const textVariantStyles = {
  primary: styles.primaryText,
  secondary: styles.secondaryText,
  danger: styles.dangerText,
} satisfies Record<ButtonVariant, object>;

// O indicador precisa contrastar com o fundo específico de cada variante.
const loadingColors = {
  primary: Colors.white,
  secondary: Colors.label,
  danger: Colors.title,
} satisfies Record<ButtonVariant, string>;

/** Botão com variantes, feedback de interação, loading e acessibilidade. */
export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = true,
  textStyle,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityState,
  onHoverIn,
  onHoverOut,
  ...rest
}: Props) {
  // Hover existe apenas na web. Pressed, por outro lado, é fornecido pelo
  // Pressable em todas as plataformas e é tratado na composição de estilos.
  const [hovered, setHovered] = useState(false);
  // Loading também desabilita o botão para impedir ações duplicadas.
  const isDisabled = Boolean(disabled || loading);
  // Pressable aceita estilo estático ou função; esta adaptação preserva ambas
  // as formas quando o consumidor acrescenta seu próprio estilo.
  const resolveStyle = (state: PressableStateCallbackType) =>
    typeof style === 'function' ? style(state) : style;

  return (
    <Pressable
      // As props restantes são aplicadas primeiro, e as decisões do componente
      // abaixo garantem que estado, acessibilidade e interação sejam coerentes.
      {...rest}
      disabled={isDisabled}
      accessibilityRole={rest.accessibilityRole ?? 'button'}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{
        ...accessibilityState,
        disabled: isDisabled,
        busy: loading,
      }}
      onHoverIn={
        // Eventos de ponteiro específicos de hover só são conectados na web.
        Platform.OS === 'web'
          ? (event) => {
              setHovered(true);
              onHoverIn?.(event);
            }
          : undefined
      }
      onHoverOut={
        Platform.OS === 'web'
          ? (event) => {
              setHovered(false);
              onHoverOut?.(event);
            }
          : undefined
      }
      style={(state: PressableStateCallbackType) => [
        // A ordem permite que tamanho, interação, desabilitado e estilo externo
        // complementem ou sobrescrevam as bases conforme a API do React Native.
        styles.button,
        variantStyles[variant],
        size === 'small' ? styles.small : styles.medium,
        fullWidth && styles.fullWidth,
        hovered && !isDisabled && styles.hovered,
        state.pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        resolveStyle(state),
      ]}
    >
      {/* Ícone/indicador e título compartilham uma linha centralizada. */}
      <View style={styles.content}>
        {loading ? (
          // O indicador é decorativo para leitores de tela, pois o estado `busy`
          // do próprio botão já comunica que a ação está em andamento.
          <ActivityIndicator
            size="small"
            color={loadingColors[variant]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        ) : (
          icon
        )}
        <Text
          style={[
            styles.text,
            textVariantStyles[variant],
            size === 'small' && styles.smallText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
