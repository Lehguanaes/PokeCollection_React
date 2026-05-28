import React,{
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
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

const MENU_ITEMS = [
  {
    label:'Perfil',
    icon:User,
    route:'/profile',
  },

  {
    label:'Time',
    icon:Trophy,
    route:'/team',
  },

  {
    label:'Pokédex',
    icon:Cat,
    route:'/pokedex',
  },
];

export function Menu() {
  const router = useRouter();

  const pathname =
    usePathname();

  const [open,setOpen] =
    useState(false);

  const rotateAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const menuAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const glowAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          glowAnim,
          {
            toValue:1.12,
            duration:1600,
            useNativeDriver:true,
          }
        ),

        Animated.timing(
          glowAnim,
          {
            toValue:1,
            duration:1600,
            useNativeDriver:true,
          }
        ),
      ])
    ).start();
  }, []);

  function toggleMenu() {
    const next = !open;

    setOpen(next);

    Animated.parallel([
      Animated.spring(
        menuAnim,
        {
          toValue:next
            ? 1
            : 0,

          friction:7,
          tension:70,

          useNativeDriver:true,
        }
      ),

      Animated.spring(
        rotateAnim,
        {
          toValue:next
            ? 1
            : 0,

          friction:6,
          tension:70,

          useNativeDriver:true,
        }
      ),
    ]).start();
  }

