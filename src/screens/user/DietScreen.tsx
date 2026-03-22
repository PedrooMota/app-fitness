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
import * as dietApi from '../../api/diet';
import { DietPlan } from '../../types';

type Nav = NativeStackNavigationProp<UserStackParams>;

export const UserDietScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await dietApi.getDietPlans();
      setPlans(data);
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
      data={plans}
      keyExtractor={(i) => i.id}
      style={styles.container}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.success} />}
      ListEmptyComponent={
        <Card><Text style={styles.empty}>Nenhum plano de dieta disponível ainda.</Text></Card>
      }
      renderItem={({ item }) => {
        const totalCal = item.meals.reduce((acc, m) => acc + m.foods.reduce((a, f) => a + (f.calories || 0), 0), 0);
        return (
          <Card>
            <TouchableOpacity onPress={() => navigation.navigate('DietDetail', { dietId: item.id })} activeOpacity={0.7}>
              <View style={styles.row}>
                <View style={styles.icon}>
                  <Ionicons name="restaurant" size={22} color={colors.success} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  {item.description && <Text style={styles.desc}>{item.description}</Text>}
                  <View style={styles.meta}>
                    <Text style={styles.sub}>{item.meals.length} refeições</Text>
                    {totalCal > 0 && <Text style={styles.cal}>{totalCal} kcal/dia</Text>}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </View>
            </TouchableOpacity>
          </Card>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  desc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  meta: { flexDirection: 'row', gap: 10, marginTop: 4 },
  sub: { fontSize: 13, color: colors.muted },
  cal: { fontSize: 13, color: colors.success, fontWeight: '600' },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 8 },
});
