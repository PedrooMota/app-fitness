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
import { PersonalStackParams } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as dietApi from '../../api/diet';
import { Meal, FoodItem } from '../../types';

type Props = NativeStackScreenProps<PersonalStackParams, 'CreateDiet'>;

interface MealEntry extends Meal {
  foods: FoodItem[];
}

const emptyMeal = (): MealEntry => ({
  name: '',
  time: '',
  foods: [{ name: '', quantity: '', calories: undefined, protein: undefined, carbs: undefined, fat: undefined }],
  notes: '',
});

export const CreateDietScreen: React.FC<Props> = ({ route, navigation }) => {
  const { clientId, clientName } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [meals, setMeals] = useState<MealEntry[]>([emptyMeal()]);
  const [loading, setLoading] = useState(false);

  const addMeal = () => setMeals((prev) => [...prev, emptyMeal()]);

  const removeMeal = (mIdx: number) => setMeals((prev) => prev.filter((_, i) => i !== mIdx));

  const updateMeal = (mIdx: number, field: keyof Omit<MealEntry, 'foods'>, value: string) => {
    setMeals((prev) => prev.map((m, i) => (i === mIdx ? { ...m, [field]: value } : m)));
  };

  const addFood = (mIdx: number) => {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mIdx
          ? { ...m, foods: [...m.foods, { name: '', quantity: '', calories: undefined, protein: undefined, carbs: undefined, fat: undefined }] }
          : m,
      ),
    );
  };

  const removeFood = (mIdx: number, fIdx: number) => {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mIdx ? { ...m, foods: m.foods.filter((_, fi) => fi !== fIdx) } : m,
      ),
    );
  };

  const updateFood = (mIdx: number, fIdx: number, field: keyof FoodItem, value: string) => {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mIdx
          ? { ...m, foods: m.foods.map((f, fi) => (fi === fIdx ? { ...f, [field]: value || undefined } : f)) }
          : m,
      ),
    );
  };

  const handleSave = async () => {
    if (!name) { Alert.alert('Atenção', 'Dê um nome ao plano.'); return; }
    if (meals.some((m) => !m.name || !m.time)) { Alert.alert('Atenção', 'Preencha nome e horário de cada refeição.'); return; }
    setLoading(true);
    try {
      await dietApi.createDietPlan({
        name: name.trim(),
        description: description.trim() || undefined,
        targetUserId: clientId,
        meals: meals.map((m) => ({
          name: m.name,
          time: m.time,
          notes: m.notes || undefined,
          foods: m.foods.filter((f) => f.name).map((f) => ({
            name: f.name,
            quantity: f.quantity || '—',
            calories: f.calories ? Number(f.calories) : undefined,
            protein: f.protein ? Number(f.protein) : undefined,
            carbs: f.carbs ? Number(f.carbs) : undefined,
            fat: f.fat ? Number(f.fat) : undefined,
          })),
        })),
      });
      Alert.alert('Sucesso', 'Plano de dieta criado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
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
          <Text style={styles.forLabel}>Para: {clientName}</Text>
          <Input label="Nome do plano" placeholder="Ex: Dieta de ganho de massa" value={name} onChangeText={setName} />
          <Input label="Descrição (opcional)" placeholder="Observações gerais..." value={description} onChangeText={setDescription} />
        </Card>

        {meals.map((meal, mIdx) => (
          <Card key={mIdx}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>Refeição {mIdx + 1}</Text>
              {meals.length > 1 && (
                <TouchableOpacity onPress={() => removeMeal(mIdx)}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.mealRow}>
              <View style={{ flex: 2 }}>
                <Input label="Nome" placeholder="Café da manhã" value={meal.name} onChangeText={(v) => updateMeal(mIdx, 'name', v)} />
              </View>
              <View style={{ flex: 1 }}>
                <Input label="Horário" placeholder="07:00" value={meal.time} onChangeText={(v) => updateMeal(mIdx, 'time', v)} />
              </View>
            </View>

            <Text style={styles.foodsLabel}>Alimentos</Text>
            {meal.foods.map((food, fIdx) => (
              <View key={fIdx} style={styles.foodItem}>
                <View style={styles.foodHeader}>
                  <Text style={styles.foodNum}>{fIdx + 1}</Text>
                  {meal.foods.length > 1 && (
                    <TouchableOpacity onPress={() => removeFood(mIdx, fIdx)}>
                      <Ionicons name="close-circle" size={18} color={colors.muted} />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.foodRow}>
                  <View style={{ flex: 2 }}>
                    <Input placeholder="Frango grelhado" value={food.name} onChangeText={(v) => updateFood(mIdx, fIdx, 'name', v)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input placeholder="150g" value={food.quantity} onChangeText={(v) => updateFood(mIdx, fIdx, 'quantity', v)} />
                  </View>
                </View>
                <View style={styles.macroRow}>
                  <Input placeholder="Kcal" value={food.calories?.toString() || ''} onChangeText={(v) => updateFood(mIdx, fIdx, 'calories', v)} keyboardType="numeric" style={styles.macroInput} />
                  <Input placeholder="Prot(g)" value={food.protein?.toString() || ''} onChangeText={(v) => updateFood(mIdx, fIdx, 'protein', v)} keyboardType="numeric" style={styles.macroInput} />
                  <Input placeholder="Carb(g)" value={food.carbs?.toString() || ''} onChangeText={(v) => updateFood(mIdx, fIdx, 'carbs', v)} keyboardType="numeric" style={styles.macroInput} />
                  <Input placeholder="Fat(g)" value={food.fat?.toString() || ''} onChangeText={(v) => updateFood(mIdx, fIdx, 'fat', v)} keyboardType="numeric" style={styles.macroInput} />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addFoodBtn} onPress={() => addFood(mIdx)}>
              <Ionicons name="add" size={16} color={colors.success} />
              <Text style={styles.addFoodText}>Adicionar alimento</Text>
            </TouchableOpacity>
          </Card>
        ))}

        <Button title="+ Adicionar refeição" variant="outline" onPress={addMeal} style={{ marginBottom: 12 }} />
        <Button title="Salvar plano de dieta" onPress={handleSave} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 40 },
  forLabel: { fontSize: 13, color: colors.muted, marginBottom: 12, fontWeight: '500' },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  mealRow: { flexDirection: 'row', gap: 10 },
  foodsLabel: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 8, marginTop: 4 },
  foodItem: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, marginTop: 6 },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  foodNum: { fontSize: 12, fontWeight: '600', color: colors.muted },
  foodRow: { flexDirection: 'row', gap: 8 },
  macroRow: { flexDirection: 'row', gap: 6 },
  macroInput: { flex: 1 },
  addFoodBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  addFoodText: { fontSize: 13, color: colors.success, fontWeight: '600' },
});
