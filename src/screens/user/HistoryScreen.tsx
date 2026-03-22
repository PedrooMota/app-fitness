import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as logsApi from '../../api/workoutLogs';
import { WorkoutLog, WorkoutStats } from '../../types';

export const UserHistoryScreen: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [l, s] = await Promise.all([logsApi.getWorkoutLogs(), logsApi.getWorkoutStats()]);
      setLogs(l);
      setStats(s);
    } catch {}
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Excluir registro', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await logsApi.deleteWorkoutLog(id);
            load();
          } catch (e: any) {
            Alert.alert('Erro', e.message);
          }
        },
      },
    ]);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <FlatList
      data={logs}
      keyExtractor={(i) => i.id}
      style={styles.container}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      ListHeaderComponent={
        stats ? (
          <View style={styles.statsRow}>
            <StatCard icon="trophy" label="Total" value={stats.totalWorkouts} color={colors.warning} />
            <StatCard icon="time" label="Minutos" value={stats.totalMinutes} color={colors.primary} />
            <StatCard icon="trending-up" label="Média (min)" value={stats.averageDuration} color={colors.success} />
          </View>
        ) : null
      }
      ListEmptyComponent={
        <Card><Text style={styles.empty}>Nenhum treino registrado ainda.</Text></Card>
      }
      renderItem={({ item }) => (
        <Card>
          <View style={styles.row}>
            <View style={styles.icon}>
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            </View>
            <View style={styles.info}>
              <Text style={styles.date}>{formatDate(item.startedAt)}</Text>
              <Text style={styles.sub}>{item.exercises.length} exercícios{item.durationMinutes ? ` • ${item.durationMinutes}min` : ''}</Text>
              {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </Card>
      )}
    />
  );
};

const StatCard: React.FC<{ icon: any; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
  <View style={[styles.statCard, { borderTopColor: color }]}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4, borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 10, color: colors.muted, fontWeight: '500', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  date: { fontSize: 15, fontWeight: '600', color: colors.text },
  sub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  notes: { fontSize: 12, color: colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  deleteBtn: { padding: 4 },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 8 },
});
