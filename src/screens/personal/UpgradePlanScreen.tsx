import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PersonalStackParams } from '../../navigation/types';
import { colors, shadows } from '../../theme';

type Props = NativeStackScreenProps<PersonalStackParams, 'UpgradePlan'>;

const BENEFITS = [
  { icon: 'people', label: 'Convidar alunos ilimitados ao seu time' },
  { icon: 'barbell', label: 'Criar treinos personalizados para cada aluno' },
  { icon: 'restaurant', label: 'Montar planos de dieta completos' },
  { icon: 'stats-chart', label: 'Acompanhar evolução e histórico dos alunos' },
  { icon: 'mail', label: 'E-mail automático com credenciais de acesso' },
  { icon: 'shield-checkmark', label: 'Suporte prioritário' },
];

export const UpgradePlanScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
    >
      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <Ionicons name="flash" size={40} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Desbloqueie o plano Pro</Text>
        <Text style={styles.heroSubtitle}>
          Tenha acesso completo a todas as ferramentas para gerenciar seu time de alunos.
        </Text>
      </View>

      {/* Benefícios */}
      <Text style={styles.sectionTitle}>O que está incluído</Text>
      <View style={styles.benefitsCard}>
        {BENEFITS.map((b, i) => (
          <View key={i} style={[styles.benefit, i < BENEFITS.length - 1 && styles.benefitBorder]}>
            <View style={styles.benefitIcon}>
              <Ionicons name={b.icon as any} size={18} color={colors.primary} />
            </View>
            <Text style={styles.benefitText}>{b.label}</Text>
          </View>
        ))}
      </View>

      {/* Pagamento em breve */}
      <View style={styles.paymentCard}>
        <View style={styles.paymentHeader}>
          <Ionicons name="card" size={20} color={colors.warning} />
          <Text style={styles.paymentTitle}>Pagamento via AbacatePay</Text>
        </View>
        <Text style={styles.paymentDescription}>
          Em breve você poderá assinar o plano Pro diretamente pelo app com pagamento seguro via AbacatePay.
        </Text>
        <View style={styles.comingSoonBadge}>
          <Ionicons name="time-outline" size={13} color={colors.warning} />
          <Text style={styles.comingSoonText}>Em breve</Text>
        </View>
      </View>

      {/* CTA desabilitado */}
      <TouchableOpacity style={styles.ctaBtn} disabled activeOpacity={1}>
        <Ionicons name="flash" size={18} color={colors.white} />
        <Text style={styles.ctaText}>Contratar plano Pro</Text>
      </TouchableOpacity>
      <Text style={styles.ctaHint}>Pagamento disponível em breve</Text>

      {/* Voltar */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },

  /* Hero */
  hero: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 24,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.md,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },

  /* Benefícios */
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  benefitsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    ...shadows.sm,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  benefitBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },

  /* Pagamento */
  paymentCard: {
    backgroundColor: colors.warningLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  paymentDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
  },

  /* CTA */
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.muted,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  ctaHint: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
