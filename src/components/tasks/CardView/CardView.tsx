import { useBoardStore } from '@/stores/index';
import Button from '@/components/ui/Button/Button';
import { Edit2 } from 'lucide-react';
import styles from './CardView.module.css';

interface CardViewProps {
  cardId: string;
  onEdit: () => void;
}

export const CardView = ({ cardId, onEdit }: CardViewProps) => {
  const card = useBoardStore(state => state.taskCards[cardId]);
  const users = useBoardStore(state => state.users);

  if (!card) return null;

  const assignees = card.assigneIds.map(id => users[id]).filter(Boolean);

  return (
    <div className={styles.view}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Описание</h4>
        <p className={styles.description}>{card.description || 'Нет описания'}</p>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Исполнители</h4>
        {assignees.length > 0 ? (
          <div className={styles.assigneeList}>
            {assignees.map(user => (
              <div key={user.id} className={styles.assigneeItem}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Нет исполнителей</p>
        )}
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Дата создания</h4>
        <p>{new Date(card.createdAt || '').toLocaleDateString('ru-RU')}</p>
      </div>

      <div className={styles.actions}>
        <Button icon={Edit2} onClick={onEdit} fullWidth size="medium">
          Редактировать
        </Button>
      </div>
    </div>
  );
};
