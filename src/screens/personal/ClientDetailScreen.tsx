import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { PersonalStackParams } from '../../navigation/types';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as workoutsApi from '../../api/workouts';
import * as dietApi from '../../api/diet';
import { Workout, DietPlan } from '../../types';

type Props = NativeStackScreenProps<PersonalStackParams, 'ClientDetail'>;
type Nav = NativeStackNavigationProp<PersonalStackParams>;

export const ClientDetailScreen: React.FC<Props> = ({ route }) => {
  const { clientId, clientName } = route.params;
  const navigation = useNavigation<Nav>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [w, d] = await Promise.all([
        workoutsApi.getClientWorkouts(clientId),
        dietApi.getClientDietPlans(clientId),
      ]);
      setWorkouts(w);
      setDiets(d);
    } catch {}
  }, [clientId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{clientName[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.clientName}>{clientName}</Text>
      </View>

      {/* Treinos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Treinos ({workouts.length})</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateWorkout', { clientId, clientName })}
        >
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={styles.addBtnText}>Novo</Text>
        </TouchableOpacity>
      </View>

      {workouts.length === 0 ? (
        <Card><Text style={styles.empty}>Nenhum treino criado ainda.</Text></Card>
      ) : (
        workouts.map((w) => (
          <Card key={w.id}>
            <TouchableOpacity onPress={() => navigation.navigate('WorkoutDetail', { workoutId: w.id, clientId, clientName })} activeOpacity={0.7}>
              <View style={styles.itemRow}>
                <View style={styles.itemIcon}>
                  <Ionicons name="barbell" size={20} color={colors.primary} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{w.name}</Text>
                  <Text style={styles.itemSub}>{w.exercises.length} exercícios</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </View>
            </TouchableOpacity>
          </Card>
        ))
      )}

      {/* Dieta */}
      <View style={[styles.sectionHeader, { marginTop: 8 }]}>
        <Text style={styles.sectionTitle}>Planos de dieta ({diets.length})</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateDiet', { clientId, clientName })}
        >
          <Ionicons name="add" size={18} color={colors.success} />
          <Text style={[styles.addBtnText, { color: colors.success }]}>Novo</Text>
        </TouchableOpacity>
      </View>

      {diets.length === 0 ? (
        <Card><Text style={styles.empty}>Nenhum plano de dieta criado ainda.</Text></Card>
      ) : (
        diets.map((d) => (
          <Card key={d.id}>
            <TouchableOpacity onPress={() => navigation.navigate('DietDetail', { dietId: d.id, clientId, clientName })} activeOpacity={0.7}>
              <View style={styles.itemRow}>
                <View style={[styles.itemIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="restaurant" size={20} color={colors.success} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{d.name}</Text>
                  <Text style={styles.itemSub}>{d.meals.length} refeições</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </View>
            </TouchableOpacity>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: colors.primary },
  clientName: { fontSize: 20, fontWeight: '700', color: colors.text },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: colors.text },
  itemSub: { fontSize: 13, color: colors.muted },
});
