import { memo } from 'react';
import { TaskUI } from '@/components/ui/Task';
import type { TaskCardContentProps } from './types';

export const TaskCardContent = memo(
  ({ card, onClick }: TaskCardContentProps) => {
    console.log(`📦 Content render for card ${card.id}`);

    const taskProps = {
      title: card.title,
      description: card.description,
      assignee:
        card.assigneIds.length > 0
          ? {
              name: `User ${card.assigneIds[0].split('-')[1]}`,
              avatar: undefined,
            }
          : undefined,
      dueDateText: card.updatedAt
        ? new Date(card.updatedAt).toLocaleDateString('ru-RU')
        : undefined,
      variant: 'compact' as const,
      interactive: true,
      onClick,
    };

    return <TaskUI {...taskProps} />;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.card.title === nextProps.card.title &&
      prevProps.card.description === nextProps.card.description &&
      prevProps.card.assigneIds.length === nextProps.card.assigneIds.length &&
      prevProps.card.updatedAt === nextProps.card.updatedAt
    );
  }
);

TaskCardContent.displayName = 'TaskCardContent';
