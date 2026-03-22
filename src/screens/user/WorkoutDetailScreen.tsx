import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { UserStackParams } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { VideoThumb } from '../../components/VideoThumb';
import { colors } from '../../theme';
import * as workoutsApi from '../../api/workouts';
import * as exercisesApi from '../../api/exercises';
import { Workout, Exercise } from '../../types';

type Props = NativeStackScreenProps<UserStackParams, 'WorkoutDetail'>;

export const UserWorkoutDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exerciseMap, setExerciseMap] = useState<Record<string, Exercise>>({});
  const [videoModal, setVideoModal] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [w, exList] = await Promise.all([
          workoutsApi.getWorkout(workoutId),
          exercisesApi.getExercises(),
        ]);
        setWorkout(w);
        const map: Record<string, Exercise> = {};
        exList.forEach((e) => { map[e.id] = e; });
        setExerciseMap(map);
      } catch {}
    })();
  }, [workoutId]);

  if (!workout) return null;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.workoutName}>{workout.name}</Text>
          {workout.description && <Text style={styles.description}>{workout.description}</Text>}
        </Card>

        <Text style={styles.sectionTitle}>{workout.exercises.length} Exercícios</Text>

        {workout.exercises.map((ex, idx) => {
          const info = exerciseMap[ex.exerciseId];
          return (
            <Card key={ex.id || idx}>
              <View style={styles.exRow}>
                <View style={styles.exNumber}>
                  <Text style={styles.exNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.exInfo}>
                  <Text style={styles.exName}>{info?.name || 'Exercício'}</Text>
                  {info?.muscleGroup && (
                    <Text style={styles.exGroup}>{info.muscleGroup}</Text>
                  )}
                </View>
                {info?.videoUrl && (
                  <TouchableOpacity
                    style={styles.videoBtn}
                    onPress={() => setVideoModal({ name: info.name, url: info.videoUrl! })}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="play-circle" size={18} color={colors.primary} />
                    <Text style={styles.videoBtnText}>Ver</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.chips}>
                <Chip icon="layers" label={`${ex.sets} séries`} />
                <Chip icon="repeat" label={`${ex.reps} reps`} />
                {ex.weight && <Chip icon="barbell" label={`${ex.weight}kg`} />}
                {ex.restSeconds && <Chip icon="timer" label={`${ex.restSeconds}s descanso`} />}
              </View>

              {ex.notes && <Text style={styles.notes}>{ex.notes}</Text>}
            </Card>
          );
        })}

        <Button
          title="Registrar treino realizado"
          onPress={() =>
            navigation.navigate('LogWorkout', {
              workoutId: workout.id,
              workoutName: workout.name,
              exercises: workout.exercises,
              exerciseMap,
            })
          }
          style={{ marginTop: 8 }}
        />
      </ScrollView>

      {/* Modal de vídeo */}
      <Modal
        visible={!!videoModal}
        animationType="slide"
        transparent
        onRequestClose={() => setVideoModal(null)}
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>{videoModal?.name}</Text>
              <TouchableOpacity onPress={() => setVideoModal(null)} style={styles.modalClose}>
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            {videoModal && <VideoThumb videoUrl={videoModal.url} />}
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

const Chip: React.FC<{ icon: any; label: string }> = ({ icon, label }) => (
  <View style={chipStyles.chip}>
    <Ionicons name={icon} size={12} color={colors.primary} />
    <Text style={chipStyles.text}>{label}</Text>
  </View>
);

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: { fontSize: 12, color: colors.primary, fontWeight: '500' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  workoutName: { fontSize: 20, fontWeight: '700', color: colors.text },
  description: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 10 },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  exNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exNumberText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  exInfo: { flex: 1 },
  exName: { fontSize: 15, fontWeight: '600', color: colors.text },
  exGroup: { fontSize: 12, color: colors.muted, textTransform: 'capitalize' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  notes: { fontSize: 13, color: colors.muted, marginTop: 8, fontStyle: 'italic' },
  videoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  videoBtnText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
