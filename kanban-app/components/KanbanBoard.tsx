import React, { useState, useEffect } from 'react';
// @ts-ignore - react-beautiful-dnd 타입 선언 파일 누락 오류 무시
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { supabase } from '../lib/supabase';
// @ts-ignore - KanbanColumn 타입 선언 파일 누락 오류 무시
import KanbanColumn from './KanbanColumn';
import { Column, Card } from '../types';

interface KanbanBoardProps {
  boardId: string;
}

function KanbanBoard({ boardId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const fetchBoardData = async () => {
    setLoading(true);
    try {
      // 칼럼 데이터 가져오기
      const { data: columnsData, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position');

      if (columnsError) throw columnsError;

      // 카드 데이터 가져오기
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('column_id', columnsData.map((col: any) => col.id))
        .order('position');

      if (cardsError) throw cardsError;

      setColumns(columnsData || []);
      setCards(cardsData || []);
    } catch (error) {
      console.error('보드 데이터를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // 드롭 위치가 없는 경우 (드래그가 취소된 경우)
    if (!destination) return;

    // 같은 위치로 드롭된 경우
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // 카드 이동 처리
    const updatedCards = [...cards];
    const movedCard = updatedCards.find(card => card.id === draggableId);

    if (!movedCard) return;

    // 카드 배열에서 제거
    const newCards = updatedCards.filter(card => card.id !== draggableId);

    // 이동된 위치에 카드 삽입
    const destinationColumnId = destination.droppableId;
    movedCard.column_id = destinationColumnId;

    // 같은 칼럼 내에서 이동하는 경우
    const sameColumn = source.droppableId === destination.droppableId;
    const columnCards = sameColumn
      ? newCards.filter(card => card.column_id === destinationColumnId)
      : newCards.filter(card => card.column_id === destinationColumnId);

    // 새 위치에 카드 삽입
    columnCards.splice(destination.index, 0, movedCard);

    // 위치 업데이트
    const updatedColumnCards = columnCards.map((card, index) => ({
      ...card,
      position: index,
    }));

    // 전체 카드 배열 업데이트
    const finalCards = newCards
      .filter(card => card.column_id !== destinationColumnId)
      .concat(updatedColumnCards);

    // UI 업데이트
    setCards(finalCards);

    // DB 업데이트
    try {
      const { error } = await supabase
        .from('cards')
        .update({ 
          column_id: destinationColumnId,
          position: destination.index 
        })
        .eq('id', draggableId);

      if (error) throw error;

      // 위치 재정렬이 필요한 경우 나머지 카드들의 위치도 업데이트
      const cardsToUpdate = updatedColumnCards
        .filter(card => card.id !== draggableId)
        .map(card => ({
          id: card.id,
          position: card.position
        }));

      if (cardsToUpdate.length > 0) {
        const { error: batchError } = await supabase
          .from('cards')
          .upsert(cardsToUpdate);

        if (batchError) throw batchError;
      }
    } catch (error) {
      console.error('카드 위치 업데이트 중 오류가 발생했습니다:', error);
      // 오류 발생 시 원래 상태로 복원
      fetchBoardData();
    }
  };

  const addNewColumn = async (name: string) => {
    try {
      const newPosition = columns.length;
      
      const { data, error } = await supabase
        .from('columns')
        .insert({
          name,
          board_id: boardId,
          position: newPosition
        })
        .select()
        .single();

      if (error) throw error;
      
      setColumns([...columns, data]);
    } catch (error) {
      console.error('새 칼럼 추가 중 오류가 발생했습니다:', error);
    }
  };

  const addNewCard = async (columnId: string, title: string) => {
    try {
      const columnCards = cards.filter(card => card.column_id === columnId);
      const newPosition = columnCards.length;
      
      const { data, error } = await supabase
        .from('cards')
        .insert({
          title,
          column_id: columnId,
          position: newPosition
        })
        .select()
        .single();

      if (error) throw error;
      
      setCards([...cards, data]);
    } catch (error) {
      console.error('새 카드 추가 중 오류가 발생했습니다:', error);
    }
  };

  const updateCard = async (updatedCard: Card) => {
    try {
      // 불필요한 속성 제거하여 업데이트할 데이터만 추출
      const { id, title, description, due_date, label_color, column_id, position } = updatedCard;
      const cardDataToUpdate = { 
        title, 
        description, 
        due_date, 
        label_color,
        column_id,
        position
      };
      
      const { error } = await supabase
        .from('cards')
        .update(cardDataToUpdate)
        .eq('id', id);

      if (error) throw error;
      
      // 새로운 배열을 생성하여 참조 문제 방지
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === updatedCard.id ? { ...card, ...cardDataToUpdate } : card
        )
      );
    } catch (error) {
      console.error('카드 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;
      
      setCards(cards.filter(card => card.id !== cardId));
    } catch (error) {
      console.error('카드 삭제 중 오류가 발생했습니다:', error);
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      // 해당 칼럼에 있는 카드들 먼저 삭제
      const columnCards = cards.filter(card => card.column_id === columnId);
      if (columnCards.length > 0) {
        const { error: cardsError } = await supabase
          .from('cards')
          .delete()
          .eq('column_id', columnId);

        if (cardsError) throw cardsError;
      }

      // 칼럼 삭제
      const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', columnId);

      if (error) throw error;
      
      // 상태 업데이트
      setColumns(columns.filter(column => column.id !== columnId));
      setCards(cards.filter(card => card.column_id !== columnId));
    } catch (error) {
      console.error('칼럼 삭제 중 오류가 발생했습니다:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">칸반 보드</h1>
        <button
          onClick={() => {
            const name = prompt('새 칼럼 이름을 입력하세요');
            if (name) addNewColumn(name);
          }}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          + 새 칼럼 추가
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cards.filter(card => card.column_id === column.id)}
              onAddCard={addNewCard}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
              onDeleteColumn={deleteColumn}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
