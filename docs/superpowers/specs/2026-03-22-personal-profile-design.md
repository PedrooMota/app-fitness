# Design: Perfil do Personal Trainer

**Data:** 2026-03-22
**Status:** Aprovado (revisado)

---

## Contexto

O Personal Trainer não possui tela de perfil. O único acesso ao logout está no header do Dashboard. O aluno (`role: user`) já tem uma tab "Perfil" com edição de dados. Esta feature equipara a experiência do personal, focando apenas nos dados relevantes para ele.

---

## Objetivo

Adicionar uma tab "Perfil" ao `PersonalNavigator` com:
- Visualização e edição de nome, e-mail e telefone
- Acesso ao logout
- Ícone personalizado (avatar com iniciais) na bottom tab bar

---

## Decisões de design

| Decisão | Escolha | Motivo |
|---|---|---|
| Posição do acesso ao perfil | Nova tab "Perfil" (3ª tab) | Consistência com o aluno; acesso permanente |
| Layout da tela | Estilo lista (iOS settings) | Mais limpo, separa seções claramente |
| Ícone da tab | Avatar circular com iniciais | Personalizado, identifica o usuário visualmente |
| Upload de foto | Não implementado | Fora de escopo |
| Campos editáveis | Nome, e-mail, telefone | Dados relevantes para o personal trainer |
| Dados físicos (peso, altura, idade) | Não expostos | Irrelevantes para o contexto do personal |

---

## Arquitetura

### Mudanças na API (`app-fitness-api`)

**1. Prisma schema** — adicionar campo `phone` ao modelo `User`:
```prisma
model User {
  // ... campos existentes ...
  phone String?
}
```

**2. Migration** — `npx prisma migrate dev --name add_phone_to_user`

**3. `UpdateUserDto`** — adicionar `email` e `phone`:
```ts
email?: string;   // IsOptional, IsEmail
phone?: string;   // IsOptional, IsString
```

**4. `users.service.ts`** — garantir que `updateMe` persiste `email` e `phone`

**5. Retorno de `GET /users/me`** — `phone` deve estar presente na resposta. Verificar o `select` ou `findUnique` em `users.service.ts`; se `phone` estiver ausente no objeto retornado, adicioná-lo explicitamente.

### Mudanças no app (`app-fitness`)

**Novos arquivos:**
- `src/screens/personal/ProfileScreen.tsx` — componente `PersonalProfileScreen`

**Arquivos modificados:**
- `src/api/users.ts` — adicionar `email` e `phone` ao `updateMe`
- `src/types/index.ts` — adicionar `phone?: string` ao `User`
- `src/navigation/PersonalNavigator.tsx` — nova tab + ícone avatar
- `src/navigation/types.ts` — **sem alteração**: `Perfil` é uma tab (BottomTab), não uma rota Stack; `PersonalStackParams` não precisa ser atualizado

---

## Tela: `PersonalProfileScreen`

### Estrutura de layout

```
KeyboardAvoidingView
  ScrollView
    ┌─ Header compacto ──────────────────────────┐
    │  [Avatar: círculo roxo com iniciais]        │
    │  Nome completo                              │
    │  email@exemplo.com                          │
    └─────────────────────────────────────────────┘

    ┌─ Card "Conta" ─────────────────────────────┐
    │  CONTA                        (label)       │
    │  [Input] Nome                               │
    │  [Input] E-mail                             │
    │  [Input] Telefone                           │
    └─────────────────────────────────────────────┘

    ┌─ Card "Plano" ──────────────────────────────┐
    │  PLANO ATUAL                  (label)       │
    │  Free / Pro                (read-only)      │
    └─────────────────────────────────────────────┘

    [Salvar alterações]   ← Button primary
    [Sair da conta]       ← Button outline
```

### Campos e validação

| Campo | Tipo | Editável | Validação |
|---|---|---|---|
| Nome | `string` | Sim | Obrigatório, trim |
| E-mail | `string` | Sim | Formato e-mail, obrigatório |
| Telefone | `string` | Sim | Opcional |
| Plano | `string` | Não | — |

### Estado local

```ts
name: string
email: string
phone: string
loading: boolean
```

### Comportamento

- Campos pré-preenchidos com os dados atuais do `user` (AuthContext)
- `handleSave`: chama `usersApi.updateMe()` → `refreshUser()` → `Alert.alert('Sucesso', 'Perfil atualizado!')`
- Erros exibidos via `Alert.alert('Erro', e.message)`
- `signOut`: chama `signOut()` do AuthContext → redireciona para Login

---

## Componente: Tab Avatar Icon

Componente inline dentro de `PersonalNavigator.tsx`.

- Lê `user.name` via `useAuth()`
- Quando focused: círculo `colors.primary` (roxo) com inicial branca
- Quando unfocused: círculo `colors.primaryLight` com inicial `colors.primary`
- O `icons` Record existente recebe guard para a rota "Perfil" (que usa avatar, não Ionicons)

---

## Mudanças no `PersonalNavigator`

1. Adicionar 3ª tab `name="Perfil"` com `component={PersonalProfileScreen}`
2. Ícone customizado com iniciais (inline, usa `useAuth()`)
3. Remover botão de logout do `DashboardScreen` (único ponto de logout existente) — sem substituto visual, header fica limpo

---

## Fora de escopo

- Upload de foto de perfil
- Alteração de senha
- Exclusão de conta
- Campos físicos (peso, altura, idade, gênero) — irrelevantes para personal trainer
