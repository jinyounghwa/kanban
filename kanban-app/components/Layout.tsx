// @ts-ignore - ReactNode 타입 호환성 문제 무시
import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
// @ts-ignore - 타입 선언 파일 누락 오류 무시
import { useUser } from '@supabase/auth-helpers-react';


interface LayoutProps {
  children: ReactNode;
  title?: string;
}

function Layout({ children, title = '칸반 보드' }: LayoutProps) {
  const user = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="간단한 칸반 보드 애플리케이션" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* @ts-ignore - ReactNode 타입 호환성 문제 무시 */}
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 칸반 보드 애플리케이션
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
