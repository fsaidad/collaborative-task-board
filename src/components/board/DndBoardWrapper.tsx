import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  type DragStartEvent,
  type DragEndEvent,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import { TaskUI } from '@/components/ui/Task';
import { useBoardStore } from '@/stores/useBoardStore';
import { Board } from './Board';

export const DndBoardWrapper = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const taskCards = useBoardStore(state => state.taskCards);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.data.current?.type === 'card') {
      const cardId = active.id as string;
      const activeCard = active.data.current?.card;

      let targetColumnId: string;
      let newIndex: number;

      if (over.data.current?.type === 'card') {
        targetColumnId = over.data.current?.card.columnId;
        newIndex = 0;
      } else {
        targetColumnId = over.id as string;
        const targetCards = useBoardStore.getState().cardsByColumn[targetColumnId] || [];
        newIndex = targetCards.length;
      }

      if (activeCard.columnId !== targetColumnId) {
        useBoardStore.getState().moveCard(cardId, targetColumnId, newIndex);
      }
    }

    setActiveId(null);
  }, []);

  const memoizedBoard = useMemo(() => <Board />, []);

  return (
    <DndContext
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
