# CLAUDE.md — src/types/

Tipos e interfaces TypeScript que espelham os modelos da API (`app-fitness-api`).

Arquivo único: `index.ts` — exporta tudo de um só lugar.

---

## Tipos primitivos (enums)

```ts
UserRole   = 'user' | 'personal'
Gender     = 'male' | 'female' | 'other'
MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
             | 'legs' | 'glutes' | 'abs' | 'calves' | 'cardio'
Equipment  = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'other'
```

---

## Interfaces principais

### User
Usuário logado ou aluno do time. O campo `personalId` existe apenas para `role: 'user'`.

### AuthResponse
Retorno de `/api/auth/login` e `/api/auth/register`.
```ts
{ access_token: string; user: { id, email, role } }
```

### Exercise
Exercício do catálogo (17 pré-cadastrados + criados pelo personal).

### Workout
Treino prescrito. `createdBy` = quem criou, `targetUserId` = para quem é.

### WorkoutExercise
Item dentro de um `Workout`. Referencia o exercício pelo `exerciseId`.

### WorkoutLog
Registro de execução de um treino. Contém `LogExercise[]` com `LogSet[]`.

### WorkoutStats
Retorno de `/api/workout-logs/stats`:
```ts
{ totalWorkouts, totalMinutes, workoutsLast30Days, averageDuration }
```

### DietPlan
Plano alimentar. Contém `Meal[]` com `FoodItem[]`.

### Meal / FoodItem
Refeição e alimento com macros opcionais (calories, protein, carbs, fat).

---

## Regra

Nunca definir tipos inline nas telas ou nos módulos de API.
Sempre importar de `src/types/`:

```ts
import { User, Workout, DietPlan } from '../types';
```
