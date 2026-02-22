import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button/Button';
import { useBoardStore } from '@/stores/useBoardStore';
import styles from './CardForm.module.css';

interface CardFormProps {
  mode: 'edit' | 'create';
  cardId?: string;
  columnId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CardForm = ({ mode, cardId, columnId, onSuccess, onCancel }: CardFormProps) => {
  const card = useBoardStore(state => (cardId ? state.taskCards[cardId] : null));
  const updateCard = useBoardStore(state => state.updateCard);
  const addCard = useBoardStore(state => state.addCard);
  const users = useBoardStore(state => state.users);
  const allUsers = Object.values(users);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (mode === 'edit' && card) {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setSelectedUsers(card.assigneIds || []);
    } else {
      setTitle('');
      setDescription('');
      setSelectedUsers([]);
    }
  }, [mode, card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ← важно!
    if (!title.trim()) return;

    if (mode === 'edit' && cardId) {
      updateCard(cardId, {
        title: title.trim(),
        description: description.trim() || undefined,
        assigneIds: selectedUsers,
      });
    } else if (mode === 'create' && columnId) {
      addCard(columnId, title.trim(), description.trim() || undefined, selectedUsers);
    }

    onSuccess();
  };

  if (mode === 'edit' && !card) return null;

  return (
    <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
      <div className={styles.field}>
        <label htmlFor="title">Название</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Введите название карточки"
          autoFocus
          autoComplete="off"
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
          autoComplete="off"
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
                onChange={() => {
                  setSelectedUsers(prev =>
                    prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                  );
                }}
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

      <div className={styles.footer}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {mode === 'edit' ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};
