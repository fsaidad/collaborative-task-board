import { memo, useCallback, useState } from 'react';
import { TaskUI } from '@/components/ui/Task';
import type { TaskCardContentProps } from './types';
import { useBoardStore } from '@/stores/index';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal/ConfirmDeleteModal';
import { CardModal } from '../CardModal/CardModal';

export const TaskCardContent = memo(
  ({ card, onClick }: TaskCardContentProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const firstAssigneeId = card.assigneIds[0];
    const deleteCard = useBoardStore(state => state.deleteCard);

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
      priority: card.priority,
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
      prevProps.onDelete === nextProps.onDelete
    );
  }
);

TaskCardContent.displayName = 'TaskCardContent';
