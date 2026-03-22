import { api } from './client';
import { Exercise, MuscleGroup, Equipment } from '../types';

export const getExercises = (muscleGroup?: MuscleGroup) =>
  api
    .get<Exercise[]>('/exercises', { params: muscleGroup ? { muscleGroup } : undefined })
    .then((r) => r.data);

export const getExercise = (id: string) =>
  api.get<Exercise>(`/exercises/${id}`).then((r) => r.data);

export const createExercise = (data: {
  name: string;
  description?: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment?: Equipment;
}) => api.post<Exercise>('/exercises', data).then((r) => r.data);

export const deleteExercise = (id: string) => api.delete(`/exercises/${id}`);
