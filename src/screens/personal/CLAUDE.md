# CLAUDE.md — src/screens/personal/

Telas exclusivas do **Personal Trainer** (`role: personal`).
Todas requerem JWT com role `personal` — a API retorna 403 se um aluno tentar acessar.

---

## DashboardScreen (`PersonalDashboardScreen`)

**Rota:** Tab `Dashboard`

Painel inicial do personal. Exibe:
- Saudação com nome do usuário
- Cards de resumo: total de alunos, treinos criados, planos de dieta
- Lista dos 3 alunos mais recentes do time

Carrega dados em paralelo: `getMembers()`, `getWorkouts()`, `getDietPlans()`.
Usa `useFocusEffect` para recarregar ao voltar de outras telas.

---

## TeamScreen

**Rota:** Tab `Time`

Lista todos os alunos do time do personal.

- Toque no aluno → `ClientDetailScreen`
- Botão de lixeira → confirma e chama `removeMember(userId)` (desvincula, não deleta conta)
- FAB (botão +) → `InviteUserScreen`
- Chips exibem dados físicos (idade, peso, altura) quando disponíveis

---

## InviteUserScreen

**Rota:** Stack `InviteUser`

Formulário para criar conta de aluno e vinculá-lo ao time.

**Campos obrigatórios:** nome, e-mail, senha (mín. 6 chars)
**Campos opcionais:** peso, altura, idade

Chama `POST /api/teams/invite`. O aluno já pode logar imediatamente com o e-mail e senha fornecidos.

---

## ClientDetailScreen

**Rota:** Stack `ClientDetail` — params: `{ clientId, clientName }`

Painel do aluno específico. Exibe:
- Treinos criados para o aluno com botão "Novo"
- Planos de dieta criados para o aluno com botão "Novo"

Carrega em paralelo: `getClientWorkouts(clientId)`, `getClientDietPlans(clientId)`.

---

## CreateWorkoutScreen

**Rota:** Stack `CreateWorkout` — params: `{ clientId, clientName }`

Formulário para criar treino para um aluno específico.

**Fluxo:**
1. Nome e descrição do treino
2. Botão "Adicionar" abre picker com catálogo de exercícios (GET `/api/exercises`)
3. Cada exercício adicionado exibe campos: séries, reps, peso, descanso, obs
4. Salva com `targetUserId: clientId`

**Validações:** nome obrigatório, pelo menos 1 exercício.

---

## WorkoutDetailScreen (`PersonalWorkoutDetailScreen`)

**Rota:** Stack `WorkoutDetail` — params: `{ workoutId, clientId, clientName }`

Exibe detalhes completos do treino com exercícios e chips de séries/reps/peso.
Carrega exercícios do catálogo para exibir nome e grupo muscular.
Botão "Excluir treino" com confirmação.

### Modal de vídeo
Mesmo comportamento do `UserWorkoutDetailScreen`: botão **"▶ Ver"** por exercício com `videoUrl`, abre bottom sheet Modal com `VideoThumb`.
Estado: `videoModal: { name: string; url: string } | null`.

---

## CreateDietScreen

**Rota:** Stack `CreateDiet` — params: `{ clientId, clientName }`

Formulário para criar plano de dieta para um aluno.

**Estrutura:**
- Nome e descrição do plano
- Refeições dinâmicas (adicionar/remover)
  - Cada refeição: nome (ex: "Café da manhã"), horário, lista de alimentos
  - Cada alimento: nome, quantidade, macros opcionais (kcal, proteína, carbs, gordura)

---

## DietDetailScreen (`PersonalDietDetailScreen`)

**Rota:** Stack `DietDetail` — params: `{ dietId, clientId, clientName }`

Exibe plano de dieta completo com todas as refeições e alimentos.
Calcula total de calorias somando todos os alimentos.
Exibe macros por alimento com chips coloridos.
Botão "Excluir plano" com confirmação.

---

## Convenções específicas

- `useFocusEffect` nas listas para recarregar ao voltar (Dashboard, TeamScreen, ClientDetailScreen)
- Confirmações de ações destrutivas sempre via `Alert.alert` com botão `style: 'destructive'`
- `targetUserId` sempre passado ao criar treinos/dietas para um aluno
- Recarregar lista após remover aluno ou excluir item chamando `load()` diretamente
