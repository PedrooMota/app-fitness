import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { AuthStackParams } from "./types";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { PersonalNavigator } from "./PersonalNavigator";
import { UserNavigator } from "./UserNavigator";
import { WelcomeScreen } from "../screens/user/WelcomeScreen";
import { colors } from "../theme";

const AuthStack = createNativeStackNavigator<AuthStackParams>();

const AuthNavigator: React.FC = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerShadowVisible: false,
      headerTintColor: colors.primary,
    }}
  >
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: "Criar conta" }}
    />
  </AuthStack.Navigator>
);

export const AppNavigator: React.FC = () => {
  const { user, loading, isFirstLogin } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === "personal" ? (
        <PersonalNavigator />
      ) : isFirstLogin ? (
        <WelcomeScreen />
      ) : (
        <UserNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
