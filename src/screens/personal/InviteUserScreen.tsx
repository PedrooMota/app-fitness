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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PersonalStackParams } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as teamsApi from '../../api/teams';

type Props = NativeStackScreenProps<PersonalStackParams, 'InviteUser'>;

export const InviteUserScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Nome, e-mail e senha são obrigatórios.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'Senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await teamsApi.inviteUser({
        name: name.trim(),
        email: email.trim(),
        password,
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
        age: age ? Number(age) : undefined,
      });
      Alert.alert('Sucesso', `${name} foi adicionado ao seu time!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
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
        <Card>
          <Text style={styles.sectionLabel}>Dados de acesso</Text>
          <Input label="Nome completo" placeholder="Nome do aluno" value={name} onChangeText={setName} autoCapitalize="words" />
          <Input label="E-mail" placeholder="email@exemplo.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label="Senha inicial" placeholder="Mínimo 6 caracteres" value={password} onChangeText={setPassword} isPassword />
        </Card>

        <Card>
          <Text style={styles.sectionLabel}>Dados físicos (opcional)</Text>
          <View style={styles.row}>
            <Input
              label="Peso (kg)"
              placeholder="70"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={styles.halfInput}
            />
            <Input
              label="Altura (cm)"
              placeholder="175"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              style={styles.halfInput}
            />
          </View>
          <Input
            label="Idade"
            placeholder="25"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </Card>

        <Text style={styles.hint}>
          O aluno receberá o e-mail e senha acima para acessar o app e ver seus treinos e dieta.
        </Text>

        <Button title="Convidar para o time" onPress={handleInvite} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  hint: { fontSize: 13, color: colors.muted, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
});
