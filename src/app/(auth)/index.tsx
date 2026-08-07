import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Alert } from '@/components/alert';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { Background } from '@/components/background';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

function getAuthErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const apiMessage =
      typeof responseData === 'string' ? responseData : responseData?.message;

    if (apiMessage) {
      return apiMessage;
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return 'Usuario ou senha invalidos.';
    }

    if (error.message === 'Network Error') {
      return 'Nao foi possivel acessar a API de autenticacao. Verifique se o servico esta ativo e se a URL foi configurada corretamente.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Nao foi possivel concluir a acao. Confira os dados e tente novamente.';
}

function normalizeEmail(value: string) {
  return value.replace(/\s/g, '').toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 5) return digits;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function App() {
  const { signIn, signUp } = useAuth();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  async function validateCredentials() {
    const normalizedEmail = normalizeEmail(email);
    const cepDigits = cep.replace(/\D/g, '');

    if (
      !name.trim() ||
      !senha.trim() ||
      (mode === 'register' &&
        (!normalizedEmail || !cepDigits))
    ) {
      setAlertData({
        title: 'Campos obrigatorios',
        message:
          mode === 'register'
            ? 'Preencha usuario, senha, email e CEP.'
            : 'Informe usuario e senha para continuar.',
        type: 'warning',
      });
      setIsAlertVisible(true);
      return;
    }

    if (mode === 'register' && !isValidEmail(normalizedEmail)) {
      setAlertData({
        title: 'Email invalido',
        message: 'Informe um email valido, por exemplo: nome@email.com.',
        type: 'warning',
      });
      setIsAlertVisible(true);
      return;
    }

    if (mode === 'register' && cepDigits.length !== 8) {
      setAlertData({
        title: 'CEP invalido',
        message: 'O CEP precisa conter oito numeros.',
        type: 'warning',
      });
      setIsAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        await signUp({
          username: name.trim(),
          password: senha,
          email: normalizedEmail,
          cep: cepDigits,
        });
      } else {
        await signIn(name.trim(), senha);
      }
    } catch (error) {
      console.error('Erro de autenticacao:', error);

      setAlertData({
        title: mode === 'register' ? 'Erro no cadastro' : 'Erro de login',
        message: getAuthErrorMessage(error),
        type: 'error',
      });
      setIsAlertVisible(true);
      setLoading(false);
    }
  }

  const { width } = useWindowDimensions();
  const IS_NARROW = width < 420;

  const scale = useRef(new Animated.Value(1)).current;
  const border = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onFocus = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.02,
        useNativeDriver: true,
      }),
      Animated.timing(border, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onBlur = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(border, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const borderColor = border.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.inputBorder, Colors.primary],
  });

  const animatedStyle = {
    borderColor,
  };

  const form = (
    <>
      <Input
        label="USUARIO"
        placeholder="Informe seu usuario"
        value={name}
        onChangeText={setName}
        onFocus={onFocus}
        onBlur={onBlur}
        animatedStyle={animatedStyle}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />

      <Input
        label="SENHA"
        placeholder="Informe sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        onFocus={onFocus}
        onBlur={onBlur}
        animatedStyle={animatedStyle}
        onSubmitEditing={mode === 'login' ? validateCredentials : undefined}
        returnKeyType={mode === 'login' ? 'done' : 'next'}
      />

      {mode === 'register' && (
        <>
          <Input
            label="EMAIL"
            placeholder="Informe seu email"
            value={email}
            onChangeText={(value) => setEmail(normalizeEmail(value))}
            onFocus={onFocus}
            onBlur={onBlur}
            animatedStyle={animatedStyle}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
          />

          <Input
            label="CEP"
            placeholder="00000-000"
            value={cep}
            onChangeText={(value) => setCep(formatCep(value))}
            onFocus={onFocus}
            onBlur={onBlur}
            animatedStyle={animatedStyle}
            keyboardType="numeric"
            maxLength={9}
            onSubmitEditing={validateCredentials}
            returnKeyType="done"
          />
        </>
      )}

      <Button
        title={mode === 'register' ? 'Cadastrar' : 'Entrar'}
        onPress={validateCredentials}
      />

      <Pressable
        style={styles.modeButton}
        onPress={() =>
          setMode((current) => (current === 'login' ? 'register' : 'login'))
        }
      >
        <Text style={styles.modeText}>
          {mode === 'register' ? 'Ja tenho conta' : 'Criar conta'}
        </Text>
      </Pressable>
    </>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Background />
      <Header showMenu={false} />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.card,
            IS_NARROW ? styles.cardMobile : styles.cardDesktop,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <Text style={styles.title}>PokeCollection</Text>

          <View style={styles.line} />

          <Text style={styles.subtitle}>
            {mode === 'register'
              ? 'Crie sua conta para comecar'
              : 'Faca login para acessar a colecao'}
          </Text>

          {IS_NARROW ? (
            <>
              <View style={styles.avatarCenter}>
                <Animated.Image
                  source={{
                    uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png',
                  }}
                  style={[
                    styles.avatar,
                    {
                      transform: [{ translateY: floatAnim }],
                    },
                  ]}
                />
              </View>

              <View style={styles.inputColumn}>{form}</View>
            </>
          ) : (
            <View style={styles.bodyRow}>
              <Animated.Image
                source={{
                  uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png',
                }}
                style={[
                  styles.avatar,
                  {
                    transform: [{ translateY: floatAnim }],
                  },
                ]}
              />

              <View style={styles.inputArea}>{form}</View>
            </View>
          )}
        </Animated.View>
      </View>

      <Footer />

      <Alert
        title={alertData.title}
        message={alertData.message}
        type={alertData.type}
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  card: {
    width: '100%',
    maxWidth: 620,
    padding: 24,
    borderRadius: 26,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    alignSelf: 'center',
  },

  cardMobile: {
    marginTop: 5,
  },

  cardDesktop: {
    marginTop: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.title,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: Colors.subtitle,
    marginBottom: 16,
    textAlign: 'center',
  },

  line: {
    width: 200,
    height: 5,
    backgroundColor: Colors.secondary,
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 3,
  },

  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputArea: {
    flex: 1,
    marginLeft: 20,
  },

  inputColumn: {
    width: '100%',
  },

  avatarCenter: {
    alignItems: 'center',
    marginBottom: 16,
  },

  avatar: {
    width: 160,
    height: 160,
  },

  modeButton: {
    marginTop: 14,
    alignItems: 'center',
  },

  modeText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
