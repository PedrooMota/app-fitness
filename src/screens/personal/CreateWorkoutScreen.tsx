import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { PersonalStackParams } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as workoutsApi from '../../api/workouts';
import * as exercisesApi from '../../api/exercises';
import { Exercise } from '../../types';

type Props = NativeStackScreenProps<PersonalStackParams, 'CreateWorkout'>;

interface ExerciseEntry {
  exerciseId: string;
  exerciseName: string;
  sets: string;
  reps: string;
  weight: string;
  restSeconds: string;
  notes: string;
}

export const CreateWorkoutScreen: React.FC<Props> = ({ route, navigation }) => {
  const { clientId, clientName } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    exercisesApi.getExercises().then(setCatalog).catch(() => {});
  }, []);

  const addExercise = (ex: Exercise) => {
    setExercises((prev) => [
      ...prev,
      { exerciseId: ex.id, exerciseName: ex.name, sets: '3', reps: '12', weight: '', restSeconds: '60', notes: '' },
    ]);
    setShowPicker(false);
  };

  const removeExercise = (idx: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateField = (idx: number, field: keyof ExerciseEntry, value: string) => {
    setExercises((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };

  const handleSave = async () => {
    if (!name) { Alert.alert('Atenção', 'Dê um nome ao treino.'); return; }
    if (exercises.length === 0) { Alert.alert('Atenção', 'Adicione pelo menos 1 exercício.'); return; }
    setLoading(true);
    try {
      await workoutsApi.createWorkout({
        name: name.trim(),
        description: description.trim() || undefined,
        targetUserId: clientId,
        exercises: exercises.map((e) => ({
          exerciseId: e.exerciseId,
          sets: Number(e.sets) || 3,
          reps: Number(e.reps) || 12,
          weight: e.weight ? Number(e.weight) : undefined,
          restSeconds: e.restSeconds ? Number(e.restSeconds) : undefined,
          notes: e.notes || undefined,
        })),
      });
      Alert.alert('Sucesso', 'Treino criado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={styles.label}>Para: {clientName}</Text>
          <Input label="Nome do treino" placeholder="Ex: Treino A - Peito e Tríceps" value={name} onChangeText={setName} />
          <Input label="Descrição (opcional)" placeholder="Observações gerais..." value={description} onChangeText={setDescription} />
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercícios</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowPicker(true)}>
            <Ionicons name="add-circle" size={22} color={colors.primary} />
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {exercises.map((ex, idx) => (
          <Card key={idx}>
            <View style={styles.exHeader}>
              <Text style={styles.exName}>{ex.exerciseName}</Text>
              <TouchableOpacity onPress={() => removeExercise(idx)}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </TouchableOpacity>
            </View>
            <View style={styles.exRow}>
              <View style={styles.exField}>
                <Text style={styles.exFieldLabel}>Séries</Text>
                <Input placeholder="3" value={ex.sets} onChangeText={(v) => updateField(idx, 'sets', v)} keyboardType="numeric" />
              </View>
              <View style={styles.exField}>
                <Text style={styles.exFieldLabel}>Reps</Text>
                <Input placeholder="12" value={ex.reps} onChangeText={(v) => updateField(idx, 'reps', v)} keyboardType="numeric" />
              </View>
              <View style={styles.exField}>
                <Text style={styles.exFieldLabel}>Peso (kg)</Text>
                <Input placeholder="0" value={ex.weight} onChangeText={(v) => updateField(idx, 'weight', v)} keyboardType="numeric" />
              </View>
            </View>
            <Input label="Descanso (seg)" placeholder="60" value={ex.restSeconds} onChangeText={(v) => updateField(idx, 'restSeconds', v)} keyboardType="numeric" />
            <Input label="Obs" placeholder="Observações do exercício" value={ex.notes} onChangeText={(v) => updateField(idx, 'notes', v)} />
          </Card>
        ))}

        {showPicker && (
          <Card style={styles.picker}>
            <Text style={styles.pickerTitle}>Selecionar exercício</Text>
            {catalog.map((ex) => (
              <TouchableOpacity key={ex.id} style={styles.pickerItem} onPress={() => addExercise(ex)}>
                <Text style={styles.pickerName}>{ex.name}</Text>
                <Text style={styles.pickerGroup}>{ex.muscleGroup}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Cancelar" variant="outline" onPress={() => setShowPicker(false)} style={{ marginTop: 8 }} />
          </Card>
        )}

        <Button title="Salvar treino" onPress={handleSave} loading={loading} style={styles.saveBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 13, color: colors.muted, marginBottom: 12, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  exName: { fontSize: 15, fontWeight: '600', color: colors.text },
  exRow: { flexDirection: 'row', gap: 8 },
  exField: { flex: 1 },
  exFieldLabel: { fontSize: 12, color: colors.muted, marginBottom: 4 },
  picker: { borderWidth: 1, borderColor: colors.border },
  pickerTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 10 },
  pickerItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between' },
  pickerName: { fontSize: 14, color: colors.text, fontWeight: '500' },
  pickerGroup: { fontSize: 12, color: colors.muted, textTransform: 'capitalize' },
  saveBtn: { marginTop: 8 },
});
