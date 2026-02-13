import { memo, useCallback, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useBoardStore } from '@/stores/useBoardStore';
import { TaskCardContent } from '../TaskCardContent/TaskCardContent';
import type { TaskCardProps } from './types';

export const TaskCard = memo(
  ({ cardId, onClick }: TaskCardProps) => {
    const card = useBoardStore(useCallback(state => state.taskCards[cardId], [cardId]));

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: cardId,
      data: {
        type: 'card',
        card,
      },
    });

    const handleClick = useCallback(() => {
      onClick?.(cardId);
    }, [onClick, cardId]);

    const style = useMemo(
      (): React.CSSProperties => ({
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
        transition: 'opacity 0.2s',
      }),
      [isDragging]
    );

    if (!card) return null;

    console.log(`🟨 Card wrapper ${cardId} render`, { isDragging });

    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <TaskCardContent card={card} onClick={handleClick} />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.cardId === nextProps.cardId && prevProps.onClick === nextProps.onClick;
  }
);

TaskCard.displayName = 'TaskCard';
