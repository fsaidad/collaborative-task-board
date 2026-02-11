import { useMemo } from 'react';

import styles from './Board.module.css';
import { useBoardStore } from '@/stores/useBoardStore';
import Button from '../ui/Button';
import { Column } from '../column/Column';

export const Board = () => {
  const columnOrder = useBoardStore(state => state.columnOrder);
  const columns = useBoardStore(state => state.columns);

  const addColumn = useBoardStore(state => state.addColumn);

  const columnsArray = useMemo(
    () => columnOrder.map(id => columns[id]).filter(Boolean),
    [columnOrder, columns]
  );

  const handleAddColumn = () => {
    const title = prompt('Введите название колонки:');
    if (title?.trim()) {
      addColumn(title.trim());
    }
  };

  console.log('Board render'); // Для отладки

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
    </div>
  );
};
