import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  user: any;
}

function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-xl font-bold bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer transition-colors duration-200 shadow-md">칸반 보드</span>
              </Link>
            </div>
            {/* 내보드 버튼 숨김 처리 */}
            {/* <nav className="flex items-center">
              <Link href="/boards">
                <span className={`inline-flex items-center px-4 py-2 rounded-md ${
                  router.pathname === '/boards' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } text-sm font-medium cursor-pointer transition-colors duration-200`}>
                  내 보드
                </span>
              </Link>
            </nav> */}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 px-3 py-1 bg-gray-100 rounded-md">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200 shadow-sm"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="space-x-4 flex items-center">
                <Link href="/login">
                  <span className="text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 cursor-pointer transition-colors duration-200 shadow-sm">로그인</span>
                </Link>
                <Link href="/signup">
                  <span className="text-sm bg-primary text-white px-3 py-2 rounded-md hover:bg-blue-600 cursor-pointer transition-colors duration-200 shadow-sm">회원가입</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
