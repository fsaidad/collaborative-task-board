import { clsx, type ClassValue } from 'clsx';

// утилита для объединения css классов
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
