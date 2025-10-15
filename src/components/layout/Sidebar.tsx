'use client';

import { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        if (data.posts) {
          // 最新5件を取得
          setRecentPosts(data.posts.slice(0, 5));
        }
      } catch (error) {
        console.error('記事の取得に失敗しました:', error);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <>
      {/* オーバーレイ（モバイル時のみ） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`
          fixed lg:static top-0 right-0 h-full lg:h-auto
          w-80 lg:w-80
          bg-gray-50 lg:bg-transparent
          shadow-2xl lg:shadow-none
          z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          overflow-y-auto
          p-4 lg:p-0
          space-y-6
        `}
      >
      {/* 閉じるボタン（モバイル時のみ） */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors duration-200"
        aria-label="閉じる"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* プロフィールカード */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            MB
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">CHIHIROCHIHIRO</h2>
          <p className="text-gray-600 text-sm">
            日々の出来事や学んだことを綴っています。<br />
            データ分析やAIについても取り上げています。
          </p>
        </div>
      </div>

      {/* 最近の記事 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-pink-500 pb-2">
          最近の記事
        </h3>
        <ul className="space-y-3">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <li key={post.id}>
                <a
                  href={`/posts/${post.id}`}
                  className="text-sm text-gray-700 hover:text-pink-500 transition-colors duration-200 line-clamp-2"
                >
                  {post.title}
                </a>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(post.date).toLocaleDateString('ja-JP')}
                </p>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">記事がありません</li>
          )}
        </ul>
      </div>

      {/* カテゴリー */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-pink-500 pb-2">
          カテゴリー
        </h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-sm text-gray-700 hover:text-pink-500 transition-colors duration-200 flex items-center justify-between">
              <span>すべて</span>
              <span className="text-gray-400">({recentPosts.length})</span>
            </a>
          </li>
        </ul>
      </div>
      </aside>
    </>
  );
}

