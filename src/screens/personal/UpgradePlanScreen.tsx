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
import { useAuth } from '../../contexts/AuthContext';
import { colors, shadows } from '../../theme';

type Props = NativeStackScreenProps<PersonalStackParams, 'UpgradePlan'>;

/* ── Definição dos planos ─────────────────────────────── */

type PlanId = 'free' | 'plus' | 'pro';

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  priceNote: string;
  color: string;
  colorLight: string;
  icon: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    priceNote: 'para sempre',
    color: colors.muted,
    colorLight: colors.border,
    icon: 'person-outline',
    features: [
      'Acesso ao dashboard',
      'Visualizar sua conta',
    ],
    cta: 'Plano atual',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 'R$ 49,90',
    priceNote: 'por mês',
    color: colors.primary,
    colorLight: colors.primaryLight,
    icon: 'flash',
    features: [
      'Até 10 alunos no time',
      'Criar treinos para alunos',
      'Criar planos de dieta',
      'E-mail automático de boas-vindas',
      'Acompanhar evolução dos alunos',
    ],
    cta: 'Assinar Plus',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 89,90',
    priceNote: 'por mês',
    color: '#7C3AED',
    colorLight: '#F5F3FF',
    icon: 'diamond',
    features: [
      'Alunos ilimitados',
      'Tudo do plano Plus',
      'Relatórios de desempenho',
      'Suporte prioritário',
    ],
    cta: 'Assinar Pro',
  },
];

/* ── Componente ───────────────────────────────────────── */

export const UpgradePlanScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const currentPlan = user?.plan ?? 'free';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Escolha seu plano</Text>
        <Text style={styles.heroSubtitle}>
          Desbloqueie as ferramentas completas para gerenciar seus alunos com eficiência.
        </Text>
      </View>

      {/* Cards de planos */}
      {PLANS.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        const isDisabled = plan.id === 'free';

        return (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.popular && styles.planCardPopular,
              isCurrent && styles.planCardCurrent,
            ]}
          >
            {/* Badge popular */}
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Ionicons name="star" size={11} color={colors.white} />
                <Text style={styles.popularBadgeText}>Mais popular</Text>
              </View>
            )}

            {/* Header do plano */}
            <View style={styles.planHeader}>
              <View style={[styles.planIconWrap, { backgroundColor: plan.colorLight }]}>
                <Ionicons name={plan.icon as any} size={22} color={plan.color} />
              </View>
              <View style={styles.planTitleBlock}>
                <Text style={styles.planName}>{plan.name}</Text>
                {isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Plano atual</Text>
                  </View>
                )}
              </View>
              <View style={styles.planPriceBlock}>
                <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                <Text style={styles.planPriceNote}>{plan.priceNote}</Text>
              </View>
            </View>

            {/* Divisor */}
            <View style={styles.divider} />

            {/* Features */}
            <View style={styles.featuresBlock}>
              {plan.features.map((feat, i) => (
                <View key={i} style={styles.featureRow}>
                  <View style={[styles.featureCheck, { backgroundColor: plan.colorLight }]}>
                    <Ionicons name="checkmark" size={13} color={plan.color} />
                  </View>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={[
                styles.ctaBtn,
                { backgroundColor: isDisabled || isCurrent ? colors.border : plan.color },
              ]}
              disabled={isDisabled || isCurrent}
              activeOpacity={0.8}
            >
              {!isDisabled && !isCurrent && (
                <Ionicons name="lock-open" size={15} color={colors.white} />
              )}
              <Text style={[
                styles.ctaBtnText,
                { color: isDisabled || isCurrent ? colors.muted : colors.white },
              ]}>
                {isCurrent ? 'Plano atual' : plan.cta}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* AbacatePay notice */}
      <View style={styles.paymentNotice}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.warning} />
        <Text style={styles.paymentNoticeText}>
          Pagamentos processados via <Text style={styles.paymentBold}>AbacatePay</Text> — disponível em breve
        </Text>
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

/* ── Estilos ──────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },

  hero: { alignItems: 'center', paddingVertical: 20, marginBottom: 8 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8 },
  heroSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },

  /* Card */
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  planCardPopular: {
    borderColor: colors.primary,
    ...shadows.md,
  },
  planCardCurrent: {
    borderColor: colors.border,
  },

  /* Badge popular */
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularBadgeText: { fontSize: 11, fontWeight: '700', color: colors.white },

  /* Header do plano */
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  planIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitleBlock: { flex: 1 },
  planName: { fontSize: 18, fontWeight: '800', color: colors.text },
  currentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  currentBadgeText: { fontSize: 10, fontWeight: '600', color: colors.muted },
  planPriceBlock: { alignItems: 'flex-end' },
  planPrice: { fontSize: 20, fontWeight: '800' },
  planPriceNote: { fontSize: 11, color: colors.muted, fontWeight: '500' },

  divider: { height: 1, backgroundColor: colors.border, marginBottom: 16 },

  /* Features */
  featuresBlock: { gap: 10, marginBottom: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, fontSize: 13, color: colors.text, fontWeight: '500' },

  /* CTA */
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 13,
  },
  ctaBtnText: { fontSize: 15, fontWeight: '700' },

  /* AbacatePay notice */
  paymentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warningLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  paymentNoticeText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  paymentBold: { fontWeight: '700', color: colors.warning },

  backBtn: { alignItems: 'center', paddingVertical: 8 },
  backText: { fontSize: 14, color: colors.muted, fontWeight: '500' },
});
