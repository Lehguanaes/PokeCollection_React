<div align="center">

<img src="assets/images/icon.png" width="120" alt="PokeCollection Logo" />

# PokeCollection

### Capture, organize e evolua sua coleção Pokémon em uma experiência interativa feita com React Native + Expo

<br>

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br>

🔗 **Acesse a aplicação:**  
### [pokecollectionreact.vercel.app](https://pokecollectionreact.vercel.app/)

<br>

> Uma Pokédex viva, com login real, perfil de treinador, capturas, time personalizado, animações e integração com API.

</div>

---

## 🌟 Sobre o Projeto

O **PokeCollection** nasceu como uma atividade prática de estudos em **React Native** e **Expo**, mas evoluiu para uma aplicação completa, visual e interativa inspirada no universo Pokémon.

A proposta é simples e divertida: permitir que o usuário explore uma Pokédex, capture Pokémon, monte seu time e acompanhe seus status de treinador.

Nesta versão, o projeto deixou de ser apenas uma interface com login fixo e passou a contar com:

✅ autenticação real;  
✅ integração com API externa;  
✅ dados persistidos por usuário;  
✅ perfil dinâmico;  
✅ time personalizado;  
✅ capturas reais;  
✅ animações e feedbacks visuais.

---

## 🧭 Experiência do Usuário

<div align="center">

| Tela | Experiência |
| --- | --- |
| 🔐 **Login e Cadastro** | Criação de conta e autenticação com API real |
| 👤 **Perfil** | Status do treinador, vitórias, derrotas, nível e progresso |
| 📘 **Pokédex** | Listagem dos 151 primeiros Pokémon |
| 🎯 **Captura** | Captura integrada à API com animação de Pokébola |
| ⚔️ **Meu Time** | Visualização e troca dos Pokémon do time |
| 💬 **Alertas** | Confirmações, erros e sucessos com componente próprio |

</div>

---

## 🚀 Principais Funcionalidades

### 🔐 Autenticação

- Cadastro de novos usuários.
- Login com credenciais reais.
- Sessão persistida com `AsyncStorage`.
- Armazenamento do `userId` retornado pela API.

### 👤 Perfil do Treinador

- Exibição de nome, nível, vitórias e derrotas.
- Cálculo visual de aproveitamento.
- Barra de experiência.
- Registro de vitória ou derrota com alerta de confirmação.

### 📘 Pokédex Interativa

- Listagem dos 151 primeiros Pokémon.
- Cards responsivos e animados.
- Cores e efeitos baseados no tipo do Pokémon.
- Botão de captura com estado inteligente:
  - `Capturar`;
  - `Capturando...`;
  - `Capturado`.

### 🎯 Animação de Captura

Ao capturar um Pokémon, a interface executa uma animação especial:

1. A ação é confirmada pelo usuário.
2. O botão é desabilitado para evitar clique duplo.
3. Uma Pokébola criada em **CSS puro** aparece.
4. A Pokébola sobe até o centro do card.
5. O card pulsa e é sugado visualmente.
6. A Pokébola balança.
7. Surge a mensagem **Capturado!**
8. O botão muda para **Capturado**.

Tudo isso sem imagens externas e sem bibliotecas extras.

### ⚔️ Time Pokémon

- Time carregado diretamente da API.
- Pokémon capturados separados do time principal.
- Escolha do Pokémon que vai sair.
- Troca por Pokémon capturado.
- Remoção de capturados.
- Confirmação antes de qualquer alteração.

---

## 🧩 Integrações

### 🧪 API do Professor

Responsável por autenticação, perfil, time e capturas.

```txt
https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon
```
<div align="center">
  
| Recurso | Método | Endpoint |
| --- | --- | --- |
| 🔐 Cadastro | `POST` | `/auth/v1/register` |
| 🔑 Login | `POST` | `/auth/v1/login` |
| 👤 Buscar perfil | `GET` | `/auth/v1/stats/{userId}` |
| 📈 Atualizar perfil | `PUT` | `/auth/v1/stats/{userId}` |
| ⚔️ Buscar time | `GET` | `/pokemon/v1/team?user-id={userId}` |
| 🔁 Trocar Pokémon | `PUT` | `/pokemon/v1/team?user-id={userId}` |
| 🎯 Capturar Pokémon | `PUT` | `/pokemon/v1/captured?user-id={userId}&pokemon-id={pokemonId}` |
| 🗑️ Remover capturado | `DELETE` | `/pokemon/v1/captured?user-id={userId}&pokemon-id={pokemonId}` |

</div>

### 🌐 PokeAPI

Responsável pelos dados públicos dos Pokémon.

```txt
https://pokeapi.co/api/v2
```

---

## 🛠️ Tecnologias

<div align="center">

