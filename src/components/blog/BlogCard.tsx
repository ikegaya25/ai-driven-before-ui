'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface BlogCardProps {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string | null;
  isFavorite?: boolean;
  favoriteCount?: number;
  onToggleFavorite?: (postId: number) => void;
}

export default function BlogCard({ 
  id, 
  title, 
  description, 
  date, 
  imageUrl,
  isFavorite = false,
  favoriteCount = 0,
  onToggleFavorite
}: BlogCardProps) {
  const { user } = useUser();
  const [isFav, setIsFav] = useState(isFavorite);
  const [favCount, setFavCount] = useState(favoriteCount);

  const handleToggleFavorite = async () => {
    if (!user || !onToggleFavorite) return;

    try {
      await onToggleFavorite(id);
      setIsFav(!isFav);
      setFavCount(isFav ? favCount - 1 : favCount + 1);
    } catch (error) {
      console.error('お気に入りの更新に失敗しました:', error);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <time className="text-sm text-gray-500">
            {new Date(date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {user && (
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
                isFav 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <svg className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{favCount}</span>
            </button>
          )}
        </div>
        
        <Link href={`/posts/${id}`}>
          <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-pink-500 transition-colors duration-200 line-clamp-2">
            {title}
          </h2>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/posts/${id}`}
            className="text-pink-500 hover:text-pink-600 font-semibold text-sm transition-colors duration-200"
          >
            続きを読む →
          </Link>
          <div className="flex space-x-2">
            <Link
              href={`/posts/${id}/edit`}
              className="text-purple-500 hover:text-purple-600 font-semibold text-sm transition-colors duration-200"
            >
              編集
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

