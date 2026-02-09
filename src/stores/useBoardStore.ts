import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface TaskCard {
  id: string;
  title: string;
  description?: string;
  assigneIds: string[];
  columnId: string;
  // order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Column {
  id: string;
  title: string;
  // order: number;
}

interface BoardStore {
  columns: Record<string, Column>;
  taskCards: Record<string, TaskCard>;

  cardsByColumn: Record<string, string[]>;
  columnOrder: string[];

  addColumn: (title: string) => void;
  addCard: (columnId: string, title: string, description?: string) => string;
  moveCard: (cardId: string, toColumnId: string, newIndex: number) => void;

  // getColumnsArray: () => Column[];
  // getCardsInColumn: (columnId: string) => TaskCard[];
}

export const useBoardStore = create<BoardStore>()(
  devtools(
    persist(
      (set, get) => ({
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
            assigneIds: ['user-1', 'user-2'],
            columnId: '3',
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-12'),
          },
          'task-2': {
            id: 'task-2',
            title: 'Настроить Zustand store',
            description: 'Реализовать глобальное состояние для управления доской задач',
            assigneIds: ['user-3'],
            columnId: '3',
            createdAt: new Date('2024-01-11'),
            updatedAt: new Date('2024-01-15'),
          },
          'task-3': {
            id: 'task-3',
            title: 'Drag and Drop функционал',
            description: 'Добавить возможность перетаскивания карточек между колонками',
            assigneIds: ['user-1', 'user-4'],
            columnId: '2',
            createdAt: new Date('2024-01-12'),
            updatedAt: new Date('2024-01-16'),
          },
        },

        cardsByColumn: { '1': ['task-1'], '2': ['task-3'], '3': ['task-2'] },
        columnOrder: ['1', '2', '3'],

        addColumn(title: string) {
          const columnId = `col-${Date.now()}`;
          set(state => {
            const newColumns = { ...state.columns };
            const newCardsByColumn = { ...state.cardsByColumn };

            newColumns[columnId] = {
              id: columnId,
              title,
              // order: Object.keys(state.columns).length,
            };
            newCardsByColumn[columnId] = [];
            return {
              columns: newColumns,
              cardsByColumn: newCardsByColumn,
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
        // Обновление карточки
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

            // 1. Копируем индексы
            const newCardsByColumn = { ...state.cardsByColumn };

            // 2. Удаляем из старой колонки
            newCardsByColumn[fromColumnId] = newCardsByColumn[fromColumnId].filter(
              id => id !== cardId
            );

            // 3. Вставляем в новую колонку
            const toArray = [...(newCardsByColumn[toColumnId] || [])];
            toArray.splice(newIndex, 0, cardId);
            newCardsByColumn[toColumnId] = toArray;

            // 4. Обновляем карточку
            const newTaskCards = {
              ...state.taskCards,
              [cardId]: {
                ...card,
                columnId: toColumnId, // Меняем columnId
                updatedAt: new Date(),
              },
            };

            return {
              taskCards: newTaskCards,
              cardsByColumn: newCardsByColumn,
            };
          });
        },
      }),
      {
        name: 'board-storage',
      }
    )
  )
);
