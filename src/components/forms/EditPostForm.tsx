'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EditPostFormProps {
  postId: number;
}

export default function EditPostForm({ postId }: EditPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${postId}`);
        const data = await response.json();

        if (data.message === 'success' && data.post) {
          setTitle(data.post.title);
          setDescription(data.post.description);
        } else {
          setError('記事の取得に失敗しました');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('記事の取得中にエラーが発生しました');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();

      if (data.message === 'success') {
        router.push(`/posts/${postId}`);
        router.refresh();
      } else {
        setError('記事の更新に失敗しました');
      }
    } catch (err) {
      console.error('Error updating post:', err);
      setError('記事の更新中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当にこの記事を削除しますか？')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.message === 'success') {
        router.push('/');
        router.refresh();
      } else {
        setError('記事の削除に失敗しました');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('記事の削除中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200"
          placeholder="記事のタイトルを入力"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          本文
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
          placeholder="記事の内容を入力"
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '更新中...' : '更新する'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          削除
        </button>
      </div>
    </form>
  );
}

