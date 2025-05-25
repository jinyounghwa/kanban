import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';
import { Board } from '../../types';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const Toolbar = dynamic(
  () => import('@stagewise/toolbar').then(mod => mod.Toolbar),
  { ssr: false }
);

export default function Boards() {
  const user = useUser();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const checkUserAndFetchBoards = async () => {
      if (user) {
        console.log('현재 사용자:', user.id);
        
        // 사용자 테이블에 레코드가 있는지 확인
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (userError || !userData) {
          console.log('사용자 프로필 없음, 생성 중...');
          // 사용자 테이블에 레코드 생성
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
              email: user.email || ''
            });
            
          if (insertError) {
            console.error('사용자 프로필 생성 오류:', insertError);
            toast.error('사용자 프로필 생성 중 오류가 발생했습니다.');
          } else {
            console.log('사용자 프로필 생성 성공');
          }
        } else {
          console.log('사용자 프로필 확인됨:', userData);
        }
        
        fetchBoards();
      } else {
        router.push('/login');
      }
    };
    
    checkUserAndFetchBoards();
  }, [user, router]);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBoards(data || []);
    } catch (error: any) {
      toast.error('보드 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async () => {
    if (!newBoardName.trim() || !user) return;
    
    try {
      setIsCreating(true);
      
      // 사용자 ID 확인
      if (!user.id) {
        throw new Error('사용자 인증이 필요합니다.');
      }
      
      // 사용자 테이블에 레코드가 있는지 확인
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // 사용자 레코드가 없는 경우 생성
      if (userError || !userData) {
        console.log('사용자 프로필 없음, 보드 생성 전에 생성 중...');
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
            email: user.email || ''
          });
          
        if (insertError) {
          console.error('사용자 프로필 생성 오류:', insertError);
          throw new Error('사용자 프로필 생성에 실패했습니다. 다시 시도해주세요.');
        }
      }
      
      // 보드 생성
      const { data, error } = await supabase
        .from('boards')
        .insert([
          { name: newBoardName, owner_id: user.id },
        ])
        .select()
        .single();

      if (error) throw error;
      
      if (!data || !data.id) {
        throw new Error('보드 생성에 실패했습니다.');
      }
      
      // 기본 칼럼 생성
      const defaultColumns = [
        { name: 'To Do', board_id: data.id, position: 0 },
        { name: 'In Progress', board_id: data.id, position: 1 },
        { name: 'Done', board_id: data.id, position: 2 },
      ];
      
      const { error: columnsError } = await supabase
        .from('columns')
        .insert(defaultColumns);
        
      if (columnsError) throw columnsError;
      
      setBoards([data, ...boards]);
      setNewBoardName('');
      setIsCreating(false);
      toast.success('새 보드가 생성되었습니다.');
    } catch (error: any) {
      toast.error(`보드 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
      console.error('Error creating board:', error);
      setIsCreating(false);
    }
  };

  const deleteBoard = async (boardId: string) => {
    if (!confirm('정말로 이 보드를 삭제하시겠습니까? 모든 칼럼과 카드가 함께 삭제됩니다.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId);

      if (error) throw error;
      
      setBoards(boards.filter(board => board.id !== boardId));
      toast.success('보드가 삭제되었습니다.');
    } catch (error: any) {
      toast.error('보드 삭제 중 오류가 발생했습니다.');
      console.error('Error deleting board:', error);
    }
  };

  if (loading && !boards.length) {
    return (
      <Layout title="내 보드 - 칸반 보드">
        {process.env.NODE_ENV === 'development' && <Toolbar />}
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="내 보드 - 칸반 보드">
      {process.env.NODE_ENV === 'development' && <Toolbar />}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">내 보드</h1>
          </div>

          <div className="mb-8 bg-white shadow overflow-hidden sm:rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">새 보드 만들기</h2>
            <div className="flex">
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="보드 이름 입력"
                className="flex-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <button
                onClick={createBoard}
                disabled={isCreating || !newBoardName.trim()}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isCreating ? '생성 중...' : '보드 생성'}
              </button>
            </div>
          </div>

          {boards.length === 0 ? (
            <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">보드가 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">새 보드를 만들어 시작하세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{board.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      생성일: {new Date(board.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
                    <button
                      onClick={() => router.push(`/boards/${board.id}`)}
                      className="text-sm font-medium text-primary hover:text-blue-600"
                    >
                      보드 열기
                    </button>
                    <button
                      onClick={() => deleteBoard(board.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
