import { memo, useCallback, useState } from 'react';
import { TaskUI } from '@/components/ui/Task';
import type { TaskCardContentProps } from './types';
import { useBoardStore } from '@/stores/useBoardStore';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal/ConfirmDeleteModal';
import { CardModal } from '../CardModal/CardModal';

export const TaskCardContent = memo(
  ({ card, onClick, onAssign }: TaskCardContentProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');

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

    const handleCardClick = useCallback(() => {
      setModalMode('view');
      setIsModalOpen(true);
      onClick?.(card.id);
    }, [card.id, onClick]);

    const handleEdit = useCallback(() => {
      setModalMode('edit');
      setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback(() => {
      setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
      deleteCard(card.id);
      setIsDeleteModalOpen(false);
    }, [card.id, deleteCard]);

    // Назначение (временно через prompt)
    const handleAssign = useCallback(() => {
      if (onAssign) {
        onAssign(card.id);
      } else {
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
      onClick: handleCardClick,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onAssign: handleAssign,
    };

    return (
      <>
        <TaskUI {...taskProps} />

        <CardModal
          initialMode={modalMode}
          cardId={card.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
