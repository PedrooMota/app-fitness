import { api } from './client';
import { Workout } from '../types';

interface WorkoutExerciseInput {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

export const getWorkouts = () =>
  api.get<Workout[]>('/workouts').then((r) => r.data);

export const getClientWorkouts = (clientId: string) =>
  api.get<Workout[]>(`/workouts/clients/${clientId}`).then((r) => r.data);

export const getWorkout = (id: string) =>
  api.get<Workout>(`/workouts/${id}`).then((r) => r.data);

export const createWorkout = (data: {
  name: string;
  description?: string;
  targetUserId?: string;
  exercises: WorkoutExerciseInput[];
}) => api.post<Workout>('/workouts', data).then((r) => r.data);

export const updateWorkout = (
  id: string,
  data: { name?: string; description?: string; exercises?: WorkoutExerciseInput[] },
) => api.patch<Workout>(`/workouts/${id}`, data).then((r) => r.data);

export const deleteWorkout = (id: string) => api.delete(`/workouts/${id}`);
