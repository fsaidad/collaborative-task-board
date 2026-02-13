import { useBoardStore } from '@/stores/useBoardStore';
import { memo, useCallback } from 'react';
import { ColumnUI } from '../ui/Column';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  columnId: string;
}

export const Column = memo(
  ({ columnId }: ColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
      id: columnId,
      data: {
        type: 'column',
        columnId,
      },
    });
    const column = useBoardStore(state => state.columns[columnId]);
    const cardIds = useBoardStore(state => state.cardsByColumn[columnId] || []);
    const addCard = useBoardStore(state => state.addCard);

    const handleAddCard = useCallback(() => {
      const title = prompt('Введите название карточки:');
      if (title?.trim()) {
        addCard(columnId, title.trim());
      }
    }, [addCard, columnId]);

    const handleCardClick = useCallback((cardId: string) => {
      console.log('Card clicked:', cardId);
    }, []);

    if (!column) return null;

    console.log(`Column ${columnId} render, cardIds:`, cardIds.length);

    return (
      <div ref={setNodeRef}>
        <ColumnUI
          title={column.title}
          cardIds={cardIds}
          cardCount={cardIds.length}
          onAddCard={handleAddCard}
          onCardClick={handleCardClick}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.columnId === nextProps.columnId;
  }
);

Column.displayName = 'Column';
