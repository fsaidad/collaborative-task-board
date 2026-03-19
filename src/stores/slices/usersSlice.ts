import type { StateCreator } from 'zustand';
import type { User } from '../types';

export interface UsersSlice {
  users: Record<string, User>;
}

export const createUsersSlice: StateCreator<UsersSlice> = () => ({
  users: {
    'user-1': {
      id: 'user-1',
      name: 'Анна Петрова',
      email: 'anna@example.com',
      avatar: 'https://i.pravatar.cc/150?u=anna',
    },
    'user-2': {
      id: 'user-2',
      name: 'Иван Сидоров',
      email: 'ivan@example.com',
      avatar: 'https://i.pravatar.cc/150?u=ivan',
    },
    'user-3': {
      id: 'user-3',
      name: 'Мария Иванова',
      email: 'maria@example.com',
      avatar: 'https://i.pravatar.cc/150?u=maria',
    },
    'user-4': {
      id: 'user-4',
      name: 'Петр Смирнов',
      email: 'petr@example.com',
      avatar: undefined,
    },
  },
});
