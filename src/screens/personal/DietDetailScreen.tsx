import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PersonalStackParams } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme';
import * as dietApi from '../../api/diet';
import { DietPlan } from '../../types';

type Props = NativeStackScreenProps<PersonalStackParams, 'DietDetail'>;

export const PersonalDietDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { dietId, clientName } = route.params;
  const [plan, setPlan] = useState<DietPlan | null>(null);

  useEffect(() => {
    dietApi.getDietPlan(dietId).then(setPlan).catch(() => {});
  }, [dietId]);

  const handleDelete = () => {
    Alert.alert('Excluir plano', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await dietApi.deleteDietPlan(dietId);
            navigation.goBack();
          } catch (e: any) {
            Alert.alert('Erro', e.message);
          }
        },
      },
    ]);
  };

  if (!plan) return null;

  const totalCalories = plan.meals.reduce(
    (acc, meal) => acc + meal.foods.reduce((a, f) => a + (f.calories || 0), 0),
    0,
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.clientLabel}>Aluno: {clientName}</Text>
        <Text style={styles.planName}>{plan.name}</Text>
        {plan.description && <Text style={styles.description}>{plan.description}</Text>}
        {totalCalories > 0 && (
          <View style={styles.calorieBadge}>
            <Text style={styles.calorieText}>{totalCalories} kcal/dia</Text>
          </View>
        )}
      </Card>

      {plan.meals.map((meal, idx) => (
        <Card key={idx}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>
          {meal.notes && <Text style={styles.mealNotes}>{meal.notes}</Text>}
          {meal.foods.map((food, fIdx) => (
            <View key={fIdx} style={styles.foodRow}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodQty}>{food.quantity}</Text>
              </View>
              <View style={styles.macros}>
                {food.calories && <MacroChip label="kcal" value={food.calories} color={colors.warning} />}
                {food.protein && <MacroChip label="P" value={food.protein} color={colors.primary} />}
                {food.carbs && <MacroChip label="C" value={food.carbs} color={colors.success} />}
                {food.fat && <MacroChip label="G" value={food.fat} color={colors.secondary} />}
              </View>
            </View>
          ))}
        </Card>
      ))}

      <Button title="Excluir plano" variant="danger" onPress={handleDelete} style={{ marginTop: 8 }} />
    </ScrollView>
  );
};

const MacroChip: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <View style={[macroStyles.chip, { backgroundColor: `${color}18` }]}>
    <Text style={[macroStyles.text, { color }]}>{label}: {value}g</Text>
  </View>
);

const macroStyles = StyleSheet.create({
  chip: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  text: { fontSize: 11, fontWeight: '600' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  clientLabel: { fontSize: 13, color: colors.muted, marginBottom: 4 },
  planName: { fontSize: 20, fontWeight: '700', color: colors.text },
  description: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },
  calorieBadge: { marginTop: 10, backgroundColor: colors.primaryLight, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
  calorieText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealName: { fontSize: 16, fontWeight: '700', color: colors.text },
  mealTime: { fontSize: 14, fontWeight: '600', color: colors.primary },
  mealNotes: { fontSize: 13, color: colors.muted, marginBottom: 8, fontStyle: 'italic' },
  foodRow: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  foodInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  foodName: { fontSize: 14, fontWeight: '500', color: colors.text },
  foodQty: { fontSize: 13, color: colors.muted },
  macros: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
});
