export type UserRole = 'user' | 'personal';
export type Gender = 'male' | 'female' | 'other';
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'abs'
  | 'calves'
  | 'cardio';
export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: string;           // 'free' | 'pro' — controla acesso a funcionalidades pagas
  personalId?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: { id: string; email: string; role: UserRole };
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment?: Equipment;
  videoUrl?: string;
  createdAt: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  createdById: string;
  targetUserId: string;
  exercises: WorkoutExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface LogSet {
  reps: number;
  weight?: number;
  completed?: boolean;
}

export interface LogExercise {
  exerciseId: string;
  sets: LogSet[];
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId?: string;
  startedAt: string;
  finishedAt?: string;
  durationMinutes?: number;
  exercises: LogExercise[];
  notes?: string;
  createdAt: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  workoutsLast30Days: number;
  averageDuration: number;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface Meal {
  name: string;
  time: string;
  foods: FoodItem[];
  notes?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  targetUserId: string;
  startDate?: string;
  endDate?: string;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}
