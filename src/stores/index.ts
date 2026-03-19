import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type UsersSlice, createUsersSlice } from './slices/usersSlice';
import { type ColumnsSlice, createColumnsSlice } from './slices/columnsSlice';
import { type CardsSlice, createCardsSlice } from './slices/cardsSlice';

// Общий тип стора
export type BoardStore = UsersSlice & ColumnsSlice & CardsSlice;

export const useBoardStore = create<BoardStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createUsersSlice(...a),
        ...createColumnsSlice(...a),
        ...createCardsSlice(...a),
      }),
      {
        name: 'board-storage',
      }
    )
  )
);

export * from './types';
