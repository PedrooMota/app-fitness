import React, { useState } from 'react';
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
import { UserStackParams } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as logsApi from '../../api/workoutLogs';

type Props = NativeStackScreenProps<UserStackParams, 'LogWorkout'>;

interface SetEntry {
  reps: string;
  weight: string;
  completed: boolean;
}

interface ExEntry {
  exerciseId: string;
  exerciseName: string;
  sets: SetEntry[];
  notes: string;
}

export const LogWorkoutScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workoutId, workoutName, exercises, exerciseMap } = route.params;

  const [entries, setEntries] = useState<ExEntry[]>(
    exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: exerciseMap[ex.exerciseId]?.name || 'Exercício',
      sets: Array.from({ length: ex.sets }, () => ({ reps: String(ex.reps), weight: ex.weight ? String(ex.weight) : '', completed: false })),
      notes: '',
    })),
  );
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSet = (eIdx: number, sIdx: number) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === eIdx
          ? { ...e, sets: e.sets.map((s, si) => (si === sIdx ? { ...s, completed: !s.completed } : s)) }
          : e,
      ),
    );
  };

  const updateSet = (eIdx: number, sIdx: number, field: 'reps' | 'weight', value: string) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === eIdx
          ? { ...e, sets: e.sets.map((s, si) => (si === sIdx ? { ...s, [field]: value } : s)) }
          : e,
      ),
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await logsApi.createWorkoutLog({
        workoutId,
        durationMinutes: duration ? Number(duration) : undefined,
        notes: notes || undefined,
        exercises: entries.map((e) => ({
          exerciseId: e.exerciseId,
          notes: e.notes || undefined,
          sets: e.sets.map((s) => ({
            reps: Number(s.reps) || 0,
            weight: s.weight ? Number(s.weight) : undefined,
            completed: s.completed,
          })),
        })),
      });
      Alert.alert('Treino registrado!', 'Ótimo trabalho!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
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
          <Text style={styles.workoutName}>{workoutName}</Text>
          <Input label="Duração (minutos)" placeholder="60" value={duration} onChangeText={setDuration} keyboardType="numeric" />
          <Input label="Anotações gerais" placeholder="Como foi o treino?" value={notes} onChangeText={setNotes} />
        </Card>

        {entries.map((entry, eIdx) => (
          <Card key={eIdx}>
            <Text style={styles.exName}>{entry.exerciseName}</Text>
            <View style={styles.setHeader}>
              <Text style={[styles.setCol, { flex: 0.5 }]}>#</Text>
              <Text style={styles.setCol}>Reps</Text>
              <Text style={styles.setCol}>Peso</Text>
              <Text style={[styles.setCol, { flex: 0.7 }]}>OK</Text>
            </View>
            {entry.sets.map((set, sIdx) => (
              <View key={sIdx} style={styles.setRow}>
                <Text style={[styles.setNum, { flex: 0.5 }]}>{sIdx + 1}</Text>
                <View style={styles.setCol}>
                  <Input
                    value={set.reps}
                    onChangeText={(v) => updateSet(eIdx, sIdx, 'reps', v)}
                    keyboardType="numeric"
                    style={styles.setInput}
                  />
                </View>
                <View style={styles.setCol}>
                  <Input
                    value={set.weight}
                    onChangeText={(v) => updateSet(eIdx, sIdx, 'weight', v)}
                    keyboardType="numeric"
                    placeholder="0"
                    style={styles.setInput}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.checkBtn, set.completed && styles.checkBtnDone, { flex: 0.7 }]}
                  onPress={() => toggleSet(eIdx, sIdx)}
                >
                  <Ionicons name={set.completed ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={set.completed ? colors.success : colors.muted} />
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        ))}

        <Button title="Salvar treino realizado" onPress={handleSave} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 40 },
  workoutName: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  exName: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 10 },
  setHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  setCol: { flex: 1, fontSize: 12, color: colors.muted, fontWeight: '600', textAlign: 'center' },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  setNum: { textAlign: 'center', fontSize: 14, color: colors.muted, fontWeight: '600' },
  setInput: { textAlign: 'center', height: 40, fontSize: 14 },
  checkBtn: { alignItems: 'center', justifyContent: 'center', height: 40 },
  checkBtnDone: {},
});
