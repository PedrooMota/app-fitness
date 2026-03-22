# CLAUDE.md — src/api/

Módulos de comunicação com a API REST (`app-fitness-api`).
Cada arquivo corresponde a um recurso da API.

## Arquivos

| Arquivo | Recurso | Endpoints cobertos |
|---|---|---|
| `client.ts` | Axios instance | Interceptors de auth e erro |
| `auth.ts` | `/api/auth` | login, register |
| `users.ts` | `/api/users` | getMe, updateMe, deleteMe |
| `teams.ts` | `/api/teams` | inviteUser, getMembers, getMember, removeMember |
| `exercises.ts` | `/api/exercises` | getExercises, getExercise, createExercise, deleteExercise |
| `workouts.ts` | `/api/workouts` | CRUD + getClientWorkouts |
| `diet.ts` | `/api/diet` | CRUD + getClientDietPlans |
| `workoutLogs.ts` | `/api/workout-logs` | getLogs, getStats, createLog, deleteLog |

---

## client.ts

Instância Axios configurada com:

- **baseURL (produção)**: `https://app-fitness-api.onrender.com/api` — API hospedada no Render
- **Request interceptor**: injeta `Authorization: Bearer <token>` automaticamente via `AsyncStorage`
- **Response interceptor**: normaliza erros — extrai `message` do body e rejeita com `Error(message)`

> Para desenvolvimento local, altere `BASE_URL` em `client.ts` para o IP da máquina onde a API roda (ex: `http://192.168.x.x:3000/api`).

```ts
import { api } from './client';
```

---

## Convenções

- Todas as funções retornam apenas o `data` da resposta (`.then(r => r.data)`)
- Tipos de retorno sempre explícitos usando interfaces de `src/types/`
- Parâmetros opcionais passados como `undefined` (nunca como string vazia)
- Rotas exclusivas do personal (ex: `teams`, `getClientWorkouts`) são chamadas apenas nas telas de personal — não há guarda aqui, a API retorna 403

---

## Tratamento de erros

Os interceptors normalizam todos os erros para `Error(message)`.
Nas telas, sempre capturar com:

```ts
try {
  await algumApi.funcao();
} catch (e: any) {
  Alert.alert('Erro', e.message);
}
```
