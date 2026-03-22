# CLAUDE.md — src/screens/user/

Telas do **Aluno** (`role: user`).
O aluno visualiza apenas dados prescritos pelo seu personal e registra seu histórico.

---

## DashboardScreen (`UserDashboardScreen`)

**Rota:** Tab `Dashboard`

Painel inicial do aluno. Exibe:
- Saudação com nome do usuário
- Cards de estatísticas: total de treinos, minutos acumulados, treinos últimos 30 dias
- Prévia dos 3 treinos prescritos mais recentes
- Prévia dos 2 planos de dieta mais recentes

Carrega em paralelo: `getWorkouts()`, `getDietPlans()`, `getWorkoutStats()`.

---

## WorkoutsScreen (`UserWorkoutsScreen`)

**Rota:** Tab `Treinos`

Lista completa de treinos prescritos pelo personal.
Toque no treino → `WorkoutDetailScreen`.

> A API retorna treinos onde `targetUserId = userId`, ou seja, apenas os prescritos para este aluno.

---

## WorkoutDetailScreen (`UserWorkoutDetailScreen`)

**Rota:** Stack `WorkoutDetail` — params: `{ workoutId }`

Exibe treino completo com todos os exercícios numerados.
Carrega catálogo de exercícios para exibir nome e grupo muscular.
Chips de séries, reps, peso e tempo de descanso.

### Modal de vídeo
Cada exercício que possui `videoUrl` no catálogo exibe um botão **"▶ Ver"** no canto direito do header do card.
Ao tocar, abre um **bottom sheet Modal** (`animationType="slide"`, `transparent`) com:
- Nome do exercício no header + botão X para fechar
- `VideoThumb` com thumbnail do YouTube e player inline via `react-native-webview`

Estado: `videoModal: { name: string; url: string } | null` — `null` = fechado.

> Os vídeos vêm do campo `videoUrl` do catálogo de exercícios (`exerciseMap`), não do JSON do treino.
> O seed popula os 17 exercícios padrão com URLs do YouTube (executar manualmente: `npx prisma db seed`).

Botão **"Registrar treino realizado"** → navega para `LogWorkoutScreen` passando:
- `workoutId`, `workoutName`
- `exercises` (lista de WorkoutExercise)
- `exerciseMap` (mapa id→Exercise já carregado)

---

## LogWorkoutScreen

**Rota:** Stack `LogWorkout` — params: `{ workoutId, workoutName, exercises, exerciseMap }`

Formulário de registro de execução do treino.

**Por exercício, por série:**
- Campo de reps realizadas (pré-preenchido com o prescrito)
- Campo de peso utilizado
- Botão de check (toggle) para marcar série como concluída

**Geral:**
- Duração total em minutos
- Anotações livres

Chama `POST /api/workout-logs` ao salvar. Exibe "Ótimo trabalho!" ao finalizar.

---

## DietScreen (`UserDietScreen`)

**Rota:** Tab `Dieta`

Lista de planos de dieta prescritos pelo personal.
Exibe total de calorias/dia calculado a partir dos alimentos.
Toque no plano → `DietDetailScreen`.

---

## DietDetailScreen (`UserDietDetailScreen`)

**Rota:** Stack `DietDetail` — params: `{ dietId }`

Exibe plano de dieta completo.

**Resumo no topo:** total de calorias, proteínas, carboidratos e gorduras do dia inteiro.
**Por refeição:** nome, horário, lista de alimentos com quantidades e macros individuais.

---

## HistoryScreen (`UserHistoryScreen`)

**Rota:** Tab `Histórico`

Histórico de treinos realizados (workout logs), ordenados do mais recente.
Exibe estatísticas no topo (total, minutos, média).
Cada registro mostra data, número de exercícios, duração e anotações.
Botão de lixeira para excluir registro com confirmação.

---

## ProfileScreen (`UserProfileScreen`)

**Rota:** Tab `Perfil`

Edição de dados pessoais: nome, peso, altura, idade.
Chama `PATCH /api/users/me` e `refreshUser()` do contexto para atualizar o estado global.
Botão "Sair" chama `signOut()`.

---

## WelcomeScreen

**Rota:** renderizada pelo `AppNavigator` diretamente (fora do `UserNavigator`) quando `isFirstLogin === true`.

Onboarding de 3 slides exibido **somente na primeira vez** que o aluno entra no app:

| Slide | Ícone | Título | Conteúdo |
|---|---|---|---|
| 1 | `fitness` | Bem-vindo ao App Fitness! | Visão geral do app |
| 2 | `barbell` | Seus Treinos | Como funciona a seção de treinos |
| 3 | `restaurant` | Sua Dieta | Como funciona a seção de dieta |

**Navegação:**
- Botão "Próximo" avança para o próximo slide
- Botão "Pular" (slides 1 e 2) encerra o onboarding imediatamente
- Botão "Começar" (último slide) encerra o onboarding

**Controle de exibição:**
- Chama `dismissWelcome()` do `AuthContext` ao sair (botão ou pular)
- `dismissWelcome()` grava `@welcomeSeen:<userId>` no `AsyncStorage` e seta `isFirstLogin = false`
- A partir daí, o `AppNavigator` renderiza o `UserNavigator` normalmente

---

## Convenções específicas

- O aluno **não cria** treinos nem dietas — apenas visualiza
- `useFocusEffect` nas listas para recarregar ao voltar de outra tela
- `exerciseMap` é passado como parâmetro de rota do `WorkoutDetail` → `LogWorkout` para evitar re-fetch
- Macros totais calculados no componente a partir dos dados do plano (sem campo na API)
