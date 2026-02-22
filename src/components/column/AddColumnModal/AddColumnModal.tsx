import { useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import { useBoardStore } from '@/stores/useBoardStore';
import styles from './AddColumnModal.module.css';

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddColumnModal = ({ isOpen, onClose }: AddColumnModalProps) => {
  const [title, setTitle] = useState('');
  const addColumn = useBoardStore(state => state.addColumn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addColumn(title.trim());
    setTitle('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новая колонка">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="column-title">Название колонки</label>
          <input
            id="column-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Например: To Do, In Progress, Done"
            autoFocus
            autoComplete="off"
          />
        </div>

        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            Создать
          </Button>
        </div>
      </form>
    </Modal>
  );
};
