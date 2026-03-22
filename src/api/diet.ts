import { api } from './client';
import { DietPlan, Meal } from '../types';

export const getDietPlans = () =>
  api.get<DietPlan[]>('/diet').then((r) => r.data);

export const getClientDietPlans = (clientId: string) =>
  api.get<DietPlan[]>(`/diet/clients/${clientId}`).then((r) => r.data);

export const getDietPlan = (id: string) =>
  api.get<DietPlan>(`/diet/${id}`).then((r) => r.data);

export const createDietPlan = (data: {
  name: string;
  description?: string;
  targetUserId?: string;
  startDate?: string;
  endDate?: string;
  meals: Meal[];
}) => api.post<DietPlan>('/diet', data).then((r) => r.data);

export const updateDietPlan = (
  id: string,
  data: { name?: string; description?: string; startDate?: string; endDate?: string; meals?: Meal[] },
) => api.patch<DietPlan>(`/diet/${id}`, data).then((r) => r.data);

export const deleteDietPlan = (id: string) => api.delete(`/diet/${id}`);
