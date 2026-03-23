import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const isDisabled = !!(disabled || loading);

  const shadowStyle = !isDisabled && (variant === 'primary' || variant === 'success' || variant === 'danger')
    ? shadows.colored(
        variant === 'success' ? colors.success : variant === 'danger' ? colors.danger : colors.primary
      )
    : {};

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], sizeStyles[size], isDisabled && styles.disabled, shadowStyle, style]}
      onPress={onPress}
      activeOpacity={0.82}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white} />
      ) : (
        <View style={styles.inner}>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 18}
              color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={[styles.text, styles[`${variant}Text`], sizeTextStyles[size], textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  inner: { flexDirection: 'row', alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  success: { backgroundColor: colors.success },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  danger: { backgroundColor: colors.danger },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.45 },
  text: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  primaryText: { color: colors.white },
  successText: { color: colors.white },
  outlineText: { color: colors.primary },
  dangerText: { color: colors.white },
  ghostText: { color: colors.primary },
});

const sizeStyles = StyleSheet.create({
  sm: { height: 40, borderRadius: 10, paddingHorizontal: 16 },
  md: { height: 52 },
  lg: { height: 58, borderRadius: 16 },
});

const sizeTextStyles = StyleSheet.create({
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
});
