export interface CardProps {
  title: string;
  description?: string;
  dueDateText?: string;
  isOverdue?: boolean;
  priority?: {
    level: 'low' | 'medium' | 'high';
    label: string;
  };
  status?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  commentsCount?: number;
  variant?: 'compact' | 'default';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAssign?: () => void;
  children?: React.ReactNode;
}
