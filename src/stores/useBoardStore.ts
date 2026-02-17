import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface TaskCard {
  id: string;
  title: string;
  description?: string;
  assigneIds: string[]; // опечатка, но пока оставим как есть
  columnId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Column {
  id: string;
  title: string;
  order?: number; // Добавим order для сортировки колонок
}

interface BoardStore {
  columns: Record<string, Column>;
  taskCards: Record<string, TaskCard>;
  users: Record<string, User>; // Добавляем пользователей

  cardsByColumn: Record<string, string[]>;
  columnOrder: string[];

  addColumn: (title: string) => void;
  addCard: (columnId: string, title: string, description?: string) => string;
  updateCard: (cardId: string, updates: Partial<TaskCard>) => void;
  moveCard: (cardId: string, toColumnId: string, newIndex: number) => void;

  // Новые методы для работы с пользователями
  assignUserToCard: (cardId: string, userId: string) => void;
  removeUserFromCard: (cardId: string, userId: string) => void;
  getUsersForCard: (cardId: string) => User[];
  getUserById: (userId: string) => User | undefined;
}

export const useBoardStore = create<BoardStore>()(
  devtools(
    persist(
      (set, get) => ({
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

        columns: {
          '1': {
            id: '1',
            title: 'to do',
            order: 0,
          },
          '2': {
            id: '2',
            title: 'in Progress',
            order: 1,
          },
          '3': {
            id: '3',
            title: 'Done',
            order: 2,
          },
        },

        taskCards: {
          'task-1': {
            id: 'task-1',
            title: 'Инициализация проекта',
            description: 'Создать базовую структуру проекта React + TypeScript',
            assigneIds: ['user-1', 'user-2'], // Анна и Иван
            columnId: '3',
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-12'),
          },
          'task-2': {
            id: 'task-2',
            title: 'Настроить Zustand store',
            description: 'Реализовать глобальное состояние для управления доской задач',
            assigneIds: ['user-3'], // Только Мария
            columnId: '3',
            createdAt: new Date('2024-01-11'),
            updatedAt: new Date('2024-01-15'),
          },
          'task-3': {
            id: 'task-3',
            title: 'Drag and Drop функционал',
            description: 'Добавить возможность перетаскивания карточек между колонками',
            assigneIds: ['user-1', 'user-4'], // Анна и Петр
            columnId: '2',
            createdAt: new Date('2024-01-12'),
            updatedAt: new Date('2024-01-16'),
          },
        },

        cardsByColumn: {
          '1': [],
          '2': ['task-3'],
          '3': ['task-1', 'task-2'],
        },
        columnOrder: ['1', '2', '3'],

        addColumn(title: string) {
          const columnId = `col-${Date.now()}`;
          set(state => {
            const newOrder = Object.keys(state.columns).length;

            return {
              columns: {
                ...state.columns,
                [columnId]: {
                  id: columnId,
                  title,
                  order: newOrder,
                },
              },
              cardsByColumn: {
                ...state.cardsByColumn,
                [columnId]: [],
              },
              columnOrder: [...state.columnOrder, columnId],
            };
          });
        },

        addCard(columnId: string, title: string, description?: string) {
          const cardId = `card-${Date.now()}`;
          const now = new Date();

          set(state => {
            const currentCardsInColumn = state.cardsByColumn[columnId] || [];

            return {
              taskCards: {
                ...state.taskCards,
                [cardId]: {
                  id: cardId,
                  title,
                  columnId,
                  description,
                  assigneIds: [],
                  createdAt: now,
                  updatedAt: now,
                },
              },
              cardsByColumn: {
                ...state.cardsByColumn,
                [columnId]: [...currentCardsInColumn, cardId],
              },
            };
          });

          return cardId;
        },

        updateCard: (cardId: string, updates: Partial<TaskCard>) => {
          set(state => {
            const card = state.taskCards[cardId];
            if (!card) return state;

            return {
              taskCards: {
                ...state.taskCards,
                [cardId]: {
                  ...card,
                  ...updates,
                  updatedAt: new Date(),
                },
              },
            };
          });
        },

        moveCard: (cardId: string, toColumnId: string, newIndex: number) => {
          set(state => {
            const card = state.taskCards[cardId];
            if (!card) return state;

            const fromColumnId = card.columnId;

            // Не перемещаем, если колонка та же и индекс не меняется
            if (fromColumnId === toColumnId) {
              const currentIndex = state.cardsByColumn[fromColumnId].indexOf(cardId);
              if (currentIndex === newIndex) return state;
            }

            // Копируем индексы
            const newCardsByColumn = { ...state.cardsByColumn };

            // Удаляем из старой колонки
            newCardsByColumn[fromColumnId] = newCardsByColumn[fromColumnId].filter(
              id => id !== cardId
            );

            // Вставляем в новую колонку
            const toArray = [...(newCardsByColumn[toColumnId] || [])];
            toArray.splice(newIndex, 0, cardId);
            newCardsByColumn[toColumnId] = toArray;

            // Обновляем карточку
            const newTaskCards = {
              ...state.taskCards,
              [cardId]: {
                ...card,
                columnId: toColumnId,
                updatedAt: new Date(),
              },
            };

            return {
              taskCards: newTaskCards,
              cardsByColumn: newCardsByColumn,
            };
          });
        },

        // Новые методы для работы с пользователями
        assignUserToCard: (cardId: string, userId: string) => {
          set(state => {
            const card = state.taskCards[cardId];
            if (!card) return state;
            if (card.assigneIds.includes(userId)) return state;

            return {
              taskCards: {
                ...state.taskCards,
                [cardId]: {
                  ...card,
                  assigneIds: [...card.assigneIds, userId],
                  updatedAt: new Date(),
                },
              },
            };
          });
        },

        removeUserFromCard: (cardId: string, userId: string) => {
          set(state => {
            const card = state.taskCards[cardId];
            if (!card) return state;

            return {
              taskCards: {
                ...state.taskCards,
                [cardId]: {
                  ...card,
                  assigneIds: card.assigneIds.filter(id => id !== userId),
                  updatedAt: new Date(),
                },
              },
            };
          });
        },

        getUsersForCard: (cardId: string) => {
          const card = get().taskCards[cardId];
          if (!card) return [];

          return card.assigneIds.map(id => get().users[id]).filter(Boolean);
        },

        getUserById: (userId: string) => {
          return get().users[userId];
        },
      }),
      {
        name: 'board-storage',
      }
    )
  )
);
