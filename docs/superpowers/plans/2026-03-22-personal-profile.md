# Personal Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar uma tab "Perfil" ao Personal Trainer com edição de nome, e-mail e telefone, avatar com iniciais na tab bar e acesso ao logout.

**Architecture:** A API recebe `phone` como novo campo no modelo `User` (migration Prisma) e passa a aceitar `email` e `phone` no `PATCH /users/me`. O app adiciona uma 3ª tab "Perfil" ao `PersonalNavigator` com um ícone de avatar circular (iniciais do nome) e uma tela no estilo lista iOS.

**Tech Stack:** NestJS + Prisma + PostgreSQL (API) · React Native + Expo SDK 54 + TypeScript + React Navigation v7 (app)

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `../app-fitness-api/prisma/schema.prisma` | Modificar | Adicionar campo `phone String?` ao modelo `User` |
| `../app-fitness-api/src/users/dto/update-user.dto.ts` | Modificar | Adicionar `email` e `phone` ao DTO |
| `../app-fitness-api/src/users/users.service.ts` | Modificar | Checar unicidade de e-mail no `update` |
| `src/types/index.ts` | Modificar | Adicionar `phone?: string` à interface `User` |
| `src/api/users.ts` | Modificar | Adicionar `email` e `phone` ao `updateMe` |
| `src/screens/personal/ProfileScreen.tsx` | Criar | Tela de perfil do personal trainer |
| `src/navigation/PersonalNavigator.tsx` | Modificar | 3ª tab "Perfil" + ícone avatar + remover logout do Dashboard |
| `src/screens/personal/DashboardScreen.tsx` | Modificar | Remover botão de logout do header |

---

## Task 1: Adicionar campo `phone` ao schema da API

**Arquivos:**
- Modificar: `../app-fitness-api/prisma/schema.prisma`

- [ ] **Step 1: Adicionar o campo `phone` ao modelo `User`**

Em `../app-fitness-api/prisma/schema.prisma`, dentro do modelo `User`, após o campo `age Int?`, adicionar:

```prisma
phone  String?
```

O bloco do modelo deve ficar:
```prisma
model User {
  id         String   @id @default(uuid())
  name       String
  email      String   @unique
  password   String
  role       String   @default("user")
  personalId String?

  personal User?  @relation("PersonalClients", fields: [personalId], references: [id])
  clients  User[] @relation("PersonalClients")

  plan   String  @default("free")

  weight Float?
  height Float?
  gender String?
  age    Int?
  phone  String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  workoutsCreated  Workout[]    @relation("WorkoutCreator")
  workoutsTargeted Workout[]    @relation("WorkoutTarget")
  dietCreated      DietPlan[]   @relation("DietCreator")
  dietTargeted     DietPlan[]   @relation("DietTarget")
  workoutLogs      WorkoutLog[]
}
```

- [ ] **Step 2: Rodar a migration**

```bash
cd ../app-fitness-api
npx prisma migrate dev --name add_phone_to_user
```

Saída esperada: `Your database is now in sync with your schema.`

- [ ] **Step 3: Verificar que o Prisma Client foi regenerado**

```bash
npx prisma generate
```

- [ ] **Step 4: Commit**

```bash
cd ../app-fitness-api
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: adicionar campo phone ao modelo User"
```

---

## Task 2: Atualizar DTO e service da API

**Arquivos:**
- Modificar: `../app-fitness-api/src/users/dto/update-user.dto.ts`
- Modificar: `../app-fitness-api/src/users/users.service.ts`

- [ ] **Step 1: Atualizar `update-user.dto.ts`**

Substituir o conteúdo completo do arquivo:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'João Silva', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'joao@email.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '11999999999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 75, required: false })
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: 178, required: false })
  @IsOptional()
  height?: number;

  @ApiProperty({ example: 'male', enum: ['male', 'female', 'other'], required: false })
  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: string;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  age?: number;
}
```

- [ ] **Step 2: Adicionar verificação de e-mail duplicado no `users.service.ts`**

No método `update` (linha 74), substituir a implementação atual por:

```ts
async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException('Usuário não encontrado');

  if (dto.email && dto.email !== user.email) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('E-mail já cadastrado');
  }

  const updated = await this.prisma.user.update({ where: { id }, data: { ...dto } });
  return this.sanitize(updated);
}
```

> **Nota:** `ConflictException` já está importado no topo do arquivo.

- [ ] **Step 3: Verificar que a API compila**

```bash
cd ../app-fitness-api
npm run build
```

Saída esperada: compilação sem erros.

- [ ] **Step 4: Testar manualmente o endpoint (opcional mas recomendado)**

```bash
npm run start:dev
# Em outro terminal:
curl -X PATCH http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phone": "11999999999"}'
# Esperado: objeto User com phone preenchido
```

- [ ] **Step 5: Commit e push da API**

```bash
cd ../app-fitness-api
git add src/users/dto/update-user.dto.ts src/users/users.service.ts
git commit -m "feat: aceitar email e phone no PATCH /users/me"
git push
```

> Após o push, o Render fará o redeploy automático. Aguarde ~2 min antes de testar o app.

---

## Task 3: Atualizar tipos e cliente HTTP no app

**Arquivos:**
- Modificar: `src/types/index.ts`
- Modificar: `src/api/users.ts`

- [ ] **Step 1: Adicionar `phone` à interface `User`**

Em `src/types/index.ts`, na interface `User`, após `age?: number;` (linha 34), adicionar:

```ts
phone?: string;
```

A interface deve ficar:
```ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: string;
  personalId?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  age?: number;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 2: Adicionar `email` e `phone` ao `updateMe`**

