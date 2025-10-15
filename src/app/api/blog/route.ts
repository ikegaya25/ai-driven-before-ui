import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
import { PrismaClient } from "../../../../src/generated/prisma";

const prisma = new PrismaClient();

export async function main(){
    try {
        await prisma.$connect();
    } catch (error) {
        return Error("DB接続に失敗しました")
    }
}

// GETブログの全記事取得
export const GET = async (req: Request) => {
    try {
        await main();
        const posts = await prisma.post.findMany({ 
            orderBy: { date: "asc" },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                _count: {
                    select: {
                        favorites: true
                    }
                }
            }
        });
        return NextResponse.json({message: "success", posts},{status: 200});
    } catch (err) {
        return NextResponse.json({message: "error", err}, {status: 500});
    }finally {
        await prisma.$disconnect();
    }
};   

// POSTブログの記事作成
export const POST = async (req: Request) => {
    console.log("POST");

    try {
        // 認証チェック
        const authUserId = await requireAuth();
        
        const {title, description, imageUrl, userId} = await req.json();
        
        // 入力値の検証
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return NextResponse.json({message: "タイトルは必須です"}, {status: 400});
        }
        
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return NextResponse.json({message: "本文は必須です"}, {status: 400});
        }
        
        // 認証されたユーザーとリクエストのuserIdが一致するかチェック
        if (authUserId !== userId) {
            return NextResponse.json({message: "認証エラー"}, {status: 403});
        }
        
        // 文字数制限
        if (title.length > 200) {
            return NextResponse.json({message: "タイトルは200文字以下にしてください"}, {status: 400});
        }
        
        if (description.length > 10000) {
            return NextResponse.json({message: "本文は10000文字以下にしてください"}, {status: 400});
        }
        
        await main();
        const post = await prisma.post.create({
            data: {
                title: title.trim(), 
                description: description.trim(), 
                imageUrl: imageUrl || null,
                userId: userId || null
            }
        });
        return NextResponse.json({message: "success", post}, {status: 201});
    } catch (err) {
        console.error('記事作成エラー:', err);
        return NextResponse.json({message: "error", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};