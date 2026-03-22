import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { UserStackParams } from '../../navigation/types';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as workoutsApi from '../../api/workouts';
import { Workout } from '../../types';

type Nav = NativeStackNavigationProp<UserStackParams>;

export const UserWorkoutsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await workoutsApi.getWorkouts();
      setWorkouts(data);
    } catch {}
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={workouts}
      keyExtractor={(i) => i.id}
      style={styles.container}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      ListEmptyComponent={
        <Card><Text style={styles.empty}>Nenhum treino disponível ainda.</Text></Card>
      }
      renderItem={({ item }) => (
        <Card>
          <TouchableOpacity
            onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
            activeOpacity={0.7}
          >
            <View style={styles.row}>
              <View style={styles.icon}>
                <Ionicons name="barbell" size={22} color={colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                {item.description && <Text style={styles.desc}>{item.description}</Text>}
                <Text style={styles.sub}>{item.exercises.length} exercícios</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </View>
          </TouchableOpacity>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  desc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  sub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 8 },
});
