import type { TaskCard } from '@/stores/index';

export interface TaskCardContentProps {
  card: TaskCard;
  onClick?: (cardId: string) => void;
  onEdit?: (cardId: string) => void;
  onDelete?: (cardId: string) => void;
}
