'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CreatePostForm from '@/components/forms/CreatePostForm';
import Link from 'next/link';

export default function NewPostPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* パンくずリスト */}
          <div className="mb-6">
            <Link
              href="/"
              className="text-pink-500 hover:text-pink-600 text-sm"
            >
              ← ホームに戻る
            </Link>
          </div>

          {/* ページタイトル */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              新しい記事を作成
            </h1>
            
            <CreatePostForm />
          </div>
        </div>
      </main>
      
      <ScrollToTop />
      <Footer />
    </div>
  );
}

