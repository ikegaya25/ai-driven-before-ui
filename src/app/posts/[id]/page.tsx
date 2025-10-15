'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        const data = await response.json();

        if (data.message === 'success' && data.post) {
          setPost(data.post);
        } else if (data.message === 'not found') {
          setError('記事が見つかりませんでした');
        } else {
          setError('記事の取得に失敗しました');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('記事の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error || '記事が見つかりませんでした'}
          </div>
          <Link
            href="/"
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            ← ホームに戻る
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <article className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* パンくずリスト */}
              <div className="mb-6">
                <Link
                  href="/"
                  className="text-pink-500 hover:text-pink-600 text-sm"
                >
                  ← 記事一覧に戻る
                </Link>
              </div>

              {/* 記事情報 */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h1 className="text-3xl font-bold text-gray-800 mt-3">
                  {post.title}
                </h1>
              </div>

              {/* 記事本文 */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.description}
                </p>
              </div>

              {/* アクションボタン */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  編集する
                </Link>
              </div>
            </div>
          </article>
          
          {/* サイドバー */}
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        </div>
      </main>
      
      <ScrollToTop />
      <Footer />
    </div>
  );
}

