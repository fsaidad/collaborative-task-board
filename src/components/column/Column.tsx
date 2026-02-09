import { memo, useMemo } from 'react';
import styles from './Column.module.css';
import { useBoardStore } from '@/stores/useBoardStore';
import { TaskUI } from '../ui/Task';
import Button from '../ui/Button';

interface ColumnProps {
  columnId: string;
}

export const Column = memo(
  ({ columnId }: ColumnProps) => {
    const column = useBoardStore(state => state.columns[columnId]);
    const cardIds = useBoardStore(state => state.cardsByColumn[columnId] || []);
    const taskCards = useBoardStore(state => state.taskCards);

    const addCard = useBoardStore(state => state.addCard);

    const cards = useMemo(() => {
      return cardIds.map(id => taskCards[id]).filter(Boolean);
    }, [cardIds, taskCards]);

    if (!column) return null;

    const handleAddCard = () => {
      const title = prompt('Введите название карточки:');
      if (title?.trim()) {
        addCard(columnId, title.trim());
      }
    };

    console.log(`Column ${columnId} render, cards:`, cards.length);

    return (
      <div className={styles.column}>
        <div className={styles.header}>
          <h3 className={styles.title}>{column.title}</h3>
          <span className={styles.cardCount}>({cards.length})</span>
        </div>

        <div className={styles.cards}>
          {cards.map(card => (
            <div key={card.id} className={styles.cardWrapper}>
              <TaskUI
                title={card.title}
                description={card.description}
                variant="compact"
                interactive={true}
                onClick={() => console.log('Clicked:', card)}
              />
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" size="small" fullWidth onClick={handleAddCard}>
            + Добавить карточку
          </Button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.columnId === nextProps.columnId;
  }
);

Column.displayName = 'Column';
