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

export const UserProfileScreen: React.FC = () => {
  const { user, refreshUser, signOut } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await usersApi.updateMe({
        name: name.trim() || undefined,
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
        age: age ? Number(age) : undefined,
      });
      await refreshUser();
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <Card>
          <Text style={styles.sectionLabel}>Informações pessoais</Text>
          <Input label="Nome" placeholder="Seu nome" value={name} onChangeText={setName} autoCapitalize="words" />
          <View style={styles.row}>
            <View style={styles.half}>
              <Input label="Peso (kg)" placeholder="70" value={weight} onChangeText={setWeight} keyboardType="numeric" />
            </View>
            <View style={styles.half}>
              <Input label="Altura (cm)" placeholder="175" value={height} onChangeText={setHeight} keyboardType="numeric" />
            </View>
          </View>
          <Input label="Idade" placeholder="25" value={age} onChangeText={setAge} keyboardType="numeric" />
        </Card>

        <Button title="Salvar alterações" onPress={handleSave} loading={loading} style={{ marginBottom: 12 }} />
        <Button title="Sair" variant="outline" onPress={signOut} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 34, fontWeight: '700', color: colors.primary },
  userName: { fontSize: 20, fontWeight: '700', color: colors.text },
  userEmail: { fontSize: 14, color: colors.muted, marginTop: 4 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});
