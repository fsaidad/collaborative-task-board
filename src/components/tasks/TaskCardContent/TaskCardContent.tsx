import { memo, useCallback, useState } from 'react';
import { TaskUI } from '@/components/ui/Task';
import type { TaskCardContentProps } from './types';
import { useBoardStore } from '@/stores/useBoardStore';
import { EditCardModal } from '../EditTaskModal/EditTaskModal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal/ConfirmDeleteModal';

export const TaskCardContent = memo(
  ({ card, onClick, onEdit, onDelete, onAssign }: TaskCardContentProps) => {
    console.log(`📦 Content render for card ${card.id}`);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const firstAssigneeId = card.assigneIds[0];
    const deleteCard = useBoardStore(state => state.deleteCard);
    const updateCard = useBoardStore(state => state.updateCard);
    const users = useBoardStore(state => state.users);

    // Получаем исполнителя
    const mainAssignee = useBoardStore(
      useCallback(
        state => (firstAssigneeId ? state.users[firstAssigneeId] : undefined),
        [firstAssigneeId]
      )
    );

    const handleEdit = () => {
      setIsEditModalOpen(true);
    };

    const handleDelete = () => {
      setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
      deleteCard(card.id);
    };

    const handleAssign = useCallback(() => {
      if (onAssign) {
        onAssign(card.id);
      } else {
        // Временное решение через prompt
        const availableUsers = Object.values(users)
          .map(u => `${u.id} (${u.name})`)
          .join(', ');

        const userId = prompt(`Назначить пользователя (доступны: ${availableUsers}):`);
        if (userId && users[userId] && !card.assigneIds.includes(userId)) {
          updateCard(card.id, {
            assigneIds: [...card.assigneIds, userId],
          });
        }
      }
    }, [card.id, card.assigneIds, onAssign, users, updateCard]);

    const taskProps = {
      title: card.title,
      description: card.description,
      assignee: mainAssignee
        ? {
            name: mainAssignee.name,
            avatar: mainAssignee.avatar ?? undefined,
          }
        : undefined,
      variant: 'compact' as const,
      interactive: true,
      onClick: () => onClick?.(card.id),
      onEdit: handleEdit,
      onDelete: handleDelete,
      onAssign: handleAssign,
    };

    return (
      <>
        {' '}
        <TaskUI {...taskProps} />{' '}
        <EditCardModal
          cardId={card.id}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          itemName={card.title}
          message={`Карточка «${card.title}» будет удалена без возможности восстановления.`}
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    // Оптимизация ререндеров
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.card.title === nextProps.card.title &&
      prevProps.card.description === nextProps.card.description &&
      prevProps.card.assigneIds.length === nextProps.card.assigneIds.length &&
      prevProps.card.updatedAt === nextProps.card.updatedAt &&
      prevProps.onEdit === nextProps.onEdit &&
      prevProps.onDelete === nextProps.onDelete &&
      prevProps.onAssign === nextProps.onAssign
    );
  }
);

TaskCardContent.displayName = 'TaskCardContent';
