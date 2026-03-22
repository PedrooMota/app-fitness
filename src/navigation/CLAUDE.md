# CLAUDE.md — src/navigation/

Configuração completa de rotas usando React Navigation v7.

---

## Arquivos

| Arquivo | Descrição |
|---|---|
| `types.ts` | Tipos dos parâmetros de cada stack (params das rotas) |
| `AppNavigator.tsx` | Raiz — decide qual navigator renderizar por role |
| `PersonalNavigator.tsx` | Stack + BottomTabs para personal trainer |
| `UserNavigator.tsx` | Stack + BottomTabs para aluno |

---

## AppNavigator

Ponto de entrada do sistema de navegação. Renderiza condicionalmente:

```
loading = true              → <ActivityIndicator> (aguarda verificação do token)
user = null                 → AuthNavigator (Login + Register)
role = personal             → PersonalNavigator
role = user + isFirstLogin  → WelcomeScreen (onboarding — só na primeira vez)
role = user                 → UserNavigator
```

O `NavigationContainer` fica **aqui**, não nos sub-navigators.

> `isFirstLogin` vem do `AuthContext`. Após o aluno completar ou pular o onboarding,
> `dismissWelcome()` é chamado, `isFirstLogin` volta a `false` e o `UserNavigator` é renderizado.

---

## PersonalNavigator

Stack Navigator com BottomTabs embutido como tela `Tabs`.

### BottomTabs (PersonalTabs)
| Tab | Tela | Ícone |
|---|---|---|
| Dashboard | `PersonalDashboardScreen` | home |
| Time | `TeamScreen` | people |

### Stack completo
```
Tabs           (BottomTabs — headerShown: false)
InviteUser     ← acessado via FAB em TeamScreen
ClientDetail   ← acessado ao tocar em aluno na TeamScreen
CreateWorkout  ← acessado via botão em ClientDetail
WorkoutDetail  ← acessado ao tocar em treino em ClientDetail
CreateDiet     ← acessado via botão em ClientDetail
DietDetail     ← acessado ao tocar em dieta em ClientDetail
```

### Parâmetros das rotas (PersonalStackParams)
```ts
InviteUser:    undefined
ClientDetail:  { clientId: string; clientName: string }
CreateWorkout: { clientId: string; clientName: string }
WorkoutDetail: { workoutId: string; clientId: string; clientName: string }
CreateDiet:    { clientId: string; clientName: string }
DietDetail:    { dietId: string; clientId: string; clientName: string }
```

---

## UserNavigator

Stack Navigator com BottomTabs embutido como tela `Tabs`.

### BottomTabs (UserTabs)
| Tab | Tela | Ícone |
|---|---|---|
| Dashboard | `UserDashboardScreen` | home |
| Treinos | `UserWorkoutsScreen` | barbell |
| Dieta | `UserDietScreen` | restaurant |
| Histórico | `UserHistoryScreen` | time |
| Perfil | `UserProfileScreen` | person |

### Stack completo
```
Tabs          (BottomTabs — headerShown: false)
WorkoutDetail ← acessado ao tocar em treino em UserWorkoutsScreen
LogWorkout    ← acessado via botão em WorkoutDetail
DietDetail    ← acessado ao tocar em dieta em UserDietScreen
```

### Parâmetros das rotas (UserStackParams)
```ts
WorkoutDetail: { workoutId: string }
LogWorkout:    { workoutId: string; workoutName: string; exercises: WorkoutExercise[]; exerciseMap: Record<string, Exercise> }
DietDetail:    { dietId: string }
```

---

## Convenções

- Tipagem de navegação: `NativeStackScreenProps<Params, 'NomeDaTela'>` nas props da tela
- Para navegar sem props da tela: `useNavigation<NativeStackNavigationProp<Params>>()`
- Cores do header sempre de `src/theme.ts`
- Personal usa `colors.primary` (roxo) como `headerTintColor`
- Aluno usa `colors.success` (verde) como `headerTintColor`
