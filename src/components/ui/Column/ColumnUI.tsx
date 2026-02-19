import { memo } from 'react';
import styles from './Column.module.css';
import Button from '../Button';
import type { ColumnUIProps } from '.';
export const ColumnUI = memo(
  ({ title, cardCount, onAddCard, className, children }: ColumnUIProps) => {
    return (
      <div className={`${styles.column}  ${className || ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.cardCount}>({cardCount})</span>
        </div>
        <div className={styles.cards}>{children}</div>
        <div className={styles.footer}>
          <Button variant="ghost" size="small" fullWidth onClick={onAddCard}>
            + Добавить карточку
          </Button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.cardCount === nextProps.cardCount &&
      prevProps.onAddCard === nextProps.onAddCard
    );
  }
);

ColumnUI.displayName = 'ColumnUI';
