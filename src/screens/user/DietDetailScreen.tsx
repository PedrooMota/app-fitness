import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserStackParams } from '../../navigation/types';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as dietApi from '../../api/diet';
import { DietPlan } from '../../types';

type Props = NativeStackScreenProps<UserStackParams, 'DietDetail'>;

export const UserDietDetailScreen: React.FC<Props> = ({ route }) => {
  const { dietId } = route.params;
  const [plan, setPlan] = useState<DietPlan | null>(null);

  useEffect(() => {
    dietApi.getDietPlan(dietId).then(setPlan).catch(() => {});
  }, [dietId]);

  if (!plan) return null;

  const totalCalories = plan.meals.reduce((acc, meal) => acc + meal.foods.reduce((a, f) => a + (f.calories || 0), 0), 0);
  const totalProtein = plan.meals.reduce((acc, meal) => acc + meal.foods.reduce((a, f) => a + (f.protein || 0), 0), 0);
  const totalCarbs = plan.meals.reduce((acc, meal) => acc + meal.foods.reduce((a, f) => a + (f.carbs || 0), 0), 0);
  const totalFat = plan.meals.reduce((acc, meal) => acc + meal.foods.reduce((a, f) => a + (f.fat || 0), 0), 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.planName}>{plan.name}</Text>
        {plan.description && <Text style={styles.description}>{plan.description}</Text>}

        {totalCalories > 0 && (
          <View style={styles.macroRow}>
            <MacroBox label="Calorias" value={`${totalCalories}`} unit="kcal" color={colors.warning} />
            <MacroBox label="Proteína" value={`${totalProtein}g`} unit="" color={colors.primary} />
            <MacroBox label="Carbs" value={`${totalCarbs}g`} unit="" color={colors.success} />
            <MacroBox label="Gordura" value={`${totalFat}g`} unit="" color={colors.secondary} />
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
                {food.calories ? <Text style={[styles.macroText, { color: colors.warning }]}>{food.calories}kcal</Text> : null}
                {food.protein ? <Text style={[styles.macroText, { color: colors.primary }]}>P:{food.protein}g</Text> : null}
                {food.carbs ? <Text style={[styles.macroText, { color: colors.success }]}>C:{food.carbs}g</Text> : null}
              </View>
            </View>
          ))}
        </Card>
      ))}
    </ScrollView>
  );
};

const MacroBox: React.FC<{ label: string; value: string; unit: string; color: string }> = ({ label, value, unit, color }) => (
  <View style={[macroStyles.box, { borderColor: color }]}>
    <Text style={[macroStyles.value, { color }]}>{value}{unit}</Text>
    <Text style={macroStyles.label}>{label}</Text>
  </View>
);

const macroStyles = StyleSheet.create({
  box: { flex: 1, borderWidth: 1.5, borderRadius: 8, padding: 8, alignItems: 'center' },
  value: { fontSize: 14, fontWeight: '700' },
  label: { fontSize: 10, color: colors.muted, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  planName: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  description: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  macroRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealName: { fontSize: 16, fontWeight: '700', color: colors.text },
  mealTime: { fontSize: 14, fontWeight: '600', color: colors.success },
  mealNotes: { fontSize: 13, color: colors.muted, marginBottom: 8, fontStyle: 'italic' },
  foodRow: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  foodInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  foodName: { fontSize: 14, fontWeight: '500', color: colors.text },
  foodQty: { fontSize: 13, color: colors.muted },
  macros: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  macroText: { fontSize: 12, fontWeight: '600' },
});
