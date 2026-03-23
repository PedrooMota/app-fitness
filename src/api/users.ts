import { api } from './client';
import { User, Gender } from '../types';

export const getMe = () => api.get<User>('/users/me').then((r) => r.data);

export const updateMe = (data: {
  name?: string;
  phone?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  age?: number;
}) => api.patch<User>('/users/me', data).then((r) => r.data);

export const deleteMe = () => api.delete('/users/me');
