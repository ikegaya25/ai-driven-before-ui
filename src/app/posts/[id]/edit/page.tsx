'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import EditPostForm from '@/components/forms/EditPostForm';
import Link from 'next/link';

export default function EditPostPage() {
  const params = useParams();
  const postId = parseInt(params.id as string);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* パンくずリスト */}
          <div className="mb-6">
            <Link
              href={`/posts/${postId}`}
              className="text-pink-500 hover:text-pink-600 text-sm"
            >
              ← 記事に戻る
            </Link>
          </div>

          {/* ページタイトル */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              記事を編集
            </h1>
            
            <EditPostForm postId={postId} />
          </div>
        </div>
      </main>
      
      <ScrollToTop />
      <Footer />
    </div>
  );
}

