import { auth } from '@clerk/nextjs/server';

// サーバーサイドでの認証チェック
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('認証が必要です');
  }
  
  return userId;
}

// 記事の所有者チェック
export async function checkPostOwnership(postId: number, userId: string) {
  const { PrismaClient } = await import('../../src/generated/prisma');
  const prisma = new PrismaClient();
  
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });
    
    if (!post) {
      throw new Error('記事が見つかりません');
    }
    
    if (post.userId !== userId) {
      throw new Error('この記事を編集する権限がありません');
    }
    
    return true;
  } finally {
    await prisma.$disconnect();
  }
}
