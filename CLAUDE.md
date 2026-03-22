# CLAUDE.md — app-fitness (Mobile)

## Visão geral

App mobile de fitness desenvolvido em **React Native + Expo SDK 54 + TypeScript**.
Consome a API REST em `../app-fitness-api` (NestJS).

Dois perfis de acesso:
- **Personal Trainer** (`role: personal`) — gerencia alunos, cria treinos e dietas
- **Aluno** (`role: user`) — visualiza treinos/dietas prescritos e registra histórico

> Alunos **não se cadastram** pelo app. São criados pelo personal via "Convidar aluno".

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0.0 | Toolchain e SDK |
| TypeScript | ^5.3.3 | Tipagem estática |
| React Navigation | ^7 | Navegação (Stack + BottomTabs) |
| Axios | latest | Cliente HTTP |
| AsyncStorage | latest | Persistência local do JWT e controle de onboarding |
| @expo/vector-icons | built-in | Ícones (Ionicons) |

---

## Como rodar

```bash
# Inicie o app (a API já está em produção no Render)
cd app-fitness
npx expo start

# Escaneie o QR com o Expo Go (iOS/Android)
# ou pressione 'a' para Android emulador / 'i' para iOS simulator
```

---

## URL da API

A API está hospedada no **Render** e configurada em `src/api/client.ts`:

```ts
const BASE_URL = 'https://app-fitness-api.onrender.com/api';
```

> **Desenvolvimento local:** altere `BASE_URL` para o IP da sua máquina (ex: `http://192.168.x.x:3000/api`).
> Para descobrir o IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux).
> Certifique-se que a API está rodando: `cd ../app-fitness-api && npm run start:dev`

---

## Estrutura de pastas

```
app-fitness/
├── App.tsx                  # Entry point — AuthProvider + AppNavigator
├── index.ts                 # Registro do componente raiz (Expo)
├── app.json                 # Configuração do Expo
├── src/
│   ├── api/                 # Módulos de chamada à API REST
│   ├── components/          # Componentes reutilizáveis (Button, Input, Card)
│   ├── contexts/            # AuthContext — estado global de autenticação
│   ├── navigation/          # Navegação (App, Personal, User)
│   ├── screens/
│   │   ├── auth/            # Login e Registro (apenas personal)
│   │   ├── personal/        # Telas do personal trainer
│   │   └── user/            # Telas do aluno
│   ├── types/               # Interfaces e tipos TypeScript
│   └── theme.ts             # Paleta de cores centralizada
```

---

## Fluxo de autenticação

1. App abre → `AuthContext` verifica token no `AsyncStorage`
2. Se token válido → busca `/api/users/me` → define `user` no contexto
3. Se `role: user`, verifica `@welcomeSeen:<userId>` no AsyncStorage → define `isFirstLogin`
4. `AppNavigator` decide qual navigator renderizar:
   - Sem usuário → `AuthNavigator` (Login / Register)
   - `role: personal` → `PersonalNavigator`
   - `role: user` + `isFirstLogin = true` → `WelcomeScreen` (onboarding 3 slides)
   - `role: user` + `isFirstLogin = false` → `UserNavigator`
5. Logout → remove token do `AsyncStorage`, limpa `user` e `isFirstLogin` no contexto

### Onboarding (WelcomeScreen)

Exibido **uma única vez** para alunos no primeiro login. Controlado por `AsyncStorage`:
- Chave: `@welcomeSeen:<userId>` — gravada ao clicar em "Começar" ou "Pular"
- Escopo por usuário — múltiplos usuários no mesmo dispositivo têm estados independentes

---

## Convenções de código

- Todos os arquivos usam **TypeScript** (`.ts` / `.tsx`)
- Componentes de tela são **React.FC** com tipagem explícita de props via `NativeStackScreenProps`
- Estilos via **StyleSheet.create** inline no mesmo arquivo da tela
- Cores **sempre** importadas de `src/theme.ts` — nunca valores hardcoded
- Chamadas à API **sempre** via funções em `src/api/` — nunca axios direto nas telas
- Dados carregados com `useFocusEffect` para recarregar ao voltar à tela

---

## Navegação por role

### Personal Trainer
```
PersonalNavigator (Stack)
├── Tabs (BottomTab)
│   ├── Dashboard        — resumo geral
│   └── Time             — lista de alunos
├── InviteUser           — convidar novo aluno
├── ClientDetail         — treinos e dietas do aluno
├── CreateWorkout        — criar treino para aluno
├── WorkoutDetail        — detalhe/exclusão de treino
├── CreateDiet           — criar plano de dieta para aluno
└── DietDetail           — detalhe/exclusão de dieta
```

### Aluno
```
WelcomeScreen            — onboarding 3 slides (somente no primeiro login)
UserNavigator (Stack)
├── Tabs (BottomTab)
│   ├── Dashboard        — resumo e stats
│   ├── Treinos          — lista de treinos prescritos
│   ├── Dieta            — lista de planos de dieta
│   ├── Histórico        — registros de treinos realizados
│   └── Perfil           — editar dados pessoais / logout
├── WorkoutDetail        — detalhe do treino prescrito
├── LogWorkout           — registrar treino realizado
└── DietDetail           — detalhe do plano de dieta com macros
```
