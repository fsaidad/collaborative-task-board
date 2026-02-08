import { type CardProps } from '../../ui/Task/types';

export interface TaskCardProps {
  taskId: string;
  variant?: CardProps['variant'];
  interactive?: boolean;
  className?: string;
  onClick?: (taskId: string) => void;
  showPriority?: boolean;
  showAssignee?: boolean;
  showDueDate?: boolean;
}