Substituir o conteúdo completo de `src/api/users.ts`:

```ts
import { api } from './client';
import { User, Gender } from '../types';

export const getMe = () => api.get<User>('/users/me').then((r) => r.data);

export const updateMe = (data: {
  name?: string;
  email?: string;
  phone?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  age?: number;
}) => api.patch<User>('/users/me', data).then((r) => r.data);

export const deleteMe = () => api.delete('/users/me');
```

- [ ] **Step 3: Commit**

```bash
cd app-fitness  # ou o diretório raiz do app
git add src/types/index.ts src/api/users.ts
git commit -m "feat: adicionar phone ao tipo User e ao updateMe"
```

---

## Task 4: Criar `PersonalProfileScreen`

**Arquivos:**
- Criar: `src/screens/personal/ProfileScreen.tsx`

- [ ] **Step 1: Criar o arquivo da tela**

Criar `src/screens/personal/ProfileScreen.tsx` com o seguinte conteúdo:

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as usersApi from '../../api/users';

export const PersonalProfileScreen: React.FC = () => {
  const { user, refreshUser, signOut } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [loading, setLoading] = useState(false);

  const initial = (user?.name ?? '?')[0].toUpperCase();

  const planLabel = user?.plan === 'pro' ? 'Pro' : 'Free';

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar em branco.');
      return;
    }
    setLoading(true);
    try {
      await usersApi.updateMe({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      await refreshUser();
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.headerName}>{user?.name}</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>

        {/* Card Conta */}
        <Card>
          <Text style={styles.sectionLabel}>Conta</Text>
          <Input
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </Card>

        {/* Card Plano */}
        <Card style={styles.planCard}>
          <Text style={styles.sectionLabel}>Plano atual</Text>
          <View style={styles.planRow}>
            <Text style={styles.planValue}>{planLabel}</Text>
          </View>
        </Card>

        <Button
          title="Salvar alterações"
          onPress={handleSave}
          loading={loading}
          style={styles.saveBtn}
        />
        <Button title="Sair da conta" variant="outline" onPress={signOut} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: colors.primary },
  headerName: { fontSize: 20, fontWeight: '700', color: colors.text },
  headerEmail: { fontSize: 13, color: colors.muted, marginTop: 2 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  planCard: { marginTop: 4 },
  planRow: { flexDirection: 'row', alignItems: 'center' },
  planValue: { fontSize: 15, fontWeight: '600', color: colors.text },

  saveBtn: { marginBottom: 12 },
});
```

- [ ] **Step 2: Verificar que o TypeScript compila sem erros**

```bash
npx tsc --noEmit
```

Saída esperada: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/screens/personal/ProfileScreen.tsx
git commit -m "feat: criar tela de perfil do personal trainer"
```

---

## Task 5: Atualizar `PersonalNavigator` e remover logout do Dashboard

**Arquivos:**
- Modificar: `src/navigation/PersonalNavigator.tsx`
- Modificar: `src/screens/personal/DashboardScreen.tsx`

- [ ] **Step 1: Atualizar `PersonalNavigator.tsx`**

Substituir o conteúdo completo do arquivo:

```tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PersonalStackParams } from './types';
import { colors, shadows } from '../theme';
import { useAuth } from '../contexts/AuthContext';

import { PersonalDashboardScreen } from '../screens/personal/DashboardScreen';
import { TeamScreen } from '../screens/personal/TeamScreen';
import { InviteUserScreen } from '../screens/personal/InviteUserScreen';
import { ClientDetailScreen } from '../screens/personal/ClientDetailScreen';
import { CreateWorkoutScreen } from '../screens/personal/CreateWorkoutScreen';
import { PersonalWorkoutDetailScreen } from '../screens/personal/WorkoutDetailScreen';
import { CreateDietScreen } from '../screens/personal/CreateDietScreen';
import { PersonalDietDetailScreen } from '../screens/personal/DietDetailScreen';
import { UpgradePlanScreen } from '../screens/personal/UpgradePlanScreen';
import { PersonalProfileScreen } from '../screens/personal/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<PersonalStackParams>();

const PersonalTabs: React.FC = () => {
  const { bottom } = useSafeAreaInsets();
  const { user } = useAuth();
  const tabBarHeight = 56 + bottom;
  const initial = (user?.name ?? '?')[0].toUpperCase();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          if (route.name === 'Perfil') {
            return (
              <View style={[
                tabStyles.avatarWrap,
                focused ? tabStyles.avatarWrapActive : tabStyles.avatarWrapInactive,
              ]}>
                <Text style={[
                  tabStyles.avatarText,
                  { color: focused ? colors.white : colors.primary },
                ]}>
                  {initial}
                </Text>
              </View>
            );
          }
          const icons: Record<string, { focused: string; unfocused: string }> = {
            Dashboard: { focused: 'home', unfocused: 'home-outline' },
            Time: { focused: 'people', unfocused: 'people-outline' },
          };
          const icon = icons[route.name];
          return (
            <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
              <Ionicons
                name={(focused ? icon?.focused : icon?.unfocused) as any}
                size={22}
                color={color}
              />
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: Platform.OS === 'ios' ? 0 : 4 },
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: colors.card,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: bottom || 8,
          ...shadows.lg,
        },
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={PersonalDashboardScreen} options={{ title: 'Início', headerShown: false }} />
      <Tab.Screen name="Time" component={TeamScreen} options={{ title: 'Meu Time' }} />
      <Tab.Screen name="Perfil" component={PersonalProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};

export const PersonalNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { fontWeight: '700', color: colors.text },
      headerShadowVisible: false,
      headerBackTitle: 'Voltar',
      headerTintColor: colors.primary,
    }}
  >
    <Stack.Screen name="Tabs" component={PersonalTabs} options={{ headerShown: false }} />
    <Stack.Screen name="InviteUser" component={InviteUserScreen} options={{ title: 'Convidar aluno' }} />
    <Stack.Screen name="UpgradePlan" component={UpgradePlanScreen} options={{ title: 'Plano Pro' }} />
    <Stack.Screen
      name="ClientDetail"
      component={ClientDetailScreen}
      options={({ route }) => ({ title: route.params.clientName })}
    />
    <Stack.Screen
      name="CreateWorkout"
      component={CreateWorkoutScreen}
      options={({ route }) => ({ title: `Treino · ${route.params.clientName}` })}
    />
    <Stack.Screen
      name="WorkoutDetail"
      component={PersonalWorkoutDetailScreen}
      options={{ title: 'Detalhe do treino' }}
    />
    <Stack.Screen
      name="CreateDiet"
      component={CreateDietScreen}
      options={({ route }) => ({ title: `Dieta · ${route.params.clientName}` })}
    />
    <Stack.Screen
      name="DietDetail"
      component={PersonalDietDetailScreen}
      options={{ title: 'Plano de dieta' }}
    />
  </Stack.Navigator>
);

const tabStyles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primaryLight,
  },
  avatarWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapActive: {
    backgroundColor: colors.primary,
  },
  avatarWrapInactive: {
    backgroundColor: colors.primaryLight,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
```

- [ ] **Step 2: Remover o botão de logout do `DashboardScreen.tsx`**

Em `src/screens/personal/DashboardScreen.tsx`:

2a. Remover `signOut` do destructuring do `useAuth` (linha 22):
```ts
// Antes:
const { user, signOut } = useAuth();
// Depois:
const { user } = useAuth();
```

2b. Remover o `TouchableOpacity` do botão de logout do JSX (linhas 66-68):
```tsx
// Remover este bloco:
<TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
  <Ionicons name="log-out-outline" size={20} color={colors.white} />
</TouchableOpacity>
```

2c. Remover o estilo `logoutBtn` do `StyleSheet.create` (se houver outros elementos que precisem de `justifyContent: 'space-between'` no banner, ajustar; caso contrário deixar como está).

2d. Remover `TouchableOpacity` dos imports se não for mais usado em nenhum outro lugar da tela.

- [ ] **Step 3: Verificar que o TypeScript compila sem erros**

```bash
npx tsc --noEmit
```

Saída esperada: sem erros.

- [ ] **Step 4: Testar no Expo Go**

```bash
npx expo start
```

Verificar:
- Bottom tab bar exibe 3 tabs: Início · Meu Time · Perfil
- Tab "Perfil" mostra um círculo roxo com a inicial do nome (ativo) ou círculo claro (inativo)
- Tela de Perfil exibe header com avatar, nome, e-mail e os cards de Conta e Plano
- Campos nome, e-mail e telefone editáveis
- Botão "Salvar alterações" atualiza os dados e mostra alerta de sucesso
- Botão "Sair da conta" faz logout
- Header do Dashboard não tem mais o botão de logout

- [ ] **Step 5: Commit e push**

```bash
git add src/navigation/PersonalNavigator.tsx src/screens/personal/DashboardScreen.tsx
git commit -m "feat: adicionar tab Perfil com avatar ao PersonalNavigator"
git push
```
