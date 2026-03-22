# CLAUDE.md — src/contexts/

Contextos React que gerenciam estado global da aplicação.

---

## AuthContext (`AuthContext.tsx`)

Único contexto da aplicação. Gerencia autenticação, sessão e perfil do usuário.

### Estado exposto

```ts
interface AuthContextData {
  user: User | null;          // objeto completo do usuário logado
  role: UserRole | null;      // 'user' | 'personal' | null
  loading: boolean;           // true enquanto verifica token salvo
  isFirstLogin: boolean;      // true se aluno (role:user) ainda não viu o onboarding
  signIn(email, password): Promise<void>;
  signUp(data): Promise<void>;
  signOut(): Promise<void>;
  refreshUser(): Promise<void>;
  dismissWelcome(): Promise<void>; // marca onboarding como visto e seta isFirstLogin=false
}
```

### Fluxo de inicialização

```
App abre
  → useEffect lê '@token' do AsyncStorage
  → se encontrar: GET /api/users/me
    → sucesso: setUser(me) + checkFirstLogin(me)
    → falha (token expirado): remove token
  → setLoading(false)
  → AppNavigator renderiza tela correta
```

### signIn

1. POST `/api/auth/login`
2. Salva `access_token` no AsyncStorage com chave `@token`
3. GET `/api/users/me` e seta `user`
4. Chama `checkFirstLogin(me)` — se `role === 'user'` e `@welcomeSeen:<id>` não existe, seta `isFirstLogin = true`

### signUp

1. POST `/api/auth/register` (sempre `role: 'personal'` — alunos são criados pelo personal)
2. Salva token
3. GET `/api/users/me` e seta `user`

### signOut

1. Remove `@token` do AsyncStorage
2. `setUser(null)` + `setIsFirstLogin(false)` → AppNavigator redireciona para Login

### refreshUser

Recarrega os dados do usuário logado sem fazer logout.
Usado na `ProfileScreen` após atualizar o perfil.

### dismissWelcome

Grava `@welcomeSeen:<userId>` no AsyncStorage e seta `isFirstLogin = false`.
Chamado pela `WelcomeScreen` ao clicar em "Começar" ou "Pular".

### Chave AsyncStorage de onboarding

```
@welcomeSeen:<userId>   →  'true'  (gravado após o aluno concluir ou pular o welcome)
```

Escopo por `userId`: se o mesmo dispositivo tiver contas diferentes, cada uma tem seu próprio estado.

### Como usar

```tsx
import { useAuth } from '../contexts/AuthContext';

const { user, role, signOut, refreshUser, isFirstLogin, dismissWelcome } = useAuth();
```

> O `AuthProvider` envolve todo o app em `App.tsx`.
