import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function GET(req: Request,
  { params }: { params: { email: string } }
  ) {
    const url = new URL(req.url)
    const status = url.searchParams.get("status")
    const older = url.searchParams.get("older")
    const time = new Date(url.searchParams.get("time")) ?? new Date(+0)
    const limit = Number(url.searchParams.get("limit")) ?? 50
    const where = {}
    where.email = params.email
    if (status) {
      where.status = status
    }
    if (time) {
      if (older) {
        where.createdat = {
          lt: time
        }
      } else {
        where.createdat = {
          gt: time
        }
      }
    }

    const user = await prisma.transfer.findMany({
      take: limit,
      where: where,    
      orderBy: [
        {
          updatedat: 'desc',
        }
      ],  
    });
    return NextResponse.json(user);  
}


export async function PUT(req: Request,
  { params }: { params: { email: string } }
  ) {
    const data = await req.json();  
    const url = new URL(req.url)
    
    const tr = await prisma.transfer.update({
      where: {
        id: data.id,
        email: params.email,

      },    
      data: {
        status: data.status
      }
    });
    return NextResponse.json(tr);
}
