import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import GetServerSession from "@/lib/session";

export async function GET(req: Request,
  { params }: { params: { email: string } }
  ) {
    const session = await GetServerSession()
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });  
  }

    const url = new URL(req.url)
    const kind = url.searchParams.get("kind")
    const status = url.searchParams.get("status")
    const time = new Date(url.searchParams.get("time")) ?? new Date(+0)

  if (kind == "sent") {
    const messages = await prisma.message.findMany({
      orderBy: [
        {
          updatedat: 'desc',
        }
      ],    
      where: {
        email: session?.user?.email,
        createdat: {
          gt: time
        }
      },      
    });
    
    return NextResponse.json(messages);  
  } else {
      const messages = await prisma.recipient.findMany({
        include: {
          message: true
        },
        orderBy: [
          {
            updatedat: 'desc',
          }
        ],    
        where: {
          email: session?.user?.email,
          status: status ?? 'posted',
          createdat: {
            gt: time
          }
        },      
      });
      
    return NextResponse.json(messages);  
    }
}


export async function PUT(req: Request,
  { params }: { params: { id: string } }
  ) {
    const session = await GetServerSession()
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });  
  }
    const data = await req.json();  
    const url = new URL(req.url)
    const kind = url.searchParams.get("kind")
    

    if (kind == "send") {
      const tr = await prisma.message.update({
        where: {
          id: params.id,
          email: session.user?.email,
  
        },    
        data: {
          status: data.status
        }
      });
      return NextResponse.json(tr);
    } else {
      const tr = await prisma.recipient.update({
        where: {
          id: Number(params.id),
          email: session.user?.email,
  
        },    
        data: {
          status: data.status
        }
      });
      return NextResponse.json(tr);  
    }
    
}