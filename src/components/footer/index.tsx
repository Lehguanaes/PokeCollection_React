/*
 * Implementa o rodapé compartilhado das principais páginas do projeto.
 * É usado no login e nas telas de mapa, Pokédex, Pokémon, perfil e equipe.
 * Anima uma faixa contínua de Pokémon acima dos créditos da aplicação.
 */
import React, { useEffect, useRef } from "react";
import { View, Animated, Image, Text } from "react-native";
import { styles } from "./styles";

/** Rodapé que combina uma faixa contínua de Pokémon com os créditos do projeto. */
export function Footer() {
  // O valor animado guarda o deslocamento horizontal da faixa durante toda a
  // vida do componente, sem provocar renderizações a cada quadro da animação.
  const translateX = useRef(new Animated.Value(0)).current;

  // ITEM_W inclui a largura da imagem e suas margens horizontais. Esse cálculo
  // permite deslocar exatamente uma cópia inteira antes da repetição do loop.
  const ITEM_W = 73;
  const pokemons = [1,4,7,25,39,52,63,66,94,116,129,131,133,143,147,152,155,158];
  const totalW = ITEM_W * pokemons.length;

  useEffect(() => {
    // A faixa percorre uma lista completa em velocidade constante. O driver
    // nativo mantém a transformação fluida sem depender do ciclo JavaScript.
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -totalW,
        duration: 28000,
        useNativeDriver: true,
      })
    );

    animation.start();
    // Interromper o loop ao desmontar libera os recursos da animação.
    return () => animation.stop();
  }, [totalW, translateX]);

  // Duplicar a sequência coloca uma segunda cópia logo após a primeira; quando
  // a primeira sai da tela, a segunda ocupa seu lugar e torna o reinício invisível.
  const all = [...pokemons, ...pokemons];

  return (
    <View style={styles.footer}>

      {/* O contêiner recorta as imagens que estão fora da faixa visível. */}
      <View style={styles.carouselContainer}>
        <Animated.View
          style={[
            styles.row,
            { width: totalW * 2, transform: [{ translateX }] }
          ]}
        >
          {/* Cada ID é convertido diretamente na URL da arte oficial correspondente. */}
          {all.map((id, index) => (
            <Image
              key={index}
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
              }}
              style={styles.pokemon}
            />
          ))}
        </Animated.View>
      </View>

      {/* A barra inferior separa os créditos da animação decorativa. */}
      <View style={styles.bottomBar}>
        <Text style={styles.copy}>
          © 2026 - Aprendendo React Native com PokeCollection - Letícia e Erick
        </Text>
      </View>

    </View>
  );
}
