# CLAUDE.md — src/components/

Componentes reutilizáveis usados em toda a aplicação.

---

## Button (`Button.tsx`)

Botão com 3 variantes e estado de loading.

```tsx
<Button
  title="Salvar"
  onPress={handleSave}
  loading={loading}        // mostra ActivityIndicator
  disabled={false}
  variant="primary"        // 'primary' | 'outline' | 'danger'
/>
```

- `primary` — fundo roxo (`colors.primary`), texto branco
- `outline` — borda roxa, fundo transparente, texto roxo
- `danger` — fundo vermelho, texto branco
- Quando `loading` ou `disabled`, opacidade reduzida e interação bloqueada

---

## Input (`Input.tsx`)

Campo de texto com label, mensagem de erro e suporte a senha.

```tsx
<Input
  label="E-mail"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  error="E-mail inválido"   // borda vermelha + mensagem abaixo
  isPassword                // toggle show/hide com ícone de olho
  keyboardType="email-address"
/>
```

- Aceita todas as props de `TextInputProps` do React Native
- `isPassword` habilita o botão de olho (Ionicons) no lado direito
- `error` exibe texto vermelho abaixo e deixa borda vermelha

---

## Card (`Card.tsx`)

Container visual com sombra e bordas arredondadas.

```tsx
<Card style={{ marginTop: 8 }}>
  <Text>Conteúdo</Text>
</Card>
```

- Fundo branco (`colors.card`), `borderRadius: 14`, `padding: 16`
- Sombra leve compatível com iOS e Android (`elevation: 2`)
- Aceita `style?: ViewStyle` para customização

---

## VideoThumb (`VideoThumb.tsx`)

Player de vídeo do YouTube com thumbnail e player inline.

```tsx
<VideoThumb videoUrl="https://www.youtube.com/watch?v=VIDEO_ID" />
```

**Comportamento:**
- Exibe thumbnail `hqdefault.jpg` do YouTube com overlay escuro + botão play centralizado + badge "Ver execução"
- Ao tocar, troca para `WebView` com `iframe` embed do YouTube (`autoplay=1&playsinline=1`)
- `ActivityIndicator` enquanto a WebView carrega
- Botão X no canto superior direito para voltar à thumbnail
- URLs não-YouTube → abre no browser com `Linking.openURL`

**Dependência:** `react-native-webview` (instalar com `npx expo install react-native-webview`)

**Suporte a URLs:**
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

**Uso nos WorkoutDetailScreens:**
Não é renderizado diretamente no card. É aberto via Modal (bottom sheet) ao tocar no botão "▶ Ver" do exercício.

---

## Convenções

- Cores **sempre** de `src/theme.ts`
- Novos componentes devem ter interface de props explícita com TypeScript
- Estilos via `StyleSheet.create` no mesmo arquivo
- Não usar estado de negócio nos componentes — apenas apresentação
