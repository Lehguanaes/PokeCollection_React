/*
 * Implementa o menu principal de navegação da área autenticada.
 * É renderizado pelo Header móvel e pelo contêiner Screen.
 * Expande opções animadas, destaca a rota e executa o logout.
 */
import { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';

import { usePathname, useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import {
  BookOpen,
  Cat,
  Camera,
  Trophy,
  User,
  Map,
  LogOut,
  Database,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { Pokeball } from '@/components/pokeball';
import { styles } from './styles';

/** Campos compartilhados por qualquer opção apresentada no menu. */
type MenuItemBase = {
  // Texto visível que identifica o destino ou a ação.
  label: string;
  // Componente de ícone associado, recebido como tipo para ser instanciado na lista.
  icon: LucideIcon;
};

/** Opção que navega para uma rota conhecida pelo Expo Router. */
type RouteMenuItem = MenuItemBase & {
  type: 'route';
  route: Href;
};

/** Opção especial sem rota, responsável por encerrar a sessão. */
type LogoutMenuItem = MenuItemBase & {
  type: 'logout';
};

// A união discriminada permite usar `type` para acessar com segurança a rota
// apenas em itens de navegação e tratar logout como um fluxo separado.
type MenuItem = RouteMenuItem | LogoutMenuItem;

// A configuração mantém ordem, textos, ícones e destinos fora do JSX. Assim, o
// mesmo processo de renderização atende todas as opções de maneira uniforme.
const MENU_ITEMS: MenuItem[] = [
  {
    type: 'route',
    label: 'Minha Pokédex',
    icon: BookOpen,
    route: '/pokedex',
  },
  {
    type: 'route',
    label: 'Meu Time',
    icon: Trophy,
    route: '/team',
  },
  {
    type: 'route',
    label: 'Catálogo',
    icon: Cat,
    route: '/pokemon',
  },
  {
    type: 'route',
    label: 'Perfil',
    icon: User,
    route: '/profile',
  },
  {
    type: 'route',
    label: 'Capturar Pokémon',
    icon: Camera,
    route: '/camera',
  },
  {
    type: 'route',
    label: 'Mapa',
    icon: Map,
    route: '/map',
  },
  ...(__DEV__
    ? [
        {
          type: 'route' as const,
          label: 'Storage',
          icon: Database,
          route: '/storage' as Href,
        },
      ]
    : []),
  {
    type: 'logout',
    label: 'Desconectar',
    icon: LogOut,
  },
];

/** Menu expansível acionado por uma Pokébola e adaptado para desktop e mobile. */
export function Menu() {
  // Router e pathname executam a navegação e identificam visualmente a rota ativa.
  const router = useRouter();
  const pathname = usePathname();
  // Usuários sem sessão não recebem ações internas; isso evita expor opções que
  // levariam a telas protegidas enquanto a autenticação ainda não existe.
  const { signOut, isAuthenticated } = useAuth();
  // O mesmo limite usado pelo layout define dimensões e posicionamento móveis.
  const { width } = useWindowDimensions();
  const isMobile = width < 560;
  const availableMenuItems = isAuthenticated
    ? MENU_ITEMS
    : [];
  // Captura existe somente no Android. As demais opções permanecem idênticas
  // entre plataformas.
  const visibleMenuItems =
    Platform.OS === 'android'
      ? availableMenuItems
      : availableMenuItems.filter(
          (item) => item.type !== 'route' || item.route !== '/camera'
        );

  // `open` controla a presença do dropdown na árvore e o estado lógico do botão.
  const [open, setOpen] = useState(false);

  // Valores independentes permitem animar rotação da bola, abertura do painel e
  // pulso decorativo sem provocar novas renderizações a cada quadro.
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // O brilho alterna suavemente de escala para sinalizar que a Pokébola é
    // interativa mesmo antes de o usuário abrir o menu.
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.12,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    // A limpeza interrompe o loop quando o menu deixa a árvore da aplicação.
    return () => animation.stop();
  }, [glowAnim]);

  /** Alterna o estado e sincroniza as animações do painel e da Pokébola. */
  function toggleMenu() {
    const next = !open;

    setOpen(next);

    // As molas rodam em paralelo para que expansão e rotação pareçam uma única
    // resposta física ao toque, usando o driver nativo para maior fluidez.
    Animated.parallel([
      Animated.spring(menuAnim, {
        toValue: next ? 1 : 0,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: next ? 1 : 0,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }

  /** Fecha o painel e executa a ação específica da opção selecionada. */
  async function handleItemPress(item: MenuItem) {
    // Os valores são zerados imediatamente porque o dropdown será removido da
    // árvore; na próxima abertura, todas as transições começam do estado fechado.
    setOpen(false);
    menuAnim.setValue(0);
    rotateAnim.setValue(0);

    if (item.type === 'logout') {
      // O logout precisa terminar antes da substituição da rota para que a tela
      // inicial já seja exibida com o contexto de autenticação atualizado.
      await signOut();
      router.replace('/');
      return;
    }

    // Evita substituir a rota por ela mesma quando o usuário toca no item ativo.
    if (item.route !== pathname) router.replace(item.route);
  }

  // A interpolação converte o progresso normalizado em graus. O giro de 225°
  // deixa claro que a Pokébola mudou de estado ao abrir o menu.
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '225deg'],
  });

  return (
    // Os wrappers diferem porque no desktop o menu flutua sobre a página e, no
    // mobile, integra o cabeçalho. `box-none` deixa áreas vazias passarem toques.
    <View
      style={isMobile ? styles.mobileWrapper : styles.wrapper}
      pointerEvents="box-none"
    >
      {open ? (
        // O dropdown só existe aberto. Opacidade, deslocamento e escala vertical
        // produzem uma entrada curta a partir da Pokébola.
        <Animated.View
          pointerEvents={open ? 'auto' : 'none'}
          style={[
            isMobile
              ? styles.mobileDropdownContainer
              : styles.dropdownContainer,
            {
              opacity: menuAnim,
              transform: [
                {
                  translateY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-35, 0],
                  }),
                },
                {
                  scaleY: menuAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={isMobile ? styles.mobileDropdown : styles.dropdown}>
            {/* Camada reservada para o acabamento luminoso do painel. */}
            <View style={styles.dropdownGlow} />

            {visibleMenuItems.map((item, index) => {
              // O componente de ícone e o estado ativo são derivados de cada item,
              // sem armazenar informação duplicada em estado local.
              const Icon = item.icon;
              const active =
                item.type === 'route' && pathname === item.route;

              return (
                // O índice aumenta o deslocamento inicial e cria uma entrada em
                // cascata, embora todos os itens compartilhem o mesmo progresso.
                <Animated.View
                  key={item.type === 'route' ? item.route.toString() : item.type}
                  style={{
                    opacity: menuAnim,
                    transform: [
                      {
                        translateY: menuAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20 * (index + 1), 0],
                        }),
                      },
                    ],
                  }}
                >
                  <Pressable
                    onPress={() => handleItemPress(item)}
                    style={({ pressed }) => [
                      // Mobile reduz dimensões; rota ativa muda cores e a pressão
                      // aplica uma pequena escala como confirmação tátil visual.
                      isMobile ? styles.mobileMenuItem : styles.menuItem,
                      active && styles.activeItem,
                      pressed && { transform: [{ scale: 0.97 }] },
                    ]}
                  >
                    {/* O invólucro garante área e fundo consistentes para ícones diferentes. */}
                    <View
                      style={[
                        isMobile
                          ? styles.mobileIconWrapper
                          : styles.iconWrapper,
                        active && styles.activeIcon,
                      ]}
                    >
                      <Icon
                        size={isMobile ? 16 : 20}
                        color={active ? Colors.primary : Colors.white}
                      />
                    </View>

                    {/* O texto usa o espaço restante e herda o destaque da rota ativa. */}
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          isMobile
                            ? styles.mobileMenuText
                            : styles.menuText,
                          active && styles.activeText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      ) : null}

      {/* O acionador permanece visível e recebe continuamente o pulso de escala. */}
      <Animated.View
        style={[
          isMobile ? styles.mobileGlowWrapper : styles.glowWrapper,
          {
            transform: [{ scale: glowAnim }],
          },
        ]}
      >
        {/* Disco translúcido atrás da bola cria o brilho animado. */}
        <View style={isMobile ? styles.mobileGlow : styles.glow} />

        <Pressable
          onPress={toggleMenu}
          style={isMobile ? styles.mobilePokeball : styles.pokeball}
        >
          {/* A camada interna combina a rotação de abertura com um leve aumento
              de escala, mantendo o SVG da Pokébola simples e reutilizável. */}
          <Animated.View
            style={[
              isMobile ? styles.mobileBallInner : styles.ballInner,
              {
                transform: [
                  { rotate },
                  {
                    scale: menuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.08],
                    }),
                  },
                ],
              },
            ]}
          >
            <Pokeball size={isMobile ? 52 : 70} />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}
