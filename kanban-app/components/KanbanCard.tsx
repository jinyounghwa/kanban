import React, { useState } from 'react';
import { Card } from '../types';

interface KanbanCardProps {
  card: Card;
  onUpdate: (card: Card) => void;
  onDelete: (cardId: string) => void;
}

// 함수형 컴포넌트 정의 방식 변경
function KanbanCard({ card, onUpdate, onDelete }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description || '');
  const [editedDueDate, setEditedDueDate] = useState(card.due_date || '');
  const [editedLabelColor, setEditedLabelColor] = useState(card.label_color || '');

  const labelColors = [
    { value: 'bg-red-500', label: '빨강' },
    { value: 'bg-yellow-500', label: '노랑' },
    { value: 'bg-green-500', label: '초록' },
    { value: 'bg-blue-500', label: '파랑' },
    { value: 'bg-purple-500', label: '보라' },
  ];

  const handleSave = () => {
    if (editedTitle.trim()) {
      // 카드 객체 복사 후 필요한 속성만 업데이트
      const updatedCard = {
        ...card,
        title: editedTitle,
        description: editedDescription,
        due_date: editedDueDate,
        label_color: editedLabelColor
      };
      
      // 불필요한 참조 제거를 위해 setTimeout 사용
      setTimeout(() => {
        onUpdate(updatedCard);
        setIsEditing(false);
      }, 0);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  if (isEditing) {
    return (
      <div className="kanban-card">
        <div className="mb-2">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="제목"
            autoFocus
          />
        </div>
        <div className="mb-2">
          <textarea
            className="w-full p-2 border rounded-md"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="설명"
            rows={3}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm text-gray-600 mb-1">마감일</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={editedDueDate ? editedDueDate.split('T')[0] : ''}
            onChange={(e) => setEditedDueDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">라벨</label>
          <div className="flex space-x-1">
            {labelColors.map((color) => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded-full ${color.value} ${
                  editedLabelColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                onClick={() => setEditedLabelColor(color.value)}
                title={color.label}
              />
            ))}
            {editedLabelColor && (
              <button
                className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs"
                onClick={() => setEditedLabelColor('')}
                title="라벨 제거"
              >
                X
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-3 py-1 rounded-md text-sm"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 px-3 py-1 rounded-md text-sm"
            >
              취소
            </button>
          </div>
          <button
            onClick={() => onDelete(card.id)}
            className="text-red-500 hover:text-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="kanban-card"
      onClick={() => setIsEditing(true)}
    >
      {card.label_color && (
        <div 
          className={`w-full h-1.5 rounded-sm mb-2 ${card.label_color}`}
        />
      )}
      <h4 className="font-medium">{card.title}</h4>
      {card.description && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{card.description}</p>
      )}
      {card.due_date && (
        <div className="mt-2 text-xs text-gray-500">
          마감일: {formatDate(card.due_date)}
        </div>
      )}
    </div>
  );
};

export default KanbanCard;
