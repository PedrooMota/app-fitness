import { api } from './client';
import { AuthResponse, UserRole } from '../types';

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data);

export const register = (data: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}) => api.post<AuthResponse>('/auth/register', data).then((r) => r.data);
