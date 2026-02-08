import type { ReactNode } from 'react';

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

  variant?: 'default' | 'compact';
  interactive?: boolean;
  className?: string;

  onClick?: () => void;
  children?: ReactNode;
}
