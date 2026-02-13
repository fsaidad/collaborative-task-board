import { type CardProps } from '../../ui/Task/types';

export interface TaskCardProps {
  cardId: string;
  onClick?: (cardId: string) => void;
  variant?: CardProps['variant'];
  interactive?: boolean;
  className?: string;
  showPriority?: boolean;
  showAssignee?: boolean;
  showDueDate?: boolean;
}
