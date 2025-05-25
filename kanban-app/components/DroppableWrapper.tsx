import React, { forwardRef } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

// react-beautiful-dnd의 defaultProps 경고를 해결하기 위한 래퍼 컴포넌트
function DroppableWrapper({ children, ...props }: DroppableProps) {
  return (
    <Droppable {...props}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[200px] ${
            snapshot.isDraggingOver ? 'bg-blue-50' : ''
          }`}
        >
          {children(provided, snapshot)}
        </div>
      )}
    </Droppable>
  );
};

export default DroppableWrapper;
