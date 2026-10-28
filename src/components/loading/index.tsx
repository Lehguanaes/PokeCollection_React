/*
 * Exibe o indicador temático de carregamento da aplicação.
 * É usado nas telas de autenticação, Pokédex e time.
 * Anima três Pokébolas em uma sequência contínua de pulsos.
 */
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Pokeball } from '@/components/pokeball';
import { Colors } from '@/constants/colors';

// Tamanho comum das bolas e duração de cada metade do pulso. Compartilhar esses
// valores mantém o ritmo sincronizado entre os três elementos.
const BALL_SIZE = 36;
const DURATION = 500;

/** Propriedade interna que desloca o início de cada pulso na sequência. */
function PulseBall({ delay }: { delay: number }) {
  // A opacidade animada vive em uma ref para conservar seu valor entre renders.
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // Cada bola espera seu atraso, clareia, escurece e aguarda o restante do
    // ciclo. Essa compensação mantém três pulsos espaçados em um loop contínuo.
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: DURATION, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: DURATION, useNativeDriver: true }),
        Animated.delay((2 - delay / DURATION) * DURATION),
      ])
    );
    anim.start();
    // Parar explicitamente evita manter uma animação ativa depois da desmontagem.
    return () => anim.stop();
  }, []);

  return (
    // Somente a opacidade do invólucro é animada; o SVG da Pokébola permanece estável.
    <Animated.View style={{ opacity }}>
      <Pokeball size={BALL_SIZE} />
    </Animated.View>
  );
}

/** Indicador de carregamento temático composto por três Pokébolas pulsantes. */
export function Loading() {
  return (
    // A região ocupa a área disponível para manter o feedback no centro da tela.
    <View style={styles.container}>
      <View style={styles.row}>
        <PulseBall delay={0} />
        <PulseBall delay={DURATION} />
        <PulseBall delay={DURATION * 2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Área de loading em tela cheia com a mesma cor de fundo da aplicação.
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Linha que separa visualmente os três estágios do pulso.
  row: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
});
