import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors, shadows } from '../../theme';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'flash',
    iconBg: colors.primaryLight,
    iconColor: colors.primary,
    title: 'Bem-vindo ao\nFitApp!',
    description:
      'Seu personal trainer já preparou tudo pra você. Aqui você encontra seus treinos, dieta e acompanha sua evolução.',
  },
  {
    id: '2',
    icon: 'barbell',
    iconBg: colors.primaryLight,
    iconColor: colors.primary,
    title: 'Seus Treinos',
    description:
      'Acesse os treinos prescritos pelo seu personal, registre cada sessão e acompanhe seu histórico de evolução.',
  },
  {
    id: '3',
    icon: 'restaurant',
    iconBg: colors.successLight,
    iconColor: colors.success,
    title: 'Sua Dieta',
    description:
      'Visualize seu plano alimentar com todas as refeições, alimentos e macros definidos pelo seu personal trainer.',
  },
];

export const WelcomeScreen: React.FC = () => {
  const { user, dismissWelcome } = useAuth();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      dismissWelcome();
    }
  };

  const renderSlide = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={styles.slide}>
      <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={56} color={item.iconColor} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity onPress={dismissWelcome} style={styles.skipBtn}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      )}

      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Olá, {user?.name?.split(' ')[0]}! 👋</Text>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        style={styles.list}
      />

      {/* Footer — padding dinâmico para home indicator do iPhone */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
                i < currentIndex && styles.dotPast,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, isLast && styles.buttonSuccess]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{isLast ? 'Começar' : 'Próximo'}</Text>
          <View style={styles.buttonIcon}>
            <Ionicons
              name={isLast ? 'checkmark' : 'arrow-forward'}
              size={18}
              color={isLast ? colors.success : colors.primary}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipBtn: {
    position: 'absolute',
    top: 16,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  greeting: {
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 8,
  },
  greetingText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  list: { flex: 1 },
  slide: {
    width,
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    ...shadows.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 25,
    paddingHorizontal: 8,
  },
  footer: {
    paddingHorizontal: 28,
    gap: 20,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 28,
    borderRadius: 4,
  },
  dotPast: {
    backgroundColor: colors.muted,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 28,
    gap: 10,
    width: '100%',
  },
  buttonSuccess: {
    backgroundColor: colors.successLight,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  buttonIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
});
