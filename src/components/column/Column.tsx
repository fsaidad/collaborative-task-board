import { memo, useCallback, useState } from 'react';
import { ColumnUI } from '../ui/Column';
import { TaskCard } from '@/components/tasks/TaskCard/TaskCard';
import { useBoardStore } from '@/stores/useBoardStore';
import { CardsDroppableArea } from '../CardsDroppableArea/CardsDroppableArea';
import { CardModal } from '../tasks/CardModal/CardModal';
import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal/ConfirmDeleteModal';

interface ColumnProps {
  columnId: string;
}

export const Column = memo(
  ({ columnId }: ColumnProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const column = useBoardStore(state => state.columns[columnId]);
    const cardIds = useBoardStore(state => state.cardsByColumn[columnId] || []);
    const deleteColumn = useBoardStore(state => state.deleteColumn);

    const handleAddCard = useCallback(() => {
      setIsModalOpen(true);
    }, []);

    const handleDeleteClick = useCallback(() => {
      setIsDeleteModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      deleteColumn(columnId);
      setIsDeleteModalOpen(false);
    }, [columnId, deleteColumn]);

    if (!column) return null;

    const cardsList = (
      <CardsDroppableArea columnId={columnId}>
        {cardIds.map(cardId => (
          <TaskCard key={cardId} columnId={columnId} cardId={cardId} />
        ))}
      </CardsDroppableArea>
    );

    return (
      <>
        <ColumnUI
          title={column.title}
          cardCount={cardIds.length}
          onAddCard={handleAddCard}
          onDelete={handleDeleteClick}
        >
          {cardsList}
        </ColumnUI>

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Удаление колонки"
          itemName={column.title}
          message={`Колонка будет удалена вместе с задачами внутри неё!`}
        />
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
