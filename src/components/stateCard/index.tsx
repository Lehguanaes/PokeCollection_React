/*
 * Padroniza a apresentação dos estados de uma região de conteúdo.
 * É reutilizado por Catálogo, Pokédex e Mapa em diferentes estados.
 * Mostra carregamento, mensagens, ícones e uma ação opcional de recuperação.
 */
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { Button } from '@/components/button';
import { Colors } from '@/constants/colors';

/**
 * Dados para representar loading, vazio, aviso ou erro no lugar do conteúdo.
 * Os elementos opcionais permitem que seus múltiplos consumidores reutilizem a
 * mesma estrutura em estados simples e completos, sem duplicar a apresentação.
 */
export type StateCardProps = {
  // Título opcional que resume o estado.
  title?: string;
  // Explicação principal, sempre obrigatória para que o estado seja compreensível.
  message: string;
  // A variante de erro troca o tratamento cromático do card.
  tone?: 'neutral' | 'error';
  // Substitui o ícone por um indicador de atividade.
  loading?: boolean;
  // Ilustração opcional para estados que não estão carregando.
  icon?: ReactNode;
  // Ação de recuperação opcional, como tentar novamente ou voltar.
  action?: {
    // Texto exibido dentro do botão.
    title: string;
    // Comportamento executado ao pressionar o botão.
    onPress: () => void;
    // Descrição alternativa quando o texto visível não for suficientemente claro.
    accessibilityLabel?: string;
  };
  // Extensão visual para adaptar posicionamento sem mudar a estrutura interna.
  style?: StyleProp<ViewStyle>;
};

/** Card reutilizável para loading, erro ou vazio de uma região de conteúdo. */
export function StateCard({
  title,
  message,
  tone = 'neutral',
  loading = false,
  icon,
  action,
  style,
}: StateCardProps) {
  return (
    // O estilo externo entra por último para permitir ajustes de contexto, enquanto
    // o tom de erro mantém a semântica visual padrão quando solicitado.
    <View style={[styles.card, tone === 'error' && styles.errorCard, style]}>
      {/* Loading tem prioridade sobre o ícone para não mostrar dois estados simultâneos. */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : icon ? (
        <View style={styles.icon}>{icon}</View>
      ) : null}

      {/* Espaçamentos condicionais evitam margens vazias quando blocos anteriores não existem. */}
      {title ? (
        <Text style={[styles.title, Boolean(icon) && styles.spacedTitle]}>{title}</Text>
      ) : null}
      <Text
        style={[
          styles.message,
          (loading || Boolean(icon) || Boolean(title)) && styles.spacedMessage,
        ]}
      >
        {message}
      </Text>

      {/* A ação aparece por último e usa tamanho compacto para não dominar a mensagem. */}
      {action ? (
        <Button
          title={action.title}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
          size="small"
          fullWidth={false}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // O card limita a largura para manter linhas legíveis em telas grandes e
  // centraliza seus elementos para uma leitura clara do estado global.
  card: {
    width: '100%',
    maxWidth: 560,
    alignItems: 'center',
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderRadius: 22,
    backgroundColor: Colors.white,
  },
  errorCard: {
    borderColor: Colors.semantic.error.border,
    backgroundColor: Colors.semantic.error.bg,
  },
  // Ícone, título e mensagem formam a hierarquia visual; estilos separados de
  // espaçamento permitem compor apenas as partes fornecidas nas props.
  icon: {
    alignItems: 'center',
  },
  title: {
    color: Colors.title,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  spacedTitle: {
    marginTop: 14,
  },
  message: {
    color: Colors.subtitle,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  spacedMessage: {
    marginTop: 8,
  },
  // Se presente, a ação é afastada da explicação para formar um bloco próprio.
  action: {
    marginTop: 16,
  },
});
