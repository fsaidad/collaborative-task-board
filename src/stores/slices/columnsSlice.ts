import type { StateCreator } from 'zustand';
import type { Column } from '../types';
import type { CardsSlice } from './cardsSlice';

// Интерфейс только для данных колонок
export interface ColumnsSlice {
  columns: Record<string, Column>;
  columnOrder: string[];
  cardsByColumn: Record<string, string[]>;

  // Методы для работы с колонками
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
}

// Используем пересечение типов для доступа к другим слайсам
export const createColumnsSlice: StateCreator<
  ColumnsSlice & CardsSlice, // Здесь указываем зависимости
  [],
  [],
  ColumnsSlice
> = (set, get) => ({
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

  cardsByColumn: {
    '1': [],
    '2': ['task-3'],
    '3': ['task-1', 'task-2'],
  },

  columnOrder: ['1', '2', '3'],

  addColumn: (title: string) => {
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

  deleteColumn: (columnId: string) => {
    set(state => {
      if (!state.columns[columnId]) return state;

      // Получаем карточки из удаляемой колонки
      const cardsToDelete = state.cardsByColumn[columnId] || [];

      // Создаем новый объект taskCards без удаляемых карточек
      // (обращаемся к cardsSlice через get())
      const currentTaskCards = (get() as any).taskCards || {};
      const newTaskCards = { ...currentTaskCards };
      cardsToDelete.forEach(cardId => {
        delete newTaskCards[cardId];
      });

      const newColumns = { ...state.columns };
      delete newColumns[columnId];

      const newCardsByColumn = { ...state.cardsByColumn };
      delete newCardsByColumn[columnId];

      const newColumnOrder = state.columnOrder.filter(id => id !== columnId);

      return {
        columns: newColumns,
        cardsByColumn: newCardsByColumn,
        columnOrder: newColumnOrder,
        taskCards: newTaskCards, // Обновляем и карточки
      };
    });
  },
});
