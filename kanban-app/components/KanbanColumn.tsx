import React, { useState } from 'react';
// @ts-ignore - react-beautiful-dnd 타입 선언 파일 누락 오류 무시
import { Draggable } from 'react-beautiful-dnd';
import { Column, Card } from '../types';
// @ts-ignore - KanbanCard 타입 선언 파일 누락 오류 무시
import KanbanCard from './KanbanCard';
import DroppableWrapper from './DroppableWrapper';

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onAddCard: (columnId: string, title: string) => void;
  onUpdateCard: (card: Card) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

function KanbanColumn({
  column,
  cards,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onDeleteColumn
}: KanbanColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle);
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  return (
    <div className="kanban-column">
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{column.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{cards.length}</span>
            {onDeleteColumn && (
              <button 
                onClick={() => {
                  if (window.confirm(`'${column.name}' 칼럼을 삭제하시겠습니까? 이 칼럼에 있는 모든 카드도 함께 삭제됩니다.`)) {
                    onDeleteColumn(column.id);
                  }
                }}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                title="칼럼 삭제"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <DroppableWrapper droppableId={column.id}>
        {(provided: any, snapshot: any) => (
          <>
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${snapshot.isDragging ? 'dragging' : ''}`}
                  >
                    <KanbanCard
                      card={card}
                      onUpdate={onUpdateCard}
                      onDelete={onDeleteCard}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </>
        )}
      </DroppableWrapper>

      {isAddingCard ? (
        <div className="mt-3 bg-blue-50 p-3 rounded-md border border-blue-200 shadow-sm">
          <textarea
            className="w-full p-2 border border-blue-300 rounded-md mb-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="카드 제목 입력..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddCard}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm"
            >
              추가
            </button>
            <button
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full mt-3 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-md flex items-center justify-center transition-colors duration-200 shadow-sm border border-blue-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          카드 추가
        </button>
      )}
    </div>
  );
};

export default KanbanColumn;
