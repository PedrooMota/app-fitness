# CLAUDE.md — src/screens/auth/

Telas públicas — acessíveis sem autenticação.

---

## LoginScreen

**Rota:** `Login` (tela inicial do AuthNavigator)

Formulário de login para **ambos os perfis** (personal e aluno).
Após login bem-sucedido, o `AuthContext` detecta o `role` e o `AppNavigator`
redireciona automaticamente para o navigator correto.

**Campos:** e-mail, senha
**Validação:** campos obrigatórios antes de chamar a API
**Link para:** `RegisterScreen` (apenas para personals)

---

## RegisterScreen

**Rota:** `Register`

Cadastro exclusivo para **personal trainers**.
Alunos são criados pelo personal via `InviteUserScreen` — não há opção de auto-cadastro como aluno.

**Campos:** nome, e-mail, senha
**Validação:** todos obrigatórios, senha mínimo 6 caracteres
**Role fixo:** sempre envia `role: 'personal'`

---

## Convenções

- `KeyboardAvoidingView` + `ScrollView` em ambas as telas para compatibilidade iOS/Android
- `keyboardShouldPersistTaps="handled"` para fechar teclado ao tocar fora dos inputs
- Erros exibidos via `Alert.alert` (não inline)
- `loading` state desabilita o botão durante a requisição
