import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { colors, shadows } from '../../theme';
import * as teamsApi from '../../api/teams';
import * as workoutsApi from '../../api/workouts';
import * as dietApi from '../../api/diet';
import { User, Workout, DietPlan } from '../../types';

export const PersonalDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [members, setMembers] = useState<User[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [m, w, d] = await Promise.all([
        teamsApi.getMembers(),
        workoutsApi.getWorkouts(),
        dietApi.getDietPlans(),
      ]);
      setMembers(m);
      setWorkouts(w);
      setDiets(d);
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header banner — paddingTop dinâmico para status bar/notch */}
      <View style={[styles.banner, { paddingTop: insets.top + 16 }]}>
        <View style={styles.bannerLeft}>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
          <View style={styles.rolePill}>
            <Ionicons name="flash" size={11} color={colors.white} />
            <Text style={styles.roleText}>Personal Trainer</Text>
          </View>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard icon="people" label="Alunos" value={members.length} color={colors.primary} bg={colors.primaryLight} />
        <StatCard icon="barbell" label="Treinos" value={workouts.length} color={colors.secondary} bg={colors.secondaryLight} />
        <StatCard icon="restaurant" label="Dietas" value={diets.length} color={colors.success} bg={colors.successLight} />
      </View>

      {/* Recent members */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Alunos recentes</Text>
        {members.length > 3 && (
          <Text style={styles.seeAll}>{members.length} no total</Text>
        )}
      </View>

      {members.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="people-outline" size={32} color={colors.muted} />
          <Text style={styles.emptyText}>Nenhum aluno ainda</Text>
          <Text style={styles.emptyHint}>Convide pelo menu "Time"</Text>
        </Card>
      ) : (
        members.slice(0, 3).map((m) => (
          <Card key={m.id}>
            <View style={styles.memberRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{m.name[0].toUpperCase()}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{m.name}</Text>
                <Text style={styles.memberEmail}>{m.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </View>
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
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 56,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  emptyCard: { marginHorizontal: 20, alignItems: 'center', paddingVertical: 28, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyHint: { fontSize: 13, color: colors.muted },

  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.primary },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: '600', color: colors.text },
  memberEmail: { fontSize: 13, color: colors.muted },
});
