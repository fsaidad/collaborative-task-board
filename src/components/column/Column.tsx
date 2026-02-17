import { memo, useCallback } from 'react';
import { ColumnUI } from '../ui/Column';

import { TaskCard } from '@/components/tasks/TaskCard/TaskCard';
import { useBoardStore } from '@/stores/useBoardStore';
import { CardsDroppableArea } from '../DnDColumnWrapper/CardsDroppableArea';

interface ColumnProps {
  columnId: string;
}

export const Column = memo(
  ({ columnId }: ColumnProps) => {
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

    const cardsList = (
      <CardsDroppableArea columnId={columnId}>
        {cardIds.map(cardId => (
          <TaskCard key={cardId} columnId={columnId} cardId={cardId} onClick={handleCardClick} />
        ))}
      </CardsDroppableArea>
    );

    return (
      <ColumnUI
        title={column.title}
        cardCount={cardIds.length}
        onAddCard={handleAddCard}
        onCardClick={handleCardClick}
      >
        {cardsList}
      </ColumnUI>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.columnId === nextProps.columnId;
  }
);

Column.displayName = 'Column';
