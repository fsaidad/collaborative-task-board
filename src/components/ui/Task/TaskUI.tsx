import { MessageSquare, Calendar } from 'lucide-react';
import styles from './TaskUI.module.css';
import { cn } from '@lib/utils';
import type { CardProps } from './types';
import { CardMenu } from '../CardMenu/CardMenu';

export const TaskUI = ({
  title,
  description,
  dueDateText,
  isOverdue,
  priority,
  status,
  assignee,
  commentsCount = 0,
  variant = 'compact',
  interactive = false,
  className,
  onClick,
  onEdit,
  onDelete,
  onAssign,
  children,
}: CardProps) => {
  return (
    <div
      className={cn(
        styles.card,
        styles[variant],
        interactive && styles.interactive,
        isOverdue && styles.overdue,
        className
      )}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={title}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {/* ✅ Меню с обработчиками */}
        <CardMenu onEdit={onEdit} onDelete={onDelete} />
      </div>

      {description && <p className={styles.description}>{description}</p>}

      {(priority || status) && (
        <div className={styles.meta}>
          {priority && (
            <div
              className={cn(styles.priorityBadge, styles[`priority-${priority.level}`])}
              title={`Приоритет: ${priority.label}`}
            >
              <span>{priority.label}</span>
            </div>
          )}
          {status && (
            <div className={styles.statusBadge}>
              <span>{status}</span>
            </div>
          )}
        </div>
      )}

      {children && <div className={styles.content}>{children}</div>}

      <div className={styles.footer}>
        {assignee && (
          <div className={styles.assignee} title={`Исполнитель: ${assignee.name}`}>
            <div className={styles.avatar}>
              {assignee.avatar ? (
                <img src={assignee.avatar} alt={assignee.name} loading="lazy" />
              ) : (
                <span>{assignee.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className={styles.assigneeName}>{assignee.name}</span>
          </div>
        )}

        {(dueDateText || commentsCount > 0) && (
          <div className={styles.actions}>
            {commentsCount > 0 && (
              <div className={styles.comments} title={`${commentsCount} комментариев`}>
                <MessageSquare size={14} aria-hidden="true" />
                <span>{commentsCount}</span>
              </div>
            )}
            {dueDateText && (
              <div
                className={cn(styles.dueDate, isOverdue && styles.overdue)}
                title={isOverdue ? 'Просрочено' : 'Срок выполнения'}
              >
                <Calendar size={14} aria-hidden="true" />
                <span>{dueDateText}</span>
                {isOverdue && <span className={styles.overdueBadge}>!</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
