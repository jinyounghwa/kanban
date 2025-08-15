import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import Layout from '../components/Layout';




const Home: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/boards');
    }
  }, [user, router]);

  return (
    <Layout title="칸반 보드 - 홈"> 
      {process.env.NODE_ENV === 'development'  }
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">칸반 보드</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              효율적인 작업 관리를 위한 최고의 도구
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              칸반 보드로 프로젝트와 작업을 시각적으로 관리하고 팀원들과 효율적으로 협업하세요.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex flex-col items-center">
              <button
                onClick={() => router.push(user ? '/boards' : '/signup')}
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
              >
                {user ? '내 보드 보기' : '지금 시작하기'}
              </button>
              {!user && (
                <button
                  onClick={() => router.push('/login')}
                  className="mt-4 px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  로그인
                </button>
              )}
            </div>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">직관적인 인터페이스</h3>
                <p className="mt-2 text-base text-gray-500">
                  드래그 앤 드롭으로 쉽게 작업을 이동하고 관리할 수 있습니다.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">팀 협업</h3>
                <p className="mt-2 text-base text-gray-500">
                  팀원들과 실시간으로 작업 상태를 공유하고 효율적으로 협업할 수 있습니다.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">작업 추적</h3>
                <p className="mt-2 text-base text-gray-500">
                  작업의 진행 상황을 한눈에 파악하고 마감일을 관리할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
