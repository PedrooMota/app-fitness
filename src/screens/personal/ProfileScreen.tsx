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
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>E-mail</Text>
            <Text style={styles.readonlyValue}>{user?.email}</Text>
          </View>
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

  readonlyField: { marginBottom: 12 },
  readonlyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 4,
  },
  readonlyValue: {
    fontSize: 15,
    color: colors.muted,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
