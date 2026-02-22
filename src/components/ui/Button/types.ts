import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант стиля кнопки */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  /** Размер кнопки */
  size?: 'small' | 'medium' | 'large';
  /** Иконка Lucide */
  icon?: LucideIcon;
  /** Позиция иконки относительно текста */
  iconPosition?: 'left' | 'right';
  /** Состояние загрузки */
  isLoading?: boolean;
  /** Занимать всю доступную ширину */
  fullWidth?: boolean;
}
