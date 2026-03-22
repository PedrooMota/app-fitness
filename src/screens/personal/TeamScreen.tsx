import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { PersonalStackParams } from '../../navigation/types';
import { Card } from '../../components/Card';
import { colors } from '../../theme';
import * as teamsApi from '../../api/teams';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

type Nav = NativeStackNavigationProp<PersonalStackParams>;

export const TeamScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleInvitePress = () => {
    if (user?.plan === 'free') {
      navigation.navigate('UpgradePlan');
    } else {
      navigation.navigate('InviteUser');
    }
  };

  const load = useCallback(async () => {
    try {
      const data = await teamsApi.getMembers();
      setMembers(data);
    } catch {}
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleRemove = (member: User) => {
    Alert.alert(
      'Remover aluno',
      `Deseja remover ${member.name} do seu time?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await teamsApi.removeMember(member.id);
              load();
            } catch (e: any) {
              Alert.alert('Erro', e.message);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        keyExtractor={(i) => i.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card>
            <Text style={styles.empty}>Nenhum aluno no time ainda.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card>
            <TouchableOpacity
              onPress={() => navigation.navigate('ClientDetail', { clientId: item.id, clientName: item.name })}
              activeOpacity={0.7}
            >
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                  <View style={styles.chips}>
                    {item.age && <Chip icon="calendar" label={`${item.age} anos`} />}
                    {item.weight && <Chip icon="scale" label={`${item.weight}kg`} />}
                    {item.height && <Chip icon="resize" label={`${item.height}cm`} />}
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeBtn}>
                    <Ionicons name="person-remove" size={18} color={colors.danger} />
                  </TouchableOpacity>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleInvitePress}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const Chip: React.FC<{ icon: any; label: string }> = ({ icon, label }) => (
  <View style={chipStyles.chip}>
    <Ionicons name={icon} size={11} color={colors.primary} />
    <Text style={chipStyles.text}>{label}</Text>
  </View>
);

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  text: { fontSize: 11, color: colors.primary, fontWeight: '500' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 100 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: colors.primary },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  email: { fontSize: 13, color: colors.muted, marginBottom: 6 },
  chips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  removeBtn: { padding: 4 },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 8 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
