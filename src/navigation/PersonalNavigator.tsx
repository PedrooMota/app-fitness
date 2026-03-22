import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PersonalStackParams } from './types';
import { colors, shadows } from '../theme';

import { PersonalDashboardScreen } from '../screens/personal/DashboardScreen';
import { TeamScreen } from '../screens/personal/TeamScreen';
import { InviteUserScreen } from '../screens/personal/InviteUserScreen';
import { ClientDetailScreen } from '../screens/personal/ClientDetailScreen';
import { CreateWorkoutScreen } from '../screens/personal/CreateWorkoutScreen';
import { PersonalWorkoutDetailScreen } from '../screens/personal/WorkoutDetailScreen';
import { CreateDietScreen } from '../screens/personal/CreateDietScreen';
import { PersonalDietDetailScreen } from '../screens/personal/DietDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<PersonalStackParams>();

const PersonalTabs: React.FC = () => {
  const { bottom } = useSafeAreaInsets();
  // iPhone X+: bottom ≈ 34px | Android/iPhone antigo: bottom = 0
  const tabBarHeight = 56 + bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, any> = {
            Dashboard: focused ? 'home' : 'home-outline',
            Time: focused ? 'people' : 'people-outline',
          };
          return (
            <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
              <Ionicons name={icons[route.name]} size={22} color={color} />
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
});
