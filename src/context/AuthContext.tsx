/*
 * Este contexto representa a sessão autenticada do aplicativo.
 * Ele está presente no provider raiz e é consumido pelas telas e pela coleção.
 * Ele coordena cadastro, entrada, saída e distribuição dos dados do usuário.
 */
import React, { createContext, useContext, useState } from 'react';
import {
  AuthenticatedUser,
  loginAuthUser,
  logoutAuthUser,
  RegisterAuthUserInput,
  registerAuthUser,
} from '@/integration/authIntegration';

// Recorte da identidade autenticada que permanece em memória. O id vincula dados
// locais à conta correta, o nome alimenta a interface e os papéis permitem decisões
// de autorização sem guardar senha, cookie ou a resposta inteira da integração.
type AuthSession = {
  userId: string;
  username: string;
  roles: string[];
};

// Contrato publicado pelo provider para toda a árvore. Além do estado derivado da
// sessão, expõe operações assíncronas para que telas não conheçam Axios, endpoints
// ou a forma como o login é representado internamente.
type AuthContextData = {
  isAuthenticated: boolean;
  user: string | null;
  userId: string | null;
  roles: string[];
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (input: RegisterAuthUserInput) => Promise<void>;
  signOut: () => Promise<void>;
};

// O contexto nasce com uma asserção de tipo porque o valor real sempre é fornecido
// pelo layout raiz. O hook abaixo concentra o acesso usado pelos consumidores.
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Coordena o fluxo de autenticação entre a integração e as telas: ações chamam a
// API, respostas válidas viram `session`, e cada render deriva desse estado o valor
// distribuído aos descendentes. O JWT continua no cookie HttpOnly administrado
// pela API; este provider guarda apenas o perfil necessário durante o processo.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // `null` é a fonte única de verdade para uma sessão não autenticada. Atualizar
  // este estado provoca a propagação imediata do novo usuário a todos os contextos
  // e componentes que consomem `useAuth`.
  const [session, setSession] = useState<AuthSession | null>(null);
  // Hoje não há restauração assíncrona da sessão ao abrir o app, então o provider
  // começa pronto. O campo permanece no contrato para as telas tratarem loading de
  // autenticação de forma uniforme caso esse fluxo seja incorporado posteriormente.
  const [isLoading] = useState(false);

  // Copia somente os campos aprovados pela integração para o estado interno. A
  // função explicita a fronteira entre a resposta autenticada e a sessão exposta.
  function createSession(authenticatedUser: AuthenticatedUser): AuthSession {
    return {
      userId: authenticatedUser.userId,
      username: authenticatedUser.username,
      roles: authenticatedUser.roles,
    };
  }

  // Encaminha as credenciais para a integração e só publica a sessão depois que a
  // requisição conclui e valida sua resposta. Erros permanecem rejeitados para que
  // o formulário decida como apresentá-los sem autenticar parcialmente o usuário.
  async function signIn(username: string, password: string) {
    const authenticatedUser = await loginAuthUser(username, password);
    setSession(createSession(authenticatedUser));
  }

  // Executa cadastro e login em sequência. A sessão só muda quando ambas as etapas
  // terminam com sucesso, permitindo que uma conta recém-criada entre diretamente
  // no aplicativo sem duplicar essa orquestração nas telas.
  async function signUp(input: RegisterAuthUserInput) {
    await registerAuthUser(input);
    const authenticatedUser = await loginAuthUser(input.username, input.password);
    setSession(createSession(authenticatedUser));
  }

  // Encerra primeiro a visão local da sessão para que toda a árvore reaja sem
  // esperar a rede. Depois solicita a invalidação remota do cookie em melhor esforço.
  async function signOut() {
    // Limpar `session` também faz o CollectionProvider abandonar imediatamente a
    // coleção da conta que acabou de sair.
    setSession(null);

    try {
      await logoutAuthUser();
    } catch {
      // A falha remota é intencionalmente absorvida: restaurar a sessão local depois
      // de a interface já ter saído seria mais surpreendente do que manter o logout.
    }
  }

  // Deriva os campos públicos a cada render. Nenhum consumidor recebe o objeto
  // mutável `session`; valores nulos e listas vazias descrevem explicitamente a
  // ausência de autenticação, enquanto as ações fecham o ciclo de atualização.
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session),
        user: session?.username ?? null,
        userId: session?.userId ?? null,
        roles: session?.roles ?? [],
        signIn,
        signUp,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Ponto único de consumo do contexto, evitando que componentes importem e leiam
// diretamente sua implementação.
export const useAuth = () => useContext(AuthContext);
