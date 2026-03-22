# CLAUDE.md — src/

Diretório raiz do código-fonte do app. Cada subdiretório tem seu próprio CLAUDE.md.

---

## Mapa de subdiretórios

| Diretório | Responsabilidade | CLAUDE.md |
|---|---|---|
| `api/` | Funções de chamada à API REST (Axios) | [ver](./api/CLAUDE.md) |
| `components/` | Componentes reutilizáveis (Button, Input, Card) | [ver](./components/CLAUDE.md) |
| `contexts/` | AuthContext — autenticação e sessão global | [ver](./contexts/CLAUDE.md) |
| `navigation/` | Configuração de rotas por role | [ver](./navigation/CLAUDE.md) |
| `screens/auth/` | Telas públicas (Login, Register) | [ver](./screens/auth/CLAUDE.md) |
| `screens/personal/` | Telas do personal trainer | [ver](./screens/personal/CLAUDE.md) |
| `screens/user/` | Telas do aluno | [ver](./screens/user/CLAUDE.md) |
| `types/` | Interfaces e tipos TypeScript | [ver](./types/CLAUDE.md) |
| `theme.ts` | Paleta de cores centralizada | — |

---

## theme.ts

Objeto `colors` com todas as cores do app. **Nunca use valores hardcoded nas telas.**

```ts
import { colors } from '../theme';
// ou
import { colors } from '../../theme';
```

Cores principais:
- `colors.primary` — roxo `#6C63FF` (personal trainer, ações principais)
- `colors.success` — verde `#22C55E` (aluno, confirmações)
- `colors.danger` — vermelho `#EF4444` (ações destrutivas)
- `colors.warning` — âmbar `#F59E0B` (destaques)
- `colors.background` — cinza claro `#F8F9FC` (fundo das telas)
- `colors.card` — branco `#FFFFFF` (fundo dos Cards)
- `colors.text` — quase preto `#111827` (texto principal)
- `colors.muted` — cinza `#9CA3AF` (texto secundário, ícones inativos)
