import { memo, useCallback } from 'react';
import { useBoardStore } from '@/stores/useBoardStore';
import { TaskUI } from '@/components/ui/Task';

interface TaskCardProps {
  cardId: string;
  onClick?: (cardId: string) => void;
}

export const TaskCard = memo(({ cardId, onClick }: TaskCardProps) => {
  const card = useBoardStore(state => state.taskCards[cardId]);

  const handleClick = useCallback(() => {
    onClick?.(cardId); // ✅ Вызываем с cardId
  }, [onClick, cardId]);

  if (!card) return null;

  // Преобразуем данные для TaskUI
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
    dueDateText: card.updatedAt ? new Date(card.updatedAt).toLocaleDateString('ru-RU') : undefined,
    variant: 'compact' as const,
    interactive: true,
    onClick: handleClick,
  };
  console.log(`card:${cardId}`);
  return <TaskUI {...taskProps} />;
});

TaskCard.displayName = 'TaskCard';
