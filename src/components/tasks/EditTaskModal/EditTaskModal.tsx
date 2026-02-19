import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import { useBoardStore } from '@/stores/useBoardStore';
import styles from './EditTaskModal.module.css';

interface EditCardModalProps {
  cardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCardModal = ({ cardId, isOpen, onClose }: EditCardModalProps) => {
  const card = useBoardStore(state => state.taskCards[cardId]);
  const updateCard = useBoardStore(state => state.updateCard);
  const users = useBoardStore(state => state.users);
  const allUsers = Object.values(users);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Загружаем данные карточки при открытии
  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setSelectedUsers(card.assigneIds || []);
    }
  }, [card]);

  const handleSave = () => {
    if (!title.trim()) return;

    updateCard(cardId, {
      title: title.trim(),
      description: description.trim() || undefined,
      assigneIds: selectedUsers,
    });

    onClose();
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать карточку">
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Название</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Введите название карточки"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Введите описание (можно использовать Markdown)"
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label>Исполнители</label>
          <div className={styles.userList}>
            {allUsers.map(user => (
              <label key={user.id} className={styles.userItem}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
                <div className={styles.userInfo}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{user.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          Сохранить
        </Button>
      </div>
    </Modal>
  );
};
