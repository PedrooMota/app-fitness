import { WorkoutExercise, Exercise } from '../types';

export type AuthStackParams = {
  Login: undefined;
  Register: undefined;
};

export type PersonalStackParams = {
  Tabs: undefined;
  InviteUser: undefined;
  UpgradePlan: undefined;
  ClientDetail: { clientId: string; clientName: string };
  CreateWorkout: { clientId: string; clientName: string };
  WorkoutDetail: { workoutId: string; clientId: string; clientName: string };
  CreateDiet: { clientId: string; clientName: string };
  DietDetail: { dietId: string; clientId: string; clientName: string };
};

export type UserStackParams = {
  Tabs: undefined;
  WorkoutDetail: { workoutId: string };
  LogWorkout: {
    workoutId: string;
    workoutName: string;
    exercises: WorkoutExercise[];
    exerciseMap: Record<string, Exercise>;
  };
  DietDetail: { dietId: string };
};
