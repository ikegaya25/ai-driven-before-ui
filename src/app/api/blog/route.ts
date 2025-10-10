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
export const GET = async (req: Request, res: NextResponse) => {
    try {
        await main();
        const posts = await prisma.post.findMany({ orderBy: { date: "asc" } });
        return NextResponse.json({message: "success", posts},{status: 200});
    } catch (err) {
        return NextResponse.json({message: "error", err}, {status: 500});
    }finally {
        await prisma.$disconnect();
    }
};   

// POSTブログの記事作成
export const POST = async (req: Request, res: NextResponse) => {
    console.log("POST");

    try {
        const {title, description} = await req.json();
        await main();
        const post = await prisma.post.create({data: {title, description}});
        return NextResponse.json({message: "success", post}, {status: 201});
    } catch (err) {
        return NextResponse.json({message: "error", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};