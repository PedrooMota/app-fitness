import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: number;
  color: string;
}

export const MacroChip: React.FC<Props> = ({ label, value, color }) => (
  <View style={[styles.chip, { backgroundColor: `${color}18` }]}>
    <Text style={[styles.text, { color }]}>{label}: {value}g</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  text: { fontSize: 11, fontWeight: '600' },
});
