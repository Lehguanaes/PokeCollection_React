/*
 * Esta tela oferece entrada e criação de conta para o treinador.
 * Ela aparece na rota pública / dentro do layout de autenticação.
 * Valida credenciais, chama a API e adapta o formulário à tela.
 */
// Hooks e primitives do React Native constroem o formulário, sua responsividade e animações.
import React, { useEffect, useRef, useState } from 'react';
// O Axios permite reconhecer erros da API sem depender de um formato genérico de exceção.
import axios from 'axios';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
// Componentes compartilhados dão à entrada a mesma linguagem visual do restante do app.
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Alert } from '@/components/alert';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { Background } from '@/components/background';
// O contexto concentra as operações reais de autenticação e atualização da sessão.
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';

// Traduz falha de rede/API para um texto que o Alert da tela consegue mostrar.
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

// Normalizar antes de validar e enviar evita diferenças causadas por espaços ou letras maiúsculas.
function normalizeEmail(value: string) {
  return value.replace(/\s/g, '').toLowerCase();
}

// A checagem simples bloqueia formatos claramente inválidos sem tentar substituir a validação da API.
function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function App() {
  const { signIn, signUp } = useAuth();

  // loading inicial é só o splash da tela; depois também cobre o pedido de login/cadastro.

  // Estes estados guardam o andamento da tela e os valores digitados nos campos.
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  // Mesmo formulário serve para entrar ou cadastrar; o campo de e-mail só aparece no cadastro.
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Visibilidade e conteúdo são separados para o mesmo alerta atender qualquer falha de validação ou API.
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info',
  });

  useEffect(() => {
    // Delay curto só para o componente Loading aparecer na abertura.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Valida localmente antes da chamada remota e escolhe a operação conforme o modo do formulário.
  async function validateCredentials() {
    const normalizedEmail = normalizeEmail(email);
    // Interrompe cedo para que nenhum pedido incompleto seja enviado à API.
    if (!name.trim() || !senha.trim() || (mode === 'register' && !normalizedEmail)) {
      setAlertData({
        title: 'Campos obrigatorios',
        message:
          mode === 'register'
            ? 'Preencha usuario, senha e email.'
            : 'Informe usuario e senha para continuar.',
        type: 'warning',
      });
      setIsAlertVisible(true);
      return;
    }

    // O e-mail só é obrigatório e validado durante a criação de uma conta.
    if (mode === 'register' && !isValidEmail(normalizedEmail)) {
      setAlertData({
        title: 'Email invalido',
        message: 'Informe um email valido, por exemplo: nome@email.com.',
        type: 'warning',
      });
      setIsAlertVisible(true);
      return;
    }

    setLoading(true);

    // O carregamento permanece ativo no sucesso porque a troca de rota desmontará esta tela.
    try {
      // Sucesso: o AuthLayout redireciona para /pokedex porque isAuthenticated vira true.
      if (mode === 'register') {
        await signUp({
          username: name.trim(),
          password: senha,
          email: normalizedEmail,
        });
      } else {
        await signIn(name.trim(), senha);
      }
    } catch (error) {
      // Em caso de falha a tela volta a ficar interativa e explica o motivo no alerta.
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
  // Este limite troca a disposição lateral por uma coluna confortável em celulares estreitos.
  const IS_NARROW = width < 420;

  // Animações visuais do card e do Togepi; não fazem parte da autenticação.
  const scale = useRef(new Animated.Value(1)).current;
  const border = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // O movimento contínuo cria vida visual no personagem sem interferir nos campos.
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

  // Foco e desfoque reforçam visualmente qual campo está pronto para receber texto.
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

  // Valores derivados transformam a animação num estilo reutilizado por todos os inputs.
  const borderColor = border.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.inputBorder, Colors.primary],
  });

  const animatedStyle = {
    borderColor,
  };

  // O fragmento evita duplicar os mesmos campos nas composições móvel e desktop.
  const form = (
    <>
      <Input
        label="USUARIO OU E-MAIL"
        placeholder="Informe seu usuario ou e-mail"
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

      {/* Cadastro exige e-mail; login permanece menor e aceita envio pela senha. */}
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
            onSubmitEditing={validateCredentials}
            returnKeyType="done"
          />

        </>
      )}

      {/* A ação principal acompanha o modo e o controle abaixo permite alterná-lo. */}
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

  // O mesmo estado cobre o breve splash inicial e o processamento da autenticação.
  if (loading) {
    return <Loading />;
  }

  return (
    // A rolagem garante acesso ao formulário e aos avisos mesmo com teclado ou pouca altura.
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Fundo e cabeçalho são decorativos/estruturais; o menu fica oculto antes do login. */}
        <Background />
        <Header showMenu={false} />
        <View style={styles.content}>
          {/* O cartão responde ao foco dos campos e adapta a posição do personagem à largura. */}
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

            {/* Em telas estreitas o avatar fica acima; nas demais, ao lado do formulário. */}
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

        {/* Um único alerta apresenta validações locais e mensagens recebidas da API. */}
        <Alert
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          visible={isAlertVisible}
          onClose={() => setIsAlertVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  // Estrutura geral mantém fundo, conteúdo central e crescimento para ocupar a tela.
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 28,
  },

  // Cartão principal e pequenas diferenças de espaçamento entre celular e desktop.
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

  // Hierarquia textual e divisor visual identificam a entrada da aplicação.
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

  // Disposições alternativas posicionam personagem e formulário sem duplicar conteúdo.
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

  // Controle secundário oferece a troca entre login e cadastro sem competir com o botão principal.
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
