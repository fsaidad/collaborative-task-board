import { useMemo, useState } from 'react';
import styles from './Board.module.css';
import { useBoardStore } from '@/stores/index';
import Button from '../ui/Button';
import { Column } from '../column/Column';
import { AddColumnModal } from '../column/AddColumnModal/AddColumnModal';

export const Board = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columnOrder = useBoardStore(state => state.columnOrder);
  const columns = useBoardStore(state => state.columns);

  const columnsArray = useMemo(
    () => columnOrder.map(id => columns[id]).filter(Boolean),
    [columnOrder, columns]
  );

  const handleAddColumn = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <h1 className={styles.boardTitle}>Доска задач</h1>
      </div>

      <div className={styles.columns}>
        {columnsArray.map(column => (
          <Column key={column.id} columnId={column.id} />
        ))}

        <div className={styles.addColumnButton}>
          <Button variant="ghost" size="large" fullWidth onClick={handleAddColumn}>
            + Добавить колонку
          </Button>
        </div>
      </div>
      <AddColumnModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
