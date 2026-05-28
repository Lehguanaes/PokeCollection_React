import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  Pressable,
  Animated,
  useWindowDimensions,
} from 'react-native';

import {
  useRouter,
  usePathname,
} from 'expo-router';

import {
  User,
  Trophy,
  Cat,
} from 'lucide-react-native';

import { Colors } from '@/constants/colors';
import { styles } from './styles';

const MENU_ITEMS = [
  {
    label: 'Perfil',
    icon: User,
    route: '/profile',
  },
  {
    label: 'Time',
    icon: Trophy,
    route: '/team',
  },
  {
    label: 'Pokédex',
    icon: Cat,
    route: '/pokedex',
  },
];

export function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [open, setOpen] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, []);

  function toggleMenu() {
    const next = !open;

    setOpen(next);

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

  function navigateTo(route) {
    router.push(route);
    toggleMenu();
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '225deg'],
  });

  return (
    <View
      style={isMobile ? styles.mobileWrapper : styles.wrapper}
      pointerEvents="box-none"
    >
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
          <View style={styles.dropdownGlow} />

          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const active = pathname === item.route;

            return (
              <Animated.View
                key={item.route}
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
                  onPress={() => navigateTo(item.route)}
                  style={({ pressed }) => [
                    isMobile ? styles.mobileMenuItem : styles.menuItem,
                    active && styles.activeItem,
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <View
                    style={[
                      isMobile ? styles.mobileIconWrapper : styles.iconWrapper,
                      active && styles.activeIcon,
                    ]}
                  >
                    <Icon
                      size={isMobile ? 16 : 20}
                      color={active ? Colors.primary : Colors.white}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        isMobile ? styles.mobileMenuText : styles.menuText,
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

      <Animated.View
        style={[
          isMobile ? styles.mobileGlowWrapper : styles.glowWrapper,
          {
            transform: [{ scale: glowAnim }],
          },
        ]}
      >
        <View style={isMobile ? styles.mobileGlow : styles.glow} />

        <Pressable
          onPress={toggleMenu}
          style={isMobile ? styles.mobilePokeball : styles.pokeball}
        >
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
            <View style={styles.topHalf} />
            <View style={styles.bottomHalf} />
            <View style={styles.middleLine} />
            <View style={styles.centerCircle} />
            <View style={styles.innerCircle} />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}