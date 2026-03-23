# Design: Perfil do Personal Trainer

**Data:** 2026-03-22
**Status:** Aprovado

---

## Contexto

O Personal Trainer não possui tela de perfil. O único acesso ao logout está no header do Dashboard. O aluno (`role: user`) já tem uma tab "Perfil" com edição de dados. Esta feature equipara a experiência do personal.

---

## Objetivo

Adicionar uma tab "Perfil" ao `PersonalNavigator` com:
- Visualização e edição dos dados do personal trainer
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
| Campos editáveis | Nome, peso, altura, idade | Suportados pela API atual |
| E-mail | Somente leitura | API não suporta alteração de e-mail |

---

## Arquitetura

### Novos arquivos

**`src/screens/personal/ProfileScreen.tsx`**
Tela de perfil do personal trainer. Componente `PersonalProfileScreen`.

### Arquivos modificados

**`src/navigation/PersonalNavigator.tsx`**
- Importa `PersonalProfileScreen`
- Adiciona tab "Perfil" ao `PersonalTabs`
- Adiciona ícone customizado `TabAvatarIcon` para essa tab

**`src/navigation/types.ts`**
- Nenhuma alteração necessária (tab não recebe params)

---

## Tela: `PersonalProfileScreen`

### Estrutura de layout

```
KeyboardAvoidingView
  ScrollView
    ┌─ Header compacto ──────────────────────────┐
    │  [Avatar: círculo roxo com iniciais]        │
    │  Nome completo                              │
    │  email@exemplo.com  (read-only)             │
    └─────────────────────────────────────────────┘

    ┌─ Card "Conta" ─────────────────────────────┐
    │  CONTA                        (label)       │
    │  Nome          Pedro Mota  ›               │
    └─────────────────────────────────────────────┘

    ┌─ Card "Dados físicos" ──────────────────────┐
    │  DADOS FÍSICOS                (label)       │
    │  Peso (kg)     —           ›               │
    │  Altura (cm)   —           ›               │
    │  Idade         —           ›               │
    └─────────────────────────────────────────────┘

    ┌─ Card "Plano" ──────────────────────────────┐
    │  PLANO ATUAL                  (label)       │
    │  Free / Pro                (read-only)      │
    └─────────────────────────────────────────────┘

    [Salvar alterações]   ← Button primary
    [Sair da conta]       ← Button outline/danger
```

### Campos e validação

| Campo | Tipo | Editável | Validação |
|---|---|---|---|
| Nome | `string` | Sim | Obrigatório, trim |
| E-mail | `string` | Não | — |
| Peso | `number` | Sim | Numérico, opcional |
| Altura | `number` | Sim | Numérico, opcional |
| Idade | `number` | Sim | Numérico, opcional |
| Plano | `string` | Não | — |

### Comportamento

- Campos pré-preenchidos com os dados atuais do `user` (AuthContext)
- `handleSave`: chama `usersApi.updateMe()` → `refreshUser()` → `Alert.alert('Sucesso', 'Perfil atualizado!')`
- Erros exibidos via `Alert.alert('Erro', e.message)`
- `signOut`: chama `signOut()` do AuthContext → redireciona para Login

### Estado local

```ts
name: string
weight: string
height: string
age: string
loading: boolean
```

---

## Componente: Tab Avatar Icon

Componente inline dentro de `PersonalNavigator.tsx` (não precisa de arquivo separado — é simples o suficiente).

```tsx
// Renderizado apenas para a tab "Perfil"
// Mostra círculo roxo com a primeira letra do user.name
// Quando focused: fundo colors.primary, texto branco
// Quando unfocused: fundo colors.primaryLight, texto colors.primary
```

O `useAuth()` é chamado dentro do `PersonalTabs` para obter `user.name`.

---

## Integração com API

Nenhuma mudança na API é necessária. O endpoint existente `PATCH /api/users/me` já suporta todos os campos editáveis:

```ts
// src/api/users.ts — já existe
export const updateMe = (data: {
  name?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  age?: number;
}) => api.patch<User>('/users/me', data).then((r) => r.data);
```

---

## Mudanças no `PersonalNavigator`

1. Adicionar 3ª tab com `name="Perfil"` e `component={PersonalProfileScreen}`
2. Ícone: componente customizado que usa `useAuth()` para pegar as iniciais
3. Remover botão de logout do `DashboardScreen` (o logout agora fica na tab Perfil)

---

## Fora de escopo

- Upload de foto de perfil
- Alteração de e-mail ou senha
- Exclusão de conta
- Edição de gênero (campo existe na API mas não será exposto nesta versão)
