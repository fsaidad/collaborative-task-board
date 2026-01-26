// stores/taskStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Для сохранения в localStorage
import { devtools } from 'zustand/middleware'; // Для Redux DevTools

// Типы данных
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  createdAt: Date;
}

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: Date;
  assigneeId?: string; // ID пользователя
  comments?: Comment[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

// Состояние стора
interface TaskStoreState {
  // Данные
  tasks: Task[];
  users: User[]; // Для исполнителей

  // Состояния загрузки
  loading: boolean;
  loadingTasks: string[]; // ID задач, которые загружаются
  errors: Record<string, string>; // Ошибки по taskId

  // Действия (actions)
  fetchTask: (taskId: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  // Геттеры (вычисляемые значения)
  getTaskById: (taskId: string) => Task | undefined;
  getTasksByStatus: (status: Status) => Task[];
  getAssignee: (userId?: string) => User | undefined;

  // Вспомогательные методы
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
}

// Моковые данные для начала
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Алексей Иванов',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Создать дизайн главной страницы',
    description: 'Необходимо разработать современный дизайн',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date('2024-12-20'),
    assigneeId: '1',
    tags: ['дизайн', 'frontend'],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-05'),
    createdById: '2',
  },
  {
    id: '2',
    title: 'Исправить баг в API',
    description: 'Проблема с авторизацией пользователей',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date('2024-12-15'),
    assigneeId: '2',
    tags: ['backend', 'bug'],
    createdAt: new Date('2024-11-02'),
    updatedAt: new Date('2024-11-03'),
    createdById: '1',
  },
  {
    id: '3',
    title: 'Написать документацию',
    description: 'Документация для новых компонентов',
    priority: 'low',
    status: 'backlog',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
    createdById: '3',
  },
];

// Создаем стор
export const useTaskStore = create<TaskStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Начальное состояние
        tasks: mockTasks,
        users: mockUsers,
        loading: false,
        loadingTasks: [],
        errors: {},

        // Действия

        // Получить задачу по ID (с имитацией API)
        fetchTask: async (taskId: string) => {
          set(state => ({
            loadingTasks: [...state.loadingTasks, taskId],
            errors: { ...state.errors, [taskId]: '' },
          }));

          try {
            // Имитация запроса к API
            await new Promise(resolve => setTimeout(resolve, 300));

            const task = get().tasks.find(t => t.id === taskId);

            if (!task) {
              throw new Error(`Задача с ID ${taskId} не найдена`);
            }

            set(state => ({
              loadingTasks: state.loadingTasks.filter(id => id !== taskId),
            }));
          } catch (error) {
            set(state => ({
              loadingTasks: state.loadingTasks.filter(id => id !== taskId),
              errors: { ...state.errors, [taskId]: (error as Error).message },
            }));
          }
        },

        // Получить все задачи
        fetchTasks: async () => {
          set({ loading: true, errors: {} });

          try {
            // Имитация запроса к API
            await new Promise(resolve => setTimeout(resolve, 500));

            // В реальном приложении здесь был бы fetch
            set({ loading: false });
          } catch (error) {
            set({
              loading: false,
              errors: { general: (error as Error).message },
            });
          }
        },

        // Создать новую задачу
        createTask: async taskData => {
          set({ loading: true });

          try {
            await new Promise(resolve => setTimeout(resolve, 300));

            const newTask: Task = {
              ...taskData,
              id: `task-${Date.now()}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            set(state => ({
              tasks: [...state.tasks, newTask],
              loading: false,
            }));

            return newTask;
          } catch (error) {
            set({
              loading: false,
              errors: { create: (error as Error).message },
            });
            throw error;
          }
        },

        updateTask: async (taskId, updates) => {
          set(state => ({
            loadingTasks: [...state.loadingTasks, taskId],
          }));

          try {
            await new Promise(resolve => setTimeout(resolve, 300));
            set(state => ({
              tasks: state.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
              ),
              loadingTasks: state.loadingTasks.filter(id => id !== taskId),
            }));
          } catch (error) {
            set(state => ({
              loadingTasks: state.loadingTasks.filter(id => id !== taskId),
              errors: { ...state.errors, [taskId]: (error as Error).message },
            }));
            throw error;
          }
        },

        // Удалить задачу
        deleteTask: async taskId => {
          set(state => ({
            loadingTasks: [...state.loadingTasks, taskId],
          }));

          try {
            await new Promise(resolve => setTimeout(resolve, 300));

            set(state => ({
              tasks: state.tasks.filter(task => task.id !== taskId),
              loadingTasks: state.loadingTasks.filter(id => id !== taskId),
            }));
          } catch (error) {
            set(state => ({
              loadingTasks: state.loadingTasks.filter(id => id !== taskId),
              errors: { ...state.errors, [taskId]: (error as Error).message },
            }));
            throw error;
          }
        },

        // Геттеры

        // Получить задачу по ID
        getTaskById: taskId => {
          return get().tasks.find(task => task.id === taskId);
        },

        // Получить задачи по статусу
        getTasksByStatus: status => {
          return get().tasks.filter(task => task.status === status);
        },

        // Получить исполнителя по ID
        getAssignee: userId => {
          if (!userId) return undefined;
          return get().users.find(user => user.id === userId);
        },

        // Вспомогательные методы
        clearErrors: () => set({ errors: {} }),
        setLoading: loading => set({ loading }),
      }),
      {
        name: 'task-storage', // Ключ для localStorage
        partialize: state => ({
          tasks: state.tasks,
          users: state.users,
        }), // Что сохранять в localStorage
      }
    ),
    {
      name: 'TaskStore', // Имя в Redux DevTools
    }
  )
);
