import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../src/generated/prisma";
import { requireAuth, checkPostOwnership } from "@/lib/auth";

import { main } from "../route";

const prisma = new PrismaClient();

// GETブログの記事一つを取得
export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
    
        await main();

        const post = await prisma.post.findFirst({where: {id}});

        if(!post) {
            return NextResponse.json({message: "not found"}, {status: 404});
        }

        return NextResponse.json({message: "success", post}, {status: 200});
    } catch (err) {
        return NextResponse.json({message: "error", err}, {status: 500});
    }finally {
        await prisma.$disconnect();
    }
};

// PUT ブログ記事を更新
export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        // 認証チェック
        const authUserId = await requireAuth();
        
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        
        if (isNaN(id)) {
            return NextResponse.json({message: "無効な記事ID"}, {status: 400});
        }
        
        // 記事の所有者チェック
        await checkPostOwnership(id, authUserId);
        
        const {title, description} = await req.json();
        
        // 入力値の検証
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return NextResponse.json({message: "タイトルは必須です"}, {status: 400});
        }
        
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return NextResponse.json({message: "本文は必須です"}, {status: 400});
        }
        
        // 文字数制限
        if (title.length > 200) {
            return NextResponse.json({message: "タイトルは200文字以下にしてください"}, {status: 400});
        }
        
        if (description.length > 10000) {
            return NextResponse.json({message: "本文は10000文字以下にしてください"}, {status: 400});
        }

        await main();

        const post = await prisma.post.update({
            where: {id}, 
            data: {
                title: title.trim(),
                description: description.trim()
            }
        });

        return NextResponse.json({message: "success", post}, {status: 200});
    } catch (err) {
        console.error('記事更新エラー:', err);
        return NextResponse.json({message: "error", err}, {status: 500});
    }finally {
        await prisma.$disconnect();
    }
};

// Delete ブログの記事を消去
export const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        // 認証チェック
        const authUserId = await requireAuth();
        
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        
        if (isNaN(id)) {
            return NextResponse.json({message: "無効な記事ID"}, {status: 400});
        }
        
        // 記事の所有者チェック
        await checkPostOwnership(id, authUserId);

        await main();
        
        const post = await prisma.post.delete({
            where: {id}
        });

        return NextResponse.json({message: "success", post}, {status: 200});
    } catch (err) {
        console.error('記事削除エラー:', err);
        return NextResponse.json({message: "error", err}, {status: 500});
    }finally {
        await prisma.$disconnect();
    }
};