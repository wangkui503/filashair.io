import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  const { keyword } = await req.json();  
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: keyword,
        }
      }
    });
    return NextResponse.json(users);  
}


export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });
  }

  const url = new URL(req.url)
  const skip = Number(url.searchParams.get("skip")??0)
  const take = Number(url.searchParams.get("take")??50)
  const users = await prisma.myDownloads.findMany({
    skip: skip,
    take: take,
    where: {
      email: session.user?.email
    },
    orderBy: [
      {
        email: 'asc',
      }
    ],    
    include: {
      mount: true,        
    },
  });
  return NextResponse.json(users);  
}
