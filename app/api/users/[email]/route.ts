import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request,
  { params }: { params: { email: string } }
  ) {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json('', { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: params.email,
      },
      include: {
        inbox: true,        
      },
    });
    if (!user) {
      return NextResponse.json('', { status: 404 });
    }
    user.password = null
    return NextResponse.json(user);  
}

export async function PUT(req: Request,
  { params }: { params: { email: string } }
  ) {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({message: 'please lgoin'}, { status: 401 });
    }
    const data = await req.json();  
    if (!data.name) {
      return NextResponse.json({message: 'name is required'}, { status: 400 });
    }
    const user = await prisma.user.update({
      where: {
        email: params.email,        
      },
      data: data
    });
    if (!user) {
      return NextResponse.json({message: 'no such user'}, { status: 404 });
    }
    user.password = null
    return NextResponse.json(user);  
  }