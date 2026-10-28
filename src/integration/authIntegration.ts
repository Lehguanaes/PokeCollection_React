/*
 * Esta integração conecta o aplicativo ao serviço de autenticação.
 * Ela é consumida pelo AuthContext nos fluxos de acesso e cadastro.
 * Ela envia credenciais, valida sessões e solicita o encerramento remoto.
 */
import axios from 'axios';

// Endereço público usado quando nenhum ambiente fornece uma API alternativa.
// Manter o caminho-base aqui permite que as funções abaixo informem só suas rotas.
const DEFAULT_AUTH_API_URL = 'https://login-p26w.onrender.com/fatec/login';

// Resolve a URL da API de login/cadastro no carregamento do módulo. No Expo,
// variáveis EXPO_PUBLIC_* entram no bundle; a barra final é retirada para evitar
// separadores duplicados ao concatenar as rotas declaradas nas requisições.
export const AUTH_API_URL =
  process.env.EXPO_PUBLIC_AUTH_API_URL?.replace(/\/$/, '') ||
  DEFAULT_AUTH_API_URL;

// Compartilha configuração entre todas as requisições de autenticação. O envio de
// credenciais permite ao cliente receber e reenviar o cookie de sessão HttpOnly;
// assim, o aplicativo nunca precisa acessar nem armazenar diretamente o JWT.
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
});

// Dados exigidos pelo endpoint de cadastro. O tipo também é exportado para que o
// formulário e o contexto entreguem exatamente o contrato esperado pela integração.
export type RegisterAuthUserInput = {
  username: string;
  password: string;
  email: string;
};

// Representação devolvida após criar uma conta, incluindo os dados persistidos e
// os papéis definidos pelo servidor para o novo usuário.
export type RegisteredAuthUser = {
  id: string;
  username: string;
  email: string;
  roles: string[];
};

// Recorte da resposta de login necessário para construir a sessão em memória e
// identificar a coleção local pertencente ao usuário autenticado.
export type AuthenticatedUser = {
  userId: string;
  username: string;
  roles: string[];
};

// Faz validação em tempo de execução porque o parâmetro genérico do Axios só
// informa o TypeScript e não garante o conteúdo real recebido pela rede. Exige ids
// e nomes não vazios e uma lista de papéis antes de o dado alcançar o contexto.
function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  if (!value || typeof value !== 'object') return false;

  const user = value as Partial<AuthenticatedUser>;
  return (
    typeof user.userId === 'string' &&
    Boolean(user.userId.trim()) &&
    typeof user.username === 'string' &&
    Boolean(user.username.trim()) &&
    Array.isArray(user.roles)
  );
}

// Envia as credenciais ao endpoint de login. O servidor estabelece a sessão por
// cookie e devolve o perfil usado pela aplicação; respostas fora do contrato são
// rejeitadas para não criar uma sessão local incompleta ou sem identidade válida.
export async function loginAuthUser(username: string, password: string) {
  const response = await authApi.post<AuthenticatedUser>('/v1/auth', {
    username,
    password,
  });

  // A validação fecha a fronteira entre dado externo não confiável e o formato
  // que o AuthContext pode assumir como seguro ao atualizar a interface.
  if (!isAuthenticatedUser(response.data)) {
    throw new Error('A API retornou uma sessao invalida.');
  }

  return response.data;
}

// Cria a conta com o objeto do formulário sem remodelá-lo. O cadastro não implica
// sessão autenticada neste endpoint; o AuthContext realiza o login separadamente.
export async function registerAuthUser(
  input: RegisterAuthUserInput
): Promise<RegisteredAuthUser> {
  const response = await authApi.post<RegisteredAuthUser>('/v1/create', input);

  return response.data;
}

// Solicita ao servidor a invalidação do cookie de sessão. Não há corpo útil na
// resposta, portanto a função apenas aguarda o término ou propaga a falha de rede.
export async function logoutAuthUser() {
  await authApi.post('/v1/auth/logout');
}
