import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { CardView } from '../CardView/CardView';
import { CardForm } from '../CardForm/CardForm';
import { useBoardStore } from '@/stores/useBoardStore';

type ModalMode = 'view' | 'edit' | 'create';

interface CardModalProps {
  initialMode: ModalMode;
  cardId?: string;
  columnId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CardModal = ({ initialMode, cardId, columnId, isOpen, onClose }: CardModalProps) => {
  const [currentMode, setCurrentMode] = useState<ModalMode>(initialMode);
  const card = useBoardStore(state => (cardId ? state.taskCards[cardId] : null));

  useEffect(() => {
    if (isOpen) {
      setCurrentMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const getTitle = () => {
    if (currentMode === 'view' && card) return card.title;
    if (currentMode === 'edit') return 'Редактирование';
    if (currentMode === 'create') return 'Новая карточка';
    return '';
  };

  const handleSave = () => {
    if (initialMode === 'edit') {
      onClose();
    } else {
      setCurrentMode('view');
    }
  };

  const handleCancel = () => {
    if (currentMode === 'edit' && initialMode === 'view') {
      setCurrentMode('view');
    } else {
      onClose();
    }
  };

  const handleEdit = () => setCurrentMode('edit');

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {currentMode === 'view' && cardId && <CardView cardId={cardId} onEdit={handleEdit} />}

      {currentMode === 'edit' && cardId && (
        <CardForm mode="edit" cardId={cardId} onSuccess={handleSave} onCancel={handleCancel} />
      )}

      {currentMode === 'create' && columnId && (
        <CardForm mode="create" columnId={columnId} onSuccess={onClose} onCancel={onClose} />
      )}
    </Modal>
  );
};
