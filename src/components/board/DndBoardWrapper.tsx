import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  type DragStartEvent,
  type DragEndEvent,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
} from '@dnd-kit/core';
import { TaskUI } from '@/components/ui/Task';
import { useBoardStore } from '@/stores/useBoardStore';
import { Board } from './Board';

export const DndBoardWrapper = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const sensors = useSensors(mouseSensor);
  const taskCards = useBoardStore(state => state.taskCards);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type !== 'card') return;

    const cardId = active.id as string;

    const sourceColumnId = activeData.columnId as string;

    let targetColumnId: string | null = null;

    if (overData?.type === 'cards-area') {
      targetColumnId = overData.columnId as string;
    } else if (overData?.type === 'card') {
      targetColumnId = overData.columnId as string;
    } else if (overData?.type === 'column') {
      targetColumnId = overData.columnId as string;
    }

    if (!targetColumnId || !sourceColumnId) {
      setActiveId(null);
      return;
    }

    const state = useBoardStore.getState();

    const card = state.taskCards[cardId];
    if (!card) {
      setActiveId(null);
      return;
    }

    const targetCards = state.cardsByColumn[targetColumnId] || [];

    let newIndex: number;

    if (overData?.type === 'card') {
      const overCardId = over.id as string;
      const overIndex = targetCards.findIndex(id => id === overCardId);
      newIndex = overIndex;
    } else {
      newIndex = targetCards.length;
    }

    if (sourceColumnId !== targetColumnId) {
      state.moveCard(cardId, targetColumnId, newIndex);
    }

    setActiveId(null);
  }, []);
  const memoizedBoard = useMemo(() => <Board />, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {memoizedBoard}

      <DragOverlay>
        {activeId && taskCards[activeId] ? (
          <div
            style={{
              opacity: 0.9,
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              transform: 'rotate(2deg)',
              cursor: 'grabbing',
            }}
          >
            <TaskUI
              title={taskCards[activeId].title}
              description={taskCards[activeId].description}
              variant="compact"
              interactive={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
