import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../src/generated/prisma";

import { main } from "../route";

const prisma = new PrismaClient();

// GETブログの記事一つを取得
export const GET = async (req: Request, res: NextResponse) => {
    try {
        const id:number = parseInt(req.url.split("/blog/")[1]);
    
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
export const PUT = async (req: Request, res: NextResponse) => {
    try {
        const id:number = parseInt(req.url.split("/blog/")[1]);
        const {title, description} = await req.json();

        await main();

        const post = await prisma.post.update({
            where: {id}, 
            data: {title, description}
        });

        return NextResponse.json({message: "success", post}, {status: 200});
    } catch (err) {
        return NextResponse.json({message: "error", err}, {status: 500});
    }finally {
        await prisma.$disconnect();
    }
};

// Delete ブログの記事を消去
export const DELETE = async (req: Request, res: NextResponse) => {
    try {
        const id:number = parseInt(req.url.split("/blog/")[1]);

        await main();
        
        const post = await prisma.post.delete({
            where: {id}
        });

        return NextResponse.json({message: "success", post}, {status: 200});
    } catch (err) {
        return NextResponse.json({message: "error", err}, {status: 500});
    }finally {
        await prisma.$disconnect();
    }
};