| Tecnologia | Uso no Projeto |
| --- | --- |
| ⚛️ **React Native** | Construção da interface |
| 🚀 **Expo** | Desenvolvimento e execução multiplataforma |
| 🧭 **Expo Router** | Navegação entre telas |
| 🔷 **TypeScript** | Tipagem e segurança |
| 🌐 **Axios** | Requisições HTTP |
| 💾 **AsyncStorage** | Persistência da sessão |
| 🖥️ **React Native Web** | Versão web da aplicação |
| ▲ **Vercel** | Deploy da versão web |
| 📘 **PokeAPI** | Dados públicos dos Pokémon |

</div>

---

## 📁 Estrutura do Projeto

```txt
PokeCollection/
├── assets/
│   └── images/
│
├── src/
│   ├── @types/
│   │   └── pokemon.ts
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── index.tsx
│   │   └── (app)/
│   │       ├── pokedex.tsx
│   │       ├── profile.tsx
│   │       └── team.tsx
│   │
│   ├── components/
│   │   ├── alert/
│   │   ├── background/
│   │   ├── button/
│   │   ├── card/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── input/
│   │   ├── list/
│   │   ├── loading/
│   │   └── menu/
│   │
│   ├── constants/
│   ├── context/
│   │   └── AuthContext.tsx
│   └── integration/
│       └── pokemonIntegration.ts
│
├── app.json
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## ⚙️ Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Acesse a pasta do app

```bash
cd PokeCollection
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Execute no navegador

```bash
npm run web
```

### 5. Execute no Android

```bash
npm run android
```

### 6. Execute no iOS

```bash
npm run ios
```

---

## 📜 Scripts

<div align="center">
  
| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o Expo |
| `npm run web` | Executa a versão web |
| `npm run android` | Executa no Android |
| `npm run ios` | Executa no iOS |

</div>

---

## ▲ Deploy

O projeto utiliza a **Vercel** para hospedagem da versão web.

```txt
vercel.json
```

🔗 **Aplicação publicada:**  
[pokecollectionreact.vercel.app](https://pokecollectionreact.vercel.app/)

---

<div align="center">

## 🖼️ Demonstração

### 📱 Responsividade com Expo Go

<img width="700" alt="Ambiente IDE" src="https://github.com/user-attachments/assets/06efdaf3-ef85-4332-8d8e-78d4119f8645" />

<br><br>

### 🖥️ Responsividade Web Local

<img width="700" alt="Demonstrando Responsividade" src="https://github.com/user-attachments/assets/9ac069ec-3763-46af-84a9-f3ea2aa21235" />

<br><br>

### 🌐 Deploy Concluído

<img width="700" alt="Deploy Concluido" src="https://github.com/user-attachments/assets/b27e7751-2f60-4bea-9f90-fcdb98705416" />

<br><br>

### 💬 Alertas em Web e Android

<img width="300" alt="Alerta Web" src="https://github.com/user-attachments/assets/bba68e06-e431-47d5-9355-65eb0cf4a818" />

<br><br>

<img width="300" alt="Alerta Android" src="https://github.com/user-attachments/assets/42a21243-72f4-4a24-a44a-08c04b8e35eb" />

</div>

---

## 🧠 Aprendizados

Durante o desenvolvimento, o projeto permitiu praticar:

- estruturação de aplicações React Native;
- componentização;
- responsividade web/mobile;
- navegação com Expo Router;
- consumo de APIs REST;
- autenticação e persistência de sessão;
- manipulação de listas;
- feedback visual para ações do usuário;
- criação de alertas customizados;
- animações com React Native e CSS;
- acessibilidade com `prefers-reduced-motion`;
- deploy web com Vercel.

---

## 👨‍💻 Desenvolvedores

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/ErickFLM">
        <img src="https://avatars.githubusercontent.com/u/131476329?v=4" width="135px;" alt="Erick Ferreira - Github"/><br>
        <sub><b>Erick Ferreira</b></sub><br>
      </a>
      <sub>
        <a href="mailto:erickferreiralima001@gmail.com">erickferreiralima001@gmail.com</a>
      </sub><br>
    </td>
    <td align="center">
      <a href="https://github.com/Lehguanaes">
        <img src="https://avatars.githubusercontent.com/u/125403978?v=4" width="135px;" alt="Letícia Guanaes - Github"/><br>
        <sub><b>Letícia Guanaes</b></sub><br>
      </a>
      <sub>
        <a href="mailto:lehguanaes@gmail.com">lehguanaes@gmail.com</a>
      </sub><br>
    </td>
  </tr>
</table>

---

<div align="center">

### 🎓 Orientação

Trabalho orientado por **Professor Kleber Nunes**.

### 🏫 Instituição

**Fatec Zona Leste**

<br>

</div>
