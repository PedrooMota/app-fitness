import { api } from './client';
import { WorkoutLog, WorkoutStats, LogExercise } from '../types';

export const getWorkoutLogs = () =>
  api.get<WorkoutLog[]>('/workout-logs').then((r) => r.data);

export const getWorkoutStats = () =>
  api.get<WorkoutStats>('/workout-logs/stats').then((r) => r.data);

export const getWorkoutLog = (id: string) =>
  api.get<WorkoutLog>(`/workout-logs/${id}`).then((r) => r.data);

export const createWorkoutLog = (data: {
  workoutId?: string;
  startedAt?: string;
  finishedAt?: string;
  durationMinutes?: number;
  exercises: LogExercise[];
  notes?: string;
}) => api.post<WorkoutLog>('/workout-logs', data).then((r) => r.data);

export const deleteWorkoutLog = (id: string) =>
  api.delete(`/workout-logs/${id}`);
