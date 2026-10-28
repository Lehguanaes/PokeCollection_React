/*
 * Tela de inspeção do AsyncStorage para demonstração em desenvolvimento.
 * Mostra no próprio Android os dados persistidos localmente pelo aplicativo.
 */
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Database, RefreshCw } from 'lucide-react-native';

import { Button } from '@/components/button';
import { Header } from '@/components/header';
import { Heading } from '@/components/heading';
import { Screen } from '@/components/screen';
import { Colors } from '@/constants/colors';

type StorageEntry = {
  key: string;
  value: string | null;
};

const COLLECTION_KEY_PREFIX = '@poke-collection/collection/';

function formatStorageValue(value: string | null) {
  if (value === null) return 'null';

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function StorageInspector() {
  const [entries, setEntries] = useState<StorageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const loadStorage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);
      const nextEntries = values
        .map(([key, value]) => ({ key, value }))
        .sort((first, second) => {
          const firstIsCollection = first.key.startsWith(COLLECTION_KEY_PREFIX);
          const secondIsCollection = second.key.startsWith(COLLECTION_KEY_PREFIX);

          if (firstIsCollection !== secondIsCollection) {
            return firstIsCollection ? -1 : 1;
          }

          return first.key.localeCompare(second.key);
        });

      setEntries(nextEntries);
      setExpandedKeys(
        new Set(
          nextEntries
            .filter((entry) => entry.key.startsWith(COLLECTION_KEY_PREFIX))
            .map((entry) => entry.key)
        )
      );
    } catch {
      setError('Não foi possível ler o AsyncStorage deste aparelho.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStorage();
  }, [loadStorage]);

  function toggleKey(key: string) {
    setExpandedKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <Screen>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <Heading
          title="AsyncStorage"
          subtitle="Dados persistidos localmente neste aparelho"
          icon={Database}
          variant="compact"
          style={styles.heading}
        />

        <View style={styles.toolbar}>
          <Text style={styles.summary}>
            {entries.length} {entries.length === 1 ? 'chave encontrada' : 'chaves encontradas'}
          </Text>
          <Button
            title="Atualizar"
            icon={<RefreshCw size={16} color={Colors.white} />}
            size="small"
            fullWidth={false}
            onPress={() => void loadStorage()}
            loading={loading}
          />
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.stateText}>Lendo AsyncStorage...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : entries.length ? (
          <View style={styles.entries}>
            {entries.map((entry) => {
              const expanded = expandedKeys.has(entry.key);
              const isCollection = entry.key.startsWith(COLLECTION_KEY_PREFIX);

              return (
                <View
                  key={entry.key}
                  style={[
                    styles.entryCard,
                    isCollection && styles.collectionEntry,
                  ]}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.entryHeader,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => toggleKey(entry.key)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                  >
                    <View style={styles.entryTitle}>
                      <Text style={styles.entryKey}>{entry.key}</Text>
                      {isCollection ? (
                        <Text style={styles.collectionBadge}>Coleção Pokémon</Text>
                      ) : null}
                    </View>
                    <Text style={styles.expandText}>
                      {expanded ? 'Ocultar' : 'Ver JSON'}
                    </Text>
                  </Pressable>

                  {expanded ? (
                    <View style={styles.valueBox}>
                      <ScrollView
                        nestedScrollEnabled
                        style={styles.valueScroller}
                        contentContainerStyle={styles.valueContent}
                      >
                        <Text selectable style={styles.valueText}>
                          {formatStorageValue(entry.value)}
                        </Text>
                      </ScrollView>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>
              Nenhuma chave encontrada no AsyncStorage deste aparelho.
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
  },
  heading: {
    marginTop: 24,
    marginBottom: 18,
  },
  toolbar: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    maxWidth: 900,
    paddingHorizontal: 20,
    width: '100%',
  },
  summary: {
    color: Colors.subtitle,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  entries: {
    alignSelf: 'center',
    gap: 14,
    marginTop: 18,
    maxWidth: 900,
    paddingHorizontal: 20,
    width: '100%',
  },
  entryCard: {
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
    borderRadius: 18,
    borderWidth: 2,
    overflow: 'hidden',
  },
  collectionEntry: {
    borderColor: Colors.primary,
  },
  entryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 14,
  },
  entryTitle: {
    flex: 1,
    gap: 7,
  },
  entryKey: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  collectionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.semantic.success.bg,
    borderColor: Colors.semantic.success.border,
    borderRadius: 999,
    borderWidth: 1,
    color: Colors.semantic.success.text,
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 9,
    paddingVertical: 4,
    textTransform: 'uppercase',
  },
  expandText: {
    color: Colors.label,
    fontSize: 12,
    fontWeight: '900',
  },
  valueBox: {
    backgroundColor: Colors.gray[100],
    borderTopColor: Colors.inputBorder,
    borderTopWidth: 1,
    height: 360,
  },
  valueScroller: {
    flex: 1,
  },
  valueContent: {
    padding: 14,
    paddingBottom: 28,
  },
  valueText: {
    color: Colors.text,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  stateCard: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
    borderRadius: 18,
    borderWidth: 2,
    gap: 10,
    marginTop: 18,
    maxWidth: 900,
    padding: 24,
    width: '90%',
  },
  stateText: {
    color: Colors.subtitle,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorText: {
    color: Colors.semantic.error.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
});
