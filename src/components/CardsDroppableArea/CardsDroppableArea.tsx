import { useDroppable } from '@dnd-kit/core';
import { memo } from 'react';
import styles from './../ui/Column/Column.module.css';

interface CardsDroppableAreaProps {
  columnId: string;
  children: React.ReactNode;
}

export const CardsDroppableArea = memo(({ columnId, children }: CardsDroppableAreaProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `cards-${columnId}`,
    data: {
      type: 'cards-area',
      columnId,
    },
  });

  return (
    <div ref={setNodeRef} className={`${styles.cards} ${isOver ? styles.cardsOver : ''}`}>
      {children}
    </div>
  );
});

CardsDroppableArea.displayName = 'CardsDroppableArea';
