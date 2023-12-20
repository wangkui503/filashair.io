import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { keyword } = await req.json();  
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: keyword,
            },
          },
          {
            name: {
              contains: keyword,
            },
          },
        ]
      },
      include: {
        inbox: {
          include: {
            mount: true,
          }
        }
      },
    });
    console.log("network post users---", keyword, users)
    return NextResponse.json(users);  
}


export async function GET(req: Request) {
  const url = new URL(req.url)
  const skip = Number(url.searchParams.get("skip")??0)
  const take = Number(url.searchParams.get("take")??50)
  const users = await prisma.user.findMany({
    skip: skip,
    take: take,
    orderBy: [
      {
        email: 'asc',
      }
    ],    
    include: {
      inbox: {
        include: {
          mount: true,
        }
      }
    },
  });
  return NextResponse.json(users);  
}
