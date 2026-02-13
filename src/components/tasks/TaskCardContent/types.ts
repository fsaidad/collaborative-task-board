import type { TaskCard } from '@/stores/useBoardStore';

export interface TaskCardContentProps {
  card: TaskCard;
  onClick?: () => void;
}