function navigateTo(route) {
  router.push(route);

  toggleMenu();
}

  const rotate =
    rotateAnim.interpolate({
      inputRange:[0,1],

      outputRange:[
        '0deg',
        '225deg',
      ],
    });

  return (
    <View
      style={styles.wrapper}
      pointerEvents="box-none"
    >
      <Animated.View
        pointerEvents={
          open
            ? 'auto'
            : 'none'
        }
        style={[
          styles.dropdownContainer,

          {
            opacity:menuAnim,

            transform:[
              {
                translateY:
                  menuAnim.interpolate(
                    {
                      inputRange:[
                        0,
                        1,
                      ],

                      outputRange:[
                        -35,
                        0,
                      ],
                    }
                  ),
              },

              {
                scaleY:
                  menuAnim.interpolate(
                    {
                      inputRange:[
                        0,
                        1,
                      ],

                      outputRange:[
                        0.4,
                        1,
                      ],
                    }
                  ),
              },
            ],
          },
        ]}
      >
        <View
          style={styles.dropdown}
        >
          <View
            style={
              styles.dropdownGlow
            }
          />

          {MENU_ITEMS.map(
            (
              item,
              index
            ) => {
              const Icon =
                item.icon;

              const active =
                pathname ===
                item.route;

              return (
                <Animated.View
                  key={
                    item.route
                  }
                  style={{
                    opacity:
                      menuAnim,

                    transform:[
                      {
                        translateY:
                          menuAnim.interpolate(
                            {
                              inputRange:[
                                0,
                                1,
                              ],

                              outputRange:[
                                -20 *
                                  (index + 1),
                                0,
                              ],
                            }
                          ),
                      },
                    ],
                  }}
                >
                  <Pressable
                    onPress={() =>
                      navigateTo(
                        item.route
                      )
                    }
                    style={({
                      pressed,
                    }) => [
                      styles.menuItem,

                      active &&
                        styles.activeItem,

                      pressed && {
                        transform:[
                          {
                            scale:0.97,
                          },
                        ],
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconWrapper,

                        active &&
                          styles.activeIcon,
                      ]}
                    >
                      <Icon
                        size={20}
                        color={
                          active
                            ? Colors.primary
                            : Colors.white
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.textContainer
                      }
                    >
                      <Text
                        style={[
                          styles.menuText,

                          active &&
                            styles.activeText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            }
          )}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.glowWrapper,

          {
            transform:[
              {
                scale:
                  glowAnim,
              },
            ],
          },
        ]}
      >
        <View
          style={styles.glow}
        />

        <Pressable
          onPress={
            toggleMenu
          }
          style={
            styles.pokeball
          }
        >
          <Animated.View
            style={[
              styles.ballInner,

              {
                transform:[
                  {
                    rotate,
                  },

                  {
                    scale:
                      menuAnim.interpolate(
                        {
                          inputRange:[
                            0,
                            1,
                          ],

                          outputRange:[
                            1,
                            1.08,
                          ],
                        }
                      ),
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.topHalf
              }
            />

            <View
              style={
                styles.bottomHalf
              }
            />

            <View
              style={
                styles.middleLine
              }
            />

            <View
              style={
                styles.centerCircle
              }
            />

            <View
              style={
                styles.innerCircle
              }
            />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    wrapper:{
      position:'absolute',
      top:120,
      right:32,
      zIndex:999,
      alignItems:'center',
    },

    dropdownContainer:{
      position:'absolute',
      top:72,
      right:-10,
      width:260,
      zIndex:1,
    },

    dropdown:{
      backgroundColor:
        Colors.white,

      borderRadius:34,

      paddingTop:20,

      paddingBottom:14,

      paddingHorizontal:14,

      gap:10,

      borderWidth:3,

      borderColor:
        Colors.details,

      shadowColor:
        Colors.details,

      shadowOffset:{
        width:0,
        height:10,
      },

      shadowOpacity:0.15,

      shadowRadius:18,

      elevation:15,

      overflow:'hidden',
    },

    menuItem:{
      flexDirection:'row',

      alignItems:'center',

      backgroundColor:
        Colors.white,

      borderRadius:24,

      paddingVertical:8,

      paddingHorizontal:8,

      borderWidth:1.5,

      borderColor:
        Colors.inputBorder,
    },

    activeItem:{
      backgroundColor:
        Colors.primary,

      borderColor:
        Colors.primary,
    },

    iconWrapper:{
      width:48,
      height:48,

      borderRadius:16,

      justifyContent:
        'center',

      alignItems:
        'center',

      backgroundColor:
        Colors.pokeballRed,

      marginRight:14,

      shadowColor:
        Colors.pokeballRed,

      shadowOffset:{
        width:0,
        height:6,
      },

      shadowOpacity:0.25,

      shadowRadius:10,

      elevation:8,
    },

    activeIcon:{
      backgroundColor:
        Colors.white,
    },

    textContainer:{
      flex:1,
    },

    menuText:{
      fontSize:16,
      fontWeight:'800',
      color:
        Colors.txtPrimary,
    },

    activeText:{
      color:
        Colors.white,
    },

    glowWrapper:{
      width:74,
      height:74,

      justifyContent:
        'center',

      alignItems:
        'center',

      zIndex:999,
    },

    glow:{
      position:'absolute',

      width:96,
      height:96,

      borderRadius:999,

      backgroundColor:
        'rgba(102,205,170,0.28)',
    },

    pokeball:{
      width:74,
      height:74,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    ballInner:{
      width:70,
      height:70,

      borderRadius:999,

      overflow:'hidden',

      backgroundColor:
        Colors.white,

      borderWidth:4,

      borderColor:
        Colors.black,

      shadowColor:
        Colors.black,

      shadowOffset:{
        width:0,
        height:8,
      },

      shadowOpacity:0.22,

      shadowRadius:10,

      elevation:14,
    },

    topHalf:{
      position:'absolute',

      top:0,

      width:'100%',
      height:'50%',

      backgroundColor:
        Colors.pokeballRed,
    },

    bottomHalf:{
      position:'absolute',

      bottom:0,

      width:'100%',
      height:'50%',

      backgroundColor:
        Colors.white,
    },

    middleLine:{
      position:'absolute',

      top:'47%',

      width:'100%',
      height:6,

      backgroundColor:
        Colors.black,

      zIndex:3,
    },

    centerCircle:{
      position:'absolute',

      top:'50%',
      left:'50%',

      width:24,
      height:24,

      marginLeft:-12,
      marginTop:-12,

      borderRadius:999,

      backgroundColor:
        Colors.white,

      borderWidth:4,

      borderColor:
        Colors.black,

      zIndex:5,
    },

    innerCircle:{
      position:'absolute',

      top:'50%',
      left:'50%',

      width:8,
      height:8,

      marginLeft:-4,
      marginTop:-4,

      borderRadius:999,

      backgroundColor:
        Colors.white,

      zIndex:6,
    },
  });