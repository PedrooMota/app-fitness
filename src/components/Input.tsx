import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<Props> = ({ label, error, isPassword, style, ...props }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.danger
    : focused
    ? colors.primary
    : colors.border;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>}
      <View style={[styles.container, { borderColor }]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!!isPassword && !show}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShow((p) => !p)} style={styles.eye}>
            <Ionicons name={show ? 'eye-off' : 'eye'} size={20} color={focused ? colors.primary : colors.muted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  labelFocused: { color: colors.primary },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  input: { flex: 1, height: 52, paddingHorizontal: 16, fontSize: 15, color: colors.text },
  eye: { paddingRight: 14 },
  error: { fontSize: 12, color: colors.danger, marginTop: 4 },
});
