import { api } from './client';
import { User } from '../types';

export const inviteUser = (data: {
  name: string;
  email: string;
  password: string;
  weight?: number;
  height?: number;
  age?: number;
}) => api.post<User>('/teams/invite', data).then((r) => r.data);

export const getMembers = () =>
  api.get<User[]>('/teams/members').then((r) => r.data);

export const getMember = (userId: string) =>
  api.get<User>(`/teams/members/${userId}`).then((r) => r.data);

export const removeMember = (userId: string) =>
  api.delete(`/teams/members/${userId}`);
