/*
 * Fornece o cabeçalho textual reutilizável das telas internas.
 * É usado em Pokédex, catálogo, time, mapa, câmera e perfil.
 * Combina título, subtítulo e ícone com variações responsivas.
 */
import { ElementType } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import { Colors } from '@/constants/colors';

/**
 * Conteúdo e opções de apresentação do título de uma tela.
 * A variante compacta reduz a hierarquia para contextos com menos espaço.
 */
type HeadingProps = {
  // Texto principal que identifica a tela ou seção.
  title: string;
  // Explicação curta exibida abaixo do título.
  subtitle: string;
  // `compact` remove o divisor e aproxima visualmente título e subtítulo.
  variant?: 'default' | 'compact';
  // Componente opcional de ícone compatível com propriedades de cor e tamanho.
  icon?: ElementType<{ color?: string; size?: number }>;
  // Ajustes externos para posicionar o bloco no contexto da tela.
  style?: StyleProp<ViewStyle>;
};

/** Cabeçalho textual responsivo e reutilizável para o conteúdo das telas. */
export function Heading({
  title,
  subtitle,
  variant = 'default',
  icon: Icon,
  style,
}: HeadingProps) {
  // A largura acompanha rotação e redimensionamento; as duas flags independentes
  // combinam a escolha semântica da variante com a necessidade física do mobile.
  const { width } = useWindowDimensions();
  const isMobile = width < 560;
  const isCompact = variant === 'compact';

  return (
    <View style={[styles.container, style]}>
      {/* Ícone e título formam uma única linha centralizada. O tamanho do ícone
          segue primeiro a tela móvel e depois a variante compacta. */}
      <View style={styles.titleRow}>
        {Icon ? (
          <Icon
            size={isMobile ? 24 : isCompact ? 28 : 30}
            color={Colors.title}
          />
        ) : null}
        <Text
          style={[
            styles.title,
            isCompact && styles.compactTitle,
            isMobile && styles.titleMobile,
          ]}
        >
          {title}
        </Text>
      </View>
      {/* A variante compacta economiza altura ao omitir o divisor decorativo. */}
      {isCompact ? null : (
        <View style={[styles.divider, isMobile && styles.dividerMobile]} />
      )}
      {/* Estilos de variante e mobile são compostos sobre a tipografia base. */}
      <Text
        style={[
          styles.subtitle,
          isCompact && styles.compactSubtitle,
          isMobile && styles.subtitleMobile,
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // O bloco centraliza sua hierarquia e impede que o texto encoste nas laterais.
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  // Título e ícone permanecem alinhados horizontalmente com distância constante.
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  // Tipografia principal e suas variações: compacta aumenta o peso, enquanto
  // mobile reduz o tamanho para acomodar títulos nas larguras menores.
  title: {
    color: Colors.title,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  compactTitle: {
    fontWeight: '900',
  },
  titleMobile: {
    fontSize: 20,
  },
  // O divisor limita sua própria largura em telas amplas e recebe uma medida
  // menor no mobile para continuar proporcional ao título.
  divider: {
    width: 355,
    maxWidth: '80%',
    height: 5,
    marginVertical: 12,
    borderRadius: 3,
    backgroundColor: Colors.text,
  },
  dividerMobile: {
    width: 200,
  },
  // O subtítulo fornece contexto com menor destaque. Compacto ajusta margem,
  // peso e tamanho; mobile reduz novamente a escala para preservar legibilidade.
  subtitle: {
    color: Colors.subtitle,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  compactSubtitle: {
    marginTop: 9,
    fontSize: 15,
    fontWeight: '600',
  },
  subtitleMobile: {
    fontSize: 14,
  },
});
