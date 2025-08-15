import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../../lib/supabase';
import Layout from '../../components/Layout';
import KanbanBoard from '../../components/KanbanBoard';
import { Board } from '../../types';
import { toast } from 'react-toastify';

export default function BoardPage() {
  const user = useUser();
  const router = useRouter();
  const { id } = router.query;
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchBoard();
    } else if (!user) {
      router.push('/login');
    }
  }, [user, id, router]);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // 권한 체크
      if (data.owner_id !== user?.id) {
        toast.error('이 보드에 접근할 권한이 없습니다.');
        router.push('/boards');
        return;
      }
      
      setBoard(data);
    } catch (error: any) {
      toast.error('보드 정보를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching board:', error);
      router.push('/boards');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !board) {
    return (
      <Layout title="보드 로딩 중 - 칸반 보드">
        {process.env.NODE_ENV === 'development' && 
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">로딩 중...</p>
        </div>
        }
      </Layout>
    );
  }

  return (
    <Layout title={`${board.name} - 칸반 보드`}>
      {process.env.NODE_ENV === 'development' && 
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">로딩 중...</p>
      </div>
      }
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
            <button
              onClick={() => router.push('/boards')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              보드 목록으로
            </button>
          </div>
          
          <KanbanBoard boardId={board.id} />
        </div>
      </div>
    </Layout>
  );
}
