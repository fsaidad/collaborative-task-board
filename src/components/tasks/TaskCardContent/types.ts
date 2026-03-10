import type { TaskCard } from '@/stores/useBoardStore';

export interface TaskCardContentProps {
  card: TaskCard;
  onClick?: (cardId: string) => void;
  onEdit?: (cardId: string) => void;
  onDelete?: (cardId: string) => void;
}
