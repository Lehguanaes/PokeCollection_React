import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Image, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Menu } from '@/components/menu';
import { Loading } from '@/components/loading';
import { Background } from '@/components/background';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';

const isWeb = Platform.OS === 'web';
const XP_TOTAL = 100;
const XP_ATUAL = 12;

export default function Perfil() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  const isMobile = width < 560;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <View style={styles.wrapper}>
      <Background />
      {!isMobile && <Menu />}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Perfil do {user}!
        </Text>
        <View style={[styles.line, isMobile && styles.lineMobile]} />
        <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
          Veja seus status e progresso! ✨
        </Text>

        <View style={styles.content}>
          <View style={[styles.card, { flexDirection: isMobile ? 'column' : 'row' }]}>

            {/* LEFT */}
            <View style={[styles.leftSection, isMobile && styles.leftMobile]}>
              <View style={styles.profileContent}>
                <View style={styles.glow} />
                <View style={styles.avatarWrapper}>
                  <Image
                    source={require('../../../assets/images/icon.png')}
                    style={styles.avatar}
                  />
                </View>
                <Text style={[styles.name, isMobile && styles.nameMobile]}>{user}</Text>
                <Text style={styles.role}>Caçador de Pokémons</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>⭐ Nível 12</Text>
                </View>
              </View>
            </View>

            {/* RIGHT */}
            <View style={[styles.rightSection, isMobile && styles.rightMobile]}>
              <View style={styles.statHeader}>
                <Text style={[styles.statTitle, isMobile && styles.statTitleMobile]}>
                  Experiência
                </Text>
                <Text style={[styles.statValue, isMobile && styles.statValueMobile]}>
                  {XP_ATUAL}/{XP_TOTAL}
                </Text>
              </View>

              <View style={styles.xpBarTrack}>
                <View
                  style={[
                    styles.xpBarFill,
                    { width: `${(XP_ATUAL / XP_TOTAL) * 100}%` },
                  ]}
                />
              </View>

              <Text style={[styles.xpText, isMobile && styles.xpTextMobile]}>
                Faltam {XP_TOTAL - XP_ATUAL} XP para o próximo nível
              </Text>

              <View style={styles.statDivider} />

              <View style={[styles.grid, isMobile && styles.gridMobile]}>
                {[
                  { emoji: '🏆', value: 8, label: 'Vitórias' },
                  { emoji: '💀', value: 2, label: 'Derrotas' },
                  { emoji: '⚡', value: 151, label: 'Pokémons' },
                  { emoji: '🔥', value: '78%', label: 'Progresso' },
                ].map((item, i) => (
                  <Pressable
                    key={i}
                    style={({ hovered }) => [
                      styles.gridCard,
                      hovered && isWeb && styles.gridCardHover,
                      isMobile && styles.gridCardMobile,
                    ]}
                  >
                    <Text style={[styles.gridEmoji, isMobile && styles.gridEmojiMobile]}>
                      {item.emoji}
                    </Text>
                    <Text style={[styles.gridNumber, isMobile && styles.gridNumberMobile]}>
                      {item.value}
                    </Text>
                    <Text style={[styles.gridLabel, isMobile && styles.gridLabelMobile]}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.title,
    textAlign: 'center',
    marginTop: 28,
  },
  titleMobile: {
    fontSize: 24,
    marginTop: 18,
  },

  subtitle: {
    fontSize: 18,
    color: Colors.subtitle,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitleMobile: {
    fontSize: 14,
  },

  line: {
    width: 360,
    height: 5,
    backgroundColor: Colors.text,
    alignSelf: 'center',
    marginVertical: 14,
    borderRadius: 20,
  },
  lineMobile: {
    width: 200,
    marginVertical: 10,
  },

  card: {
    width: '100%',
    maxWidth: 1000,
    backgroundColor: Colors.white,
    borderRadius: 40,
    padding: 30,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    gap: 40,
    overflow: 'hidden',
  },

  leftSection: {
    width: isWeb ? 280 : '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  leftMobile: {
    width: '100%',
    marginTop: 15,
  },

  profileContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  glow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: Colors.secondary,
    opacity: 0.18,
    top: -20,
  },

  avatarWrapper: {
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.details,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: { width: 160, height: 160 },

  name: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.title,
    marginTop: 22,
    textAlign: 'center',
  },
  nameMobile: {
    fontSize: 24,
    marginTop: 14,
  },

  role: {
    fontSize: 14,
    color: Colors.subtitle,
    fontWeight: '700',
    marginTop: 8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  badge: {
    marginTop: 18,
    backgroundColor: Colors.details,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },

  badgeText: {
    color: Colors.gray[800],
    fontWeight: '800',
    fontSize: 14,
  },

  rightSection: { flex: 1 },
  rightMobile: {
    borderLeftWidth: 0,
    paddingLeft: 0,
    paddingTop: 10,
  },

  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.title,
  },
  statTitleMobile: {
    fontSize: 16,
  },

  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.subtitle,
  },
  statValueMobile: {
    fontSize: 14,
  },

  xpBarTrack: {
    height: 16,
    backgroundColor: Colors.inputBorder,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 14,
  },

  xpBarFill: {
    height: '100%',
    backgroundColor: Colors.details,
  },

  xpText: {
    fontSize: 14,
    color: Colors.subtitle,
    fontWeight: '600',
    marginTop: 10,
  },
  xpTextMobile: {
    fontSize: 12,
  },

  statDivider: {
    height: 2,
    backgroundColor: Colors.inputBorder,
    marginVertical: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 18,
  },
  gridMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  gridCard: {
    width: isWeb ? '47%' : '100%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  gridCardMobile: {
    width: '100%',
  },
  gridCardHover: {
    borderColor: '#FFD54A',
    shadowColor: '#FFD54A',
    shadowOpacity: 0.25,
  },

  gridEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  gridEmojiMobile: {
    fontSize: 24,
  },

  gridNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.title,
  },
  gridNumberMobile: {
    fontSize: 22,
  },

  gridLabel: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.subtitle,
    fontWeight: '700',
  },
  gridLabelMobile: {
    fontSize: 12,
  },
});