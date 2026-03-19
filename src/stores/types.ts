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

export const PRIORITY_OPTIONS: Priority[] = [
  { level: 'low', label: 'Низкий' },
  { level: 'medium', label: 'Средний' },
  { level: 'high', label: 'Высокий' },
];

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

export interface Column {
  id: string;
  title: string;
  order?: number;
}
