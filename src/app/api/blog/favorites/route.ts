import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../src/generated/prisma";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function main(){
    try {
        await prisma.$connect();
    } catch (error) {
        return Error("DB接続に失敗しました")
    }
}

// お気に入りを追加/削除
export const POST = async (req: Request) => {
    try {
        // 認証チェック
        const authUserId = await requireAuth();
        
        const { userId, postId } = await req.json();
        
        // 認証されたユーザーとリクエストのuserIdが一致するかチェック
        if (authUserId !== userId) {
            return NextResponse.json({message: "認証エラー"}, {status: 403});
        }
        
        // postIdの検証
        if (!postId || isNaN(Number(postId))) {
            return NextResponse.json({message: "無効な記事ID"}, {status: 400});
        }
        
        await main();

        // 既存のお気に入りをチェック
        const existingFavorite = await prisma.postFavorite.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        if (existingFavorite) {
            // お気に入りを削除
            await prisma.postFavorite.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            });
            
            return NextResponse.json({ 
                message: "success", 
                action: "removed" 
            }, { status: 200 });
        } else {
            // お気に入りを追加
            await prisma.postFavorite.create({
                data: {
                    userId,
                    postId
                }
            });
            
            return NextResponse.json({ 
                message: "success", 
                action: "added" 
            }, { status: 201 });
        }
    } catch (err) {
        console.error('お気に入り操作エラー:', err);
        return NextResponse.json({message: "error", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};

// ユーザーのお気に入り記事一覧を取得
export const GET = async (req: Request) => {
    try {
        // 認証チェック
        const authUserId = await requireAuth();
        
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json({message: "userId is required"}, {status: 400});
        }
        
        // 認証されたユーザーとリクエストのuserIdが一致するかチェック
        if (authUserId !== userId) {
            return NextResponse.json({message: "認証エラー"}, {status: 403});
        }

        await main();

        const favorites = await prisma.postFavorite.findMany({
            where: { userId },
            include: {
                post: {
                    include: {
                        user: true,
                        _count: {
                            select: {
                                favorites: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            message: "success",
            favorites: favorites.map(fav => ({
                ...fav.post,
                isFavorite: true,
                favoriteCount: fav.post._count.favorites
            }))
        }, { status: 200 });
    } catch (err) {
        console.error('お気に入り取得エラー:', err);
        return NextResponse.json({message: "error", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};
