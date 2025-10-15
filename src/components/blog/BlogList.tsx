'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import BlogCard from './BlogCard';
import FilterBar from './FilterBar';

interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string | null;
  userId?: string | null;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
  };
  _count?: {
    favorites: number;
  };
}

interface FavoriteStatus {
  [postId: number]: boolean;
}

export default function BlogList() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [favoriteStatus, setFavoriteStatus] = useState<FavoriteStatus>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        
        if (data.message === 'success' && data.posts) {
          // 日付の降順でソート（新しい記事が上に）
          const sortedPosts = [...data.posts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setPosts(sortedPosts);
          setFilteredPosts(sortedPosts);
        } else {
          setError('記事の取得に失敗しました');
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('記事の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // お気に入り状態を取得
  useEffect(() => {
    if (user) {
      const fetchFavoriteStatus = async () => {
        try {
          const response = await fetch(`/api/blog/favorites?userId=${user.id}`);
          const data = await response.json();
          
          if (data.message === 'success') {
            const favorites = data.favorites as Post[];
            const status: FavoriteStatus = {};
            favorites.forEach(post => {
              status[post.id] = true;
            });
            setFavoriteStatus(status);
          }
        } catch (err) {
          console.error('お気に入り状態の取得に失敗しました:', err);
        }
      };

      fetchFavoriteStatus();
    }
  }, [user]);

  // フィルター処理
  useEffect(() => {
    let filtered = [...posts];

    switch (selectedFilter) {
      case 'recent':
        // 最新順（既にソート済み）
        break;
      case 'popular':
        // お気に入り数順
        filtered = filtered.sort((a, b) => (b._count?.favorites || 0) - (a._count?.favorites || 0));
        break;
      case 'with-images':
        // 画像付きの記事のみ
        filtered = filtered.filter(post => post.imageUrl);
        break;
      default:
        // すべて
        break;
    }

    setFilteredPosts(filtered);
  }, [posts, selectedFilter]);

  const handleToggleFavorite = async (postId: number) => {
    if (!user) return;

    try {
      const response = await fetch('/api/blog/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          postId
        }),
      });

      const data = await response.json();
      
      if (data.message === 'success') {
        // お気に入り状態を更新
        setFavoriteStatus(prev => ({
          ...prev,
          [postId]: data.action === 'added'
        }));

        // 記事のお気に入り数を更新
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? {
                  ...post,
                  _count: {
                    favorites: data.action === 'added' 
                      ? (post._count?.favorites || 0) + 1
                      : (post._count?.favorites || 0) - 1
                  }
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('お気に入りの更新に失敗しました:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-12 rounded-lg text-center">
        <p className="text-lg mb-4">まだ記事がありません</p>
        <a
          href="/posts/new"
          className="inline-block bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors duration-200"
        >
          最初の記事を書く
        </a>
      </div>
    );
  }

  return (
    <div>
      <FilterBar 
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            date={post.date}
            imageUrl={post.imageUrl}
            isFavorite={favoriteStatus[post.id] || false}
            favoriteCount={post._count?.favorites || 0}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

