import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserStackParams } from './types';
import { colors, shadows } from '../theme';

import { UserDashboardScreen } from '../screens/user/DashboardScreen';
import { UserWorkoutsScreen } from '../screens/user/WorkoutsScreen';
import { UserWorkoutDetailScreen } from '../screens/user/WorkoutDetailScreen';
import { LogWorkoutScreen } from '../screens/user/LogWorkoutScreen';
import { UserDietScreen } from '../screens/user/DietScreen';
import { UserDietDetailScreen } from '../screens/user/DietDetailScreen';
import { UserHistoryScreen } from '../screens/user/HistoryScreen';
import { UserProfileScreen } from '../screens/user/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<UserStackParams>();

const UserTabs: React.FC = () => {
  const { bottom } = useSafeAreaInsets();
  // iPhone X+: bottom ≈ 34px | Android/iPhone antigo: bottom = 0
  const tabBarHeight = 56 + bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, any> = {
            Dashboard: focused ? 'home' : 'home-outline',
            Treinos: focused ? 'barbell' : 'barbell-outline',
            Dieta: focused ? 'restaurant' : 'restaurant-outline',
            Histórico: focused ? 'time' : 'time-outline',
            Perfil: focused ? 'person' : 'person-outline',
          };
          return (
            <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
              <Ionicons name={icons[route.name]} size={22} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: colors.success,
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
      <Tab.Screen name="Dashboard" component={UserDashboardScreen} options={{ title: 'Início', headerShown: false }} />
      <Tab.Screen name="Treinos" component={UserWorkoutsScreen} />
      <Tab.Screen name="Dieta" component={UserDietScreen} />
      <Tab.Screen name="Histórico" component={UserHistoryScreen} />
      <Tab.Screen name="Perfil" component={UserProfileScreen} />
    </Tab.Navigator>
  );
};

export const UserNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { fontWeight: '700', color: colors.text },
      headerShadowVisible: false,
      headerBackTitle: 'Voltar',
      headerTintColor: colors.success,
    }}
  >
    <Stack.Screen name="Tabs" component={UserTabs} options={{ headerShown: false }} />
    <Stack.Screen name="WorkoutDetail" component={UserWorkoutDetailScreen} options={{ title: 'Treino' }} />
    <Stack.Screen name="LogWorkout" component={LogWorkoutScreen} options={{ title: 'Registrar treino' }} />
    <Stack.Screen name="DietDetail" component={UserDietDetailScreen} options={{ title: 'Plano de dieta' }} />
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
    backgroundColor: colors.successLight,
  },
});
