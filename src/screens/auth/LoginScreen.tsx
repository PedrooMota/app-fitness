import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParams } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Erro ao entrar', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Hero — padding dinâmico com safe area (notch iOS + status bar Android) */}
      <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
        <View style={styles.logoMark}>
          <Ionicons name="flash" size={34} color={colors.primary} />
        </View>
        <Text style={styles.appName}>FitApp</Text>
        <Text style={styles.tagline}>Sua evolução começa aqui</Text>
      </View>

      {/* Form sheet */}
      <KeyboardAvoidingView
        style={styles.sheet}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.form, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formTitle}>Entrar</Text>
          <Text style={styles.formSub}>Acesse sua conta para continuar</Text>

          <View style={styles.fields}>
            <Input
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
          </View>

          <Button title="Entrar" onPress={handleLogin} loading={loading} size="lg" />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.registerHint}>É personal trainer?</Text>
          <Button
            title="Criar conta"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  hero: {
    alignItems: 'center',
    paddingBottom: 40,
    gap: 8,
  },
  logoMark: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  appName: { fontSize: 30, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  form: { padding: 28 },
  formTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 4 },
  formSub: { fontSize: 14, color: colors.textSecondary, marginBottom: 28 },
  fields: { marginBottom: 4 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 13, color: colors.muted },
  registerHint: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 12 },
});
