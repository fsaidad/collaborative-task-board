import { memo, useCallback, useState } from 'react';
import { ColumnUI } from '../ui/Column';
import { TaskCard } from '@/components/tasks/TaskCard/TaskCard';
import { useBoardStore } from '@/stores/useBoardStore';
import { CardsDroppableArea } from '../CardsDroppableArea/CardsDroppableArea';
import { CardModal } from '../tasks/CardModal/CardModal';

interface ColumnProps {
  columnId: string;
}

export const Column = memo(
  ({ columnId }: ColumnProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const column = useBoardStore(state => state.columns[columnId]);
    const cardIds = useBoardStore(state => state.cardsByColumn[columnId] || []);

    const handleAddCard = useCallback(() => {
      setIsModalOpen(true);
    }, []);

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
      <>
        <ColumnUI title={column.title} cardCount={cardIds.length} onAddCard={handleAddCard}>
          {cardsList}
        </ColumnUI>
        <CardModal
          initialMode="create"
          columnId={columnId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.columnId === nextProps.columnId;
  }
);

Column.displayName = 'Column';
