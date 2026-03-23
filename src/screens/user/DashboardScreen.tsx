import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { colors, shadows } from '../../theme';
import * as workoutsApi from '../../api/workouts';
import * as dietApi from '../../api/diet';
import * as logsApi from '../../api/workoutLogs';
import { Workout, DietPlan, WorkoutStats } from '../../types';
import { UserStackParams } from '../../navigation/types';

type Nav = NativeStackNavigationProp<UserStackParams>;

export const UserDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [w, d, s] = await Promise.all([
        workoutsApi.getWorkouts(),
        dietApi.getDietPlans(),
        logsApi.getWorkoutStats(),
      ]);
      setWorkouts(w);
      setDiets(d);
      setStats(s);
    } catch {}
  }, []);

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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.success} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header banner — paddingTop dinâmico para status bar/notch */}
      <View style={[styles.banner, { paddingTop: insets.top + 16 }]}>
        <View style={styles.bannerLeft}>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
          <View style={styles.rolePill}>
            <Ionicons name="person" size={11} color={colors.white} />
            <Text style={styles.roleText}>Aluno</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsRow}>
          <StatCard icon="trophy" label="Total" value={stats.totalWorkouts} color={colors.warning} bg={colors.warningLight} />
          <StatCard icon="time" label="Minutos" value={stats.totalMinutes} color={colors.primary} bg={colors.primaryLight} />
          <StatCard icon="calendar" label="30 dias" value={stats.workoutsLast30Days} color={colors.success} bg={colors.successLight} />
        </View>
      )}

      {/* Workouts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Treinos prescritos</Text>
        {workouts.length > 0 && <Text style={styles.seeAll}>{workouts.length} total</Text>}
      </View>

      {workouts.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="barbell-outline" size={32} color={colors.muted} />
          <Text style={styles.emptyText}>Nenhum treino disponível</Text>
        </Card>
      ) : (
        workouts.slice(0, 3).map((w) => (
          <Card key={w.id}>
            <TouchableOpacity
              onPress={() => navigation.navigate('WorkoutDetail', { workoutId: w.id })}
              activeOpacity={0.7}
            >
              <View style={styles.itemRow}>
                <View style={[styles.itemIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="barbell" size={20} color={colors.primary} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{w.name}</Text>
                  <Text style={styles.itemSub}>{w.exercises.length} exercícios</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </View>
            </TouchableOpacity>
          </Card>
        ))
      )}

      {/* Diets */}
      <View style={[styles.sectionHeader, { marginTop: 8 }]}>
        <Text style={styles.sectionTitle}>Planos de dieta</Text>
        {diets.length > 0 && <Text style={styles.seeAll}>{diets.length} total</Text>}
      </View>

      {diets.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="restaurant-outline" size={32} color={colors.muted} />
          <Text style={styles.emptyText}>Nenhum plano de dieta</Text>
        </Card>
      ) : (
        diets.slice(0, 2).map((d) => (
          <Card key={d.id}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DietDetail', { dietId: d.id })}
              activeOpacity={0.7}
            >
              <View style={styles.itemRow}>
                <View style={[styles.itemIcon, { backgroundColor: colors.successLight }]}>
                  <Ionicons name="restaurant" size={20} color={colors.success} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{d.name}</Text>
                  <Text style={styles.itemSub}>{d.meals.length} refeições</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.muted} />
              </View>
            </TouchableOpacity>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const StatCard: React.FC<{ icon: any; label: string; value: number; color: string; bg: string }> = ({
  icon, label, value, color, bg,
}) => (
  <View style={[styles.statCard, shadows.md]}>
    <View style={[styles.statIcon, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },

  banner: {
    backgroundColor: colors.success,
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  bannerLeft: { gap: 8 },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.white },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  roleText: { fontSize: 12, color: colors.white, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: -32,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 12, color: colors.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  seeAll: { fontSize: 13, color: colors.success, fontWeight: '600' },

  emptyCard: { marginHorizontal: 20, alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14, color: colors.muted },

  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: colors.text },
  itemSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
