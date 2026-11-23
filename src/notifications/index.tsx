import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { useRootNavigationState, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { getReminderEnabled, setReminderEnabled } from '@/database/sqlite';

const REMINDER_SECONDS = 60;
const CHANNEL = 'capture-reminders';
const REMINDER_ID = 'daily-capture-reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let currentUserId: string | null = null;
let reminderEnabled = false;

async function requestPermission() {
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Lembrete de captura',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Permita as notificações nas configurações do Android.');
}

async function applyReminder(enabled: boolean) {
  reminderEnabled = enabled;
  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  if (!reminderEnabled) return;
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: {
      title: 'Bora capturar mais Pokémon?',
      body: 'Sua Pokédex está esperando novas descobertas. Vamos nessa, treinador!',
      sound: 'default',
      data: { screen: 'pokedex' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: REMINDER_SECONDS,
      repeats: true,
      channelId: CHANNEL,
    },
  });
  // Se foi desligado enquanto o Android agendava, cancele o aviso.
  if (!reminderEnabled) await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
}

async function saveReminder(userId: string, enabled: boolean, previous: boolean) {
  if (enabled) await requestPermission();
  if (userId !== currentUserId) return;
  await applyReminder(enabled);
  try {
    await setReminderEnabled(userId, enabled);
  } catch (error) {
    if (userId === currentUserId) await applyReminder(previous);
    throw error;
  }
}

export function NotificationManager() {
  const { userId } = useAuth();
  const router = useRouter();
  const navigation = useRootNavigationState();
  const response = Notifications.useLastNotificationResponse();
  const handled = useRef('');
  const previousUserId = useRef(userId);
  currentUserId = userId;

  useEffect(function syncReminder() {
    const previous = previousUserId.current;
    previousUserId.current = userId;
    if (!userId && !previous) return;
    let active = true;
    async function sync() {
      await applyReminder(false);
      if (!active || !userId || !(await getReminderEnabled(userId))) return;
      const permission = await Notifications.getPermissionsAsync();
      if (active && permission.granted) await applyReminder(true);
    }
    void sync().catch(console.error);
    return () => { active = false; };
  }, [userId]);

  useEffect(function openNotification() {
    if (!navigation?.key || !response) return;
    const request = response.notification.request;
    const id = `${request.identifier}:${response.notification.date}`;
    if (request.content.data?.screen !== 'pokedex' || handled.current === id) return;
    handled.current = id;
    router.replace(userId ? '/pokedex' : '/');
    void Notifications.clearLastNotificationResponseAsync().catch(console.error);
  }, [navigation?.key, response, router, userId]);

  return null;
}

export function NotificationSettings() {
  const { userId } = useAuth();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(function loadPreference() {
    let active = true;
    setEnabled(null);
    if (!userId) return;
    void getReminderEnabled(userId)
      .then((value) => { if (active) setEnabled(value); })
      .catch(() => {
        if (active) Alert.alert('Lembrete', 'Não foi possível carregar a preferência. Reabra o perfil para tentar novamente.');
      });
    return () => { active = false; };
  }, [userId]);

  async function changeReminder(value: boolean) {
    if (!userId || enabled === null || saving) return;
    setSaving(true);
    try {
      await saveReminder(userId, value, enabled);
      setEnabled(value);
    } catch (error) {
      Alert.alert('Lembrete', error instanceof Error ? error.message : 'Não foi possível alterar o lembrete.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <Text style={styles.title}>Lembrete de captura</Text>
        <Switch
          value={enabled === true}
          disabled={enabled === null || saving}
          onValueChange={(value) => void changeReminder(value)}
          trackColor={{ true: Colors.primary }}
          accessibilityLabel={`Receber lembrete de captura a cada ${REMINDER_SECONDS} segundos`}
        />
      </View>
      <Text style={styles.description}>
        Bora capturar mais Pokémon? Receba um lembrete a cada {REMINDER_SECONDS} segundos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { width: '100%', marginTop: 26, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { flex: 1, color: Colors.title, fontSize: 16, fontWeight: '800' },
  description: { color: Colors.subtitle, fontSize: 14, lineHeight: 21 },
});
