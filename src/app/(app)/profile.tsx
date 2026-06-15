import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Menu } from '@/components/menu';
import { Loading } from '@/components/loading';
import { Background } from '@/components/background';
import { Alert } from '@/components/alert';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import {
  getProfileStats,
  ProfileStats,
  updateProfileStats,
} from '@/integration/pokemonIntegration';

const isWeb = Platform.OS === 'web';
const XP_TOTAL = 100;

export default function Perfil() {
  const { user, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    type: 'warning' as 'success' | 'error' | 'warning' | 'info',
  });
  const { width } = useWindowDimensions();

  const isMobile = width < 560;

  useEffect(() => {
    async function loadStats() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfileStats(userId);
        setStats(response);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [userId]);

  const xpAtual = useMemo(() => {
    if (!stats) return 0;
    return Math.min((stats.vitorias * 20) % XP_TOTAL, XP_TOTAL);
  }, [stats]);

  async function performUpdateStats(type: 'win' | 'loss') {
    if (!userId || !stats || saving) return;

    const nextVitorias =
      type === 'win' ? stats.vitorias + 1 : stats.vitorias;
    const nextDerrotas =
      type === 'loss' ? stats.derrotas + 1 : stats.derrotas;
    const nextLevel = Math.max(1, Math.floor(nextVitorias / 5) + 1);

    setSaving(true);

    try {
      const updated = await updateProfileStats(userId, {
        level: nextLevel,
        vitorias: nextVitorias,
        derrotas: nextDerrotas,
      });

      setStats(updated);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setAlertData({
        title: 'Erro ao atualizar',
        message: 'Nao foi possivel atualizar seus status agora.',
        type: 'error',
      });
      setAlertVisible(true);
    } finally {
      setSaving(false);
    }
  }

  function handleUpdateStats(type: 'win' | 'loss') {
    setAlertData({
      title: type === 'win' ? 'Registrar vitoria' : 'Registrar derrota',
      message:
        type === 'win'
          ? 'Deseja mesmo registrar uma nova vitoria no seu perfil?'
          : 'Deseja mesmo registrar uma nova derrota no seu perfil?',
      type: 'warning',
    });
    setConfirmAction(() => () => performUpdateStats(type));
    setAlertVisible(true);
  }

  if (loading) return <Loading />;

  const displayName = stats?.username ?? user ?? 'Treinador';
  const level = stats?.level ?? 1;
  const vitorias = stats?.vitorias ?? 0;
  const derrotas = stats?.derrotas ?? 0;
  const batalhas = vitorias + derrotas;
  const aproveitamento =
    batalhas > 0 ? `${Math.round((vitorias / batalhas) * 100)}%` : '0%';

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
          Perfil do {displayName}
        </Text>
        <View style={[styles.line, isMobile && styles.lineMobile]} />
        <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
          Status carregados da API do professor
        </Text>

        <View style={styles.content}>
          <View
            style={[
              styles.card,
              { flexDirection: isMobile ? 'column' : 'row' },
            ]}
          >
            <View style={[styles.leftSection, isMobile && styles.leftMobile]}>
              <View style={styles.profileContent}>
                <View style={styles.glow} />
                <View style={styles.avatarWrapper}>
                  <Image
                    source={require('../../../assets/images/icon.png')}
                    style={styles.avatar}
                  />
                </View>
                <Text style={[styles.name, isMobile && styles.nameMobile]}>
                  {displayName}
                </Text>
                <Text style={styles.role}>Cacador de Pokemons</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Nivel {level}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.rightSection, isMobile && styles.rightMobile]}>
              <View style={styles.statHeader}>
                <Text style={[styles.statTitle, isMobile && styles.statTitleMobile]}>
                  Experiencia
                </Text>
                <Text style={[styles.statValue, isMobile && styles.statValueMobile]}>
                  {xpAtual}/{XP_TOTAL}
                </Text>
              </View>

              <View style={styles.xpBarTrack}>
                <View
                  style={[
                    styles.xpBarFill,
                    { width: `${(xpAtual / XP_TOTAL) * 100}%` },
                  ]}
                />
              </View>

              <Text style={[styles.xpText, isMobile && styles.xpTextMobile]}>
                Faltam {XP_TOTAL - xpAtual} XP para o proximo nivel
              </Text>

              <View style={styles.statDivider} />

              <View style={[styles.grid, isMobile && styles.gridMobile]}>
                {[
                  { value: vitorias, label: 'Vitorias' },
                  { value: derrotas, label: 'Derrotas' },
                  { value: level, label: 'Nivel' },
                  { value: aproveitamento, label: 'Aproveitamento' },
                ].map((item) => (
                  <Pressable
                    key={item.label}
                    style={(state: any) => [
                      styles.gridCard,
                      Boolean(state.hovered) && isWeb && styles.gridCardHover,
                      isMobile && styles.gridCardMobile,
                    ]}
                  >
                    <Text style={[styles.gridNumber, isMobile && styles.gridNumberMobile]}>
                      {item.value}
                    </Text>
                    <Text style={[styles.gridLabel, isMobile && styles.gridLabelMobile]}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionButton, saving && styles.actionDisabled]}
                  onPress={() => handleUpdateStats('win')}
                  disabled={saving}
                >
                  <Text style={styles.actionText}>Registrar vitoria</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionButtonAlt, saving && styles.actionDisabled]}
                  onPress={() => handleUpdateStats('loss')}
                  disabled={saving}
                >
                  <Text style={styles.actionTextAlt}>Registrar derrota</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>

      <Alert
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        visible={alertVisible}
        onClose={() => {
          setAlertVisible(false);
          setConfirmAction(null);
        }}
        actions={
          confirmAction
            ? [
                {
                  label: 'Cancelar',
                  variant: 'secondary',
                  onPress: () => {
                    setAlertVisible(false);
                    setConfirmAction(null);
                  },
                },
                {
                  label: 'Confirmar',
                  variant: 'primary',
                  onPress: () => {
                    const action = confirmAction;
                    setAlertVisible(false);
                    setConfirmAction(null);
                    action?.();
                  },
                },
              ]
            : undefined
        }
      />
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

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },

  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },

  actionButtonAlt: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  actionDisabled: {
    opacity: 0.55,
  },

  actionText: {
    color: Colors.white,
    fontWeight: '900',
  },

  actionTextAlt: {
    color: Colors.primary,
    fontWeight: '900',
  },
});
