/*
 * Renderiza a ambientação decorativa das páginas do projeto.
 * É usado na tela de login e dentro da estrutura Screen.
 * Alterna ilustrações de Pokémon com animação em telas amplas compatíveis.
 */
import React, { useEffect, useState, useRef } from "react";
import { Image, Platform, useWindowDimensions, Animated } from "react-native";
import { styles } from "./styles";

/** Descreve uma imagem e qual das quatro posições decorativas ela ocupará. */
type PokemonBackgroundItem = {
  // Endereço da imagem que o componente Image carregará.
  uri: string;
  // Chave restrita aos estilos existentes, impedindo posições desconhecidas.
  styleKey: "p1" | "p2" | "p3" | "p4";
};

/** Propriedades opcionais que permitem substituir a seleção aleatória. */
type Props = {
  // Quando informado e não vazio, este conjunto permanece visível no lugar do sorteio.
  items?: PokemonBackgroundItem[];
};

// IDs previamente escolhidos para produzir um fundo reconhecível e variado sem
// precisar baixar dados completos da API antes de montar o componente.
const POKEMONS = [
  1, 4, 6, 7, 9, 25, 26, 37, 39,
  52, 59, 65, 68, 94, 95, 130,
  131, 133, 143, 149, 150, 151,
];

// A ordem associa cada Pokémon sorteado a uma posição diferente da composição.
const STYLE_KEYS = ["p1", "p2", "p3", "p4"] as const;

/** Sorteia quatro Pokémon e já prepara os dados consumidos pelo Image. */
function generatePokemons(): PokemonBackgroundItem[] {
  // A cópia evita reordenar a constante compartilhada; depois apenas quatro
  // itens são usados para corresponder exatamente às quatro posições visuais.
  const shuffled = [...POKEMONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).map((pokemonId, index) => ({
    uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
    styleKey: STYLE_KEYS[index],
  }));
}

/** Exibe uma composição decorativa que troca de Pokémon com transição suave. */
export function Background({ items }: Props) {
  // A decoração é intencionalmente removida no Android e em telas estreitas:
  // isso reduz carga de imagens e evita competir por espaço com o conteúdo.
  const { width } = useWindowDimensions();
  const isAndroid = Platform.OS === "android";
  const isSmallScreen = width < 768;

  // A função inicializadora executa o primeiro sorteio apenas na montagem, em
  // vez de gerar uma nova seleção em toda renderização.
  const [randomPokemons, setRandomPokemons] = useState<PokemonBackgroundItem[]>(
    () => generatePokemons()
  );

  // Animated.Value fica em uma ref para preservar a mesma identidade entre
  // renderizações e permitir que a animação continue sem ser reiniciada.
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // A cada ciclo, as imagens desaparecem antes da troca; assim o usuário não
    // vê uma substituição brusca entre URLs diferentes.
    const interval = setInterval(() => {
      // Primeiro reduz a opacidade do conjunto atual.
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // A seleção só muda quando o conjunto anterior já está invisível.
        setRandomPokemons(generatePokemons());

        // Em seguida, revela o novo conjunto com uma entrada mais rápida.
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    // Cancelar o intervalo ao desmontar evita atualizações de estado órfãs.
    return () => clearInterval(interval);
  }, []);

  // Retornar cedo impede tanto a renderização quanto o carregamento das imagens
  // nas plataformas em que essa decoração não faz parte do layout.
  if (isAndroid || isSmallScreen) return null;

  // Uma lista externa não vazia tem prioridade; caso contrário, usa-se o sorteio.
  const data = items?.length ? items : randomPokemons;

  return (
    // A camada inteira compartilha a mesma opacidade e ignora toques para nunca
    // bloquear controles posicionados acima dela.
    <Animated.View
      style={[styles.container, { opacity }]}
      pointerEvents="none"
    >
      {data.map((item, index) => {
        // Converte a chave serializável recebida nos objetos de estilo concretos.
        const imageStyle =
          item.styleKey === "p1" ? styles.p1
          : item.styleKey === "p2" ? styles.p2
          : item.styleKey === "p3" ? styles.p3
          : styles.p4;

        return (
          // URI e índice formam uma chave estável mesmo se duas posições usarem
          // acidentalmente a mesma imagem.
          <Image
            key={`${item.uri}-${index}`}
            source={{ uri: item.uri }}
            style={imageStyle}
          />
        );
      })}
    </Animated.View>
  );
}
