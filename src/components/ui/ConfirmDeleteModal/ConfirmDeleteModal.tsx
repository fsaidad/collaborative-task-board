import { Modal } from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import { Trash2 } from 'lucide-react';
import styles from './ConfirmDeleteModal.module.css';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Подтверждение удаления',
  message,
  itemName,
}: ConfirmDeleteModalProps) => {
  const defaultMessage = itemName
    ? `Вы уверены, что хотите удалить «${itemName}»? Это действие нельзя отменить.`
    : 'Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Trash2 size={32} className={styles.icon} />
        </div>
        <p className={styles.message}>{message || defaultMessage}</p>
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={onClose}>
          Отмена
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Удалить
        </Button>
      </div>
    </Modal>
  );
};
