import type { StateCreator } from 'zustand';
import type { TaskCard, Priority } from '../types';
import type { ColumnsSlice } from './columnsSlice';

export interface CardsSlice {
  taskCards: Record<string, TaskCard>;

  addCard: (
    columnId: string,
    title: string,
    description?: string,
    assigneIds?: string[],
    priority?: Priority
  ) => string;

  updateCard: (cardId: string, updates: Partial<TaskCard>) => void;
  moveCard: (cardId: string, toColumnId: string, newIndex: number) => void;
  deleteCard: (cardId: string) => void;
}

export const createCardsSlice: StateCreator<
  CardsSlice & ColumnsSlice, // Зависимость от ColumnsSlice
  [],
  [],
  CardsSlice
> = (set, get) => ({
  taskCards: {
    'task-1': {
      id: 'task-1',
      title: 'Инициализация проекта',
      description: 'Создать базовую структуру проекта React + TypeScript',
      assigneIds: ['user-1', 'user-2'],
      columnId: '3',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      priority: { level: 'medium', label: 'Средний' },
    },
    'task-2': {
      id: 'task-2',
      title: 'Настроить Zustand store',
      description: 'Реализовать глобальное состояние для управления доской задач',
      assigneIds: ['user-3'],
      columnId: '3',
      createdAt: new Date('2024-01-11'),
      updatedAt: new Date('2024-01-15'),
      priority: { level: 'high', label: 'Высокий' },
    },
    'task-3': {
      id: 'task-3',
      title: 'Drag and Drop функционал',
      description: 'Добавить возможность перетаскивания карточек между колонками',
      assigneIds: ['user-1', 'user-4'],
      columnId: '2',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-16'),
      priority: { level: 'low', label: 'Низкий' },
    },
  },

  addCard: (columnId, title, description, assigneIds = [], priority) => {
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
            assigneIds,
            createdAt: now,
            updatedAt: now,
            priority: priority || { level: 'medium', label: 'Средний' },
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

  updateCard: (cardId, updates) => {
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

  deleteCard: cardId => {
    set(state => {
      const card = state.taskCards[cardId];
      if (!card) return state;

      const columnCards = [...(state.cardsByColumn[card.columnId] || [])];
      const cardIndex = columnCards.indexOf(cardId);
      if (cardIndex > -1) columnCards.splice(cardIndex, 1);

      const newTaskCards = { ...state.taskCards };
      delete newTaskCards[cardId];

      return {
        taskCards: newTaskCards,
        cardsByColumn: {
          ...state.cardsByColumn,
          [card.columnId]: columnCards,
        },
      };
    });
  },

  moveCard: (cardId, toColumnId, newIndex) => {
    set(state => {
      const card = state.taskCards[cardId];
      if (!card) return state;

      const fromColumnId = card.columnId;
      const newCardsByColumn = { ...state.cardsByColumn };

      // Удаляем из исходной колонки
      newCardsByColumn[fromColumnId] = newCardsByColumn[fromColumnId].filter(id => id !== cardId);

      // Вставляем в целевую колонку
      const toArray = [...(newCardsByColumn[toColumnId] || [])];
      toArray.splice(newIndex, 0, cardId);
      newCardsByColumn[toColumnId] = toArray;

      return {
        taskCards: {
          ...state.taskCards,
          [cardId]: {
            ...card,
            columnId: toColumnId,
            updatedAt: new Date(),
          },
        },
        cardsByColumn: newCardsByColumn,
      };
    });
  },
});
