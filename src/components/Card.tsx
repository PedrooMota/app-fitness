import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<Props> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.sm,
  },
});
