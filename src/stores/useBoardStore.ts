import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// данные пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Priority {
  level: PriorityLevel;
  label: string;
}
// данные карточки (Нужно будет рассширить)
export interface TaskCard {
  id: string;
  title: string;
  description?: string;
  assigneIds: string[];
  columnId: string;
  createdAt?: Date;
  updatedAt?: Date;
  priority?: Priority;
}

// данные колонки
export interface Column {
  id: string;
  title: string;
  order?: number;
}

// интерфейс стора, какие поля хранит, какие методы имеет.
interface BoardStore {
  // данные типа ключ - значение
  columns: Record<string, Column>;
  taskCards: Record<string, TaskCard>;
  users: Record<string, User>;

  cardsByColumn: Record<string, string[]>;
  columnOrder: string[];
  // методы
  addColumn: (title: string) => void;
  deleteColumn: (columnId: string) => void;
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
// стор
export const useBoardStore = create<BoardStore>()(
  devtools(
    persist(
      (set, get) => ({
        //моковые пользователи
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
        //моковые колонки
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
        // карточки задач
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
        //какие карточки какой колонке принадлежат
        cardsByColumn: {
          '1': [],
          '2': ['task-3'],
          '3': ['task-1', 'task-2'],
        },
        // порядок колнок (Нужно для оптимизации перемещения колонок)
        columnOrder: ['1', '2', '3'],

        // метод для добавления колонок
        addColumn(title: string) {
          // имитация какого то айди p.s. НУЖНО БУДЕТ ИСПОЛЬЗОВАТЬ ЧТО ТО БОЛЕЕ НАДЕЖНОЕ НАПРИМЕР nanoid
          const columnId = `col-${Date.now()}`;

          set(state => {
            // получаю текущее состояние
            //место новой колонки,  такой метод потому что не массив
            const newOrder = Object.keys(state.columns).length;
            //возвращаю новый объект состояния
            return {
              columns: {
                // обновляю колонки
                ...state.columns, // копирую старые колонки
                [columnId]: {
                  // добавляю новую ключ - columnId, значение объект с полями id, title, order
                  id: columnId,
                  title,
                  order: newOrder,
                },
              },
              //обновляю карточки колонки
              cardsByColumn: {
                ...state.cardsByColumn,
                [columnId]: [],
              },
              // добавляю айди в порядок колонок
              columnOrder: [...state.columnOrder, columnId],
            };
          });
        },
        deleteColumn: (columnId: string) => {
          set(state => {
            // Проверяем, существует ли колонка
            if (!state.columns[columnId]) return state;

            // Получаем все карточки из удаляемой колонки
            const cardsToDelete = state.cardsByColumn[columnId] || [];

            // Создаем новые объекты без удаляемой колонки и её карточек
            const newColumns = { ...state.columns };
            delete newColumns[columnId];

            const newCardsByColumn = { ...state.cardsByColumn };
            delete newCardsByColumn[columnId];

            const newTaskCards = { ...state.taskCards };

            // Удаляем все карточки из этой колонки
            cardsToDelete.forEach(cardId => {
              delete newTaskCards[cardId];
            });

            // Удаляем columnId из порядка колонок
            const newColumnOrder = state.columnOrder.filter(id => id !== columnId);

            return {
              columns: newColumns,
              taskCards: newTaskCards,
              cardsByColumn: newCardsByColumn,
              columnOrder: newColumnOrder,
            };
          });
        },
        // метод для добавления карточек (Позже нужно будет расширить, для приоритета, комментариев)
        addCard(
          columnId: string,
          title: string,
          description?: string,
          assigneIds: string[] = [],
          priority?: Priority
        ) {
          const cardId = `card-${Date.now()}`;
          // дата создания карточки
          const now = new Date();

          set(state => {
            //получаю карточки которые находятся в колонке
            const currentCardsInColumn = state.cardsByColumn[columnId] || [];

            return {
              // обновляю карточки
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
              // обновляю состояние карточек в колонке, добавляю новое id
              cardsByColumn: {
                ...state.cardsByColumn,
                [columnId]: [...currentCardsInColumn, cardId],
              },
            };
          });

          return cardId;
        },
        // метод обновления карточки
        updateCard: (cardId: string, updates: Partial<TaskCard>) => {
          set(state => {
            // получаю состояние карточки по id
            const card = state.taskCards[cardId];
            if (!card) return state;
            // возвращаю новое состояние
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

        // метод удаления карточки
        deleteCard: cardId => {
          set(state => {
            //получаю по айди
            const card = state.taskCards[cardId];
            if (!card) return state;

            const columnCards = [...(state.cardsByColumn[card.columnId] || [])];
            // ищу место карточки
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
        // метод перемещения карточки расчитан сразу на то что карточку можно будет на определенное место переместить а не только в конец
        moveCard: (cardId: string, toColumnId: string, newIndex: number) => {
          set(state => {
            const card = state.taskCards[cardId];
            if (!card) return state;
            // колонка из которой берется карточка
            const fromColumnId = card.columnId;

            const newCardsByColumn = { ...state.cardsByColumn };

            newCardsByColumn[fromColumnId] = newCardsByColumn[fromColumnId].filter(
              id => id !== cardId
            );

            const toArray = [...(newCardsByColumn[toColumnId] || [])];
            toArray.splice(newIndex, 0, cardId);
            newCardsByColumn[toColumnId] = toArray;

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
      }),
      {
        name: 'board-storage',
      }
    )
  )
);
