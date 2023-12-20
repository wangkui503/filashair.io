import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import GetServerSession from "@/lib/session";

export async function GET(req: Request,
  { params }: { params: { id: string } }
  ) {
    const session = await GetServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Need to login" }, { status: 401 });
    }
    const url = new URL(req.url)
    const kind = url.searchParams.get("kind")
    const inc = url.searchParams.get("inc")
    const mount_id = url.searchParams.get("mount_id")
    const share = url.searchParams.get("share")
    if (kind == "to") {
      const shareds = await prisma.sharedUser.findFirst({
        where: {
          id: params.id,
          email: session.user.email
        },      
        include: {
          share: {
            include: {
              mount: true
            }
          }
        }
      });
      console.log("shared ------", kind, shareds)
      return NextResponse.json(shareds);      
    } else {
      const include = {
        mount: true
      }      
      if (inc==='members') {
        include.sharedUsers = true
      }
      const where = {
        id: params.id,
        email: session.user.email
      }
      const shared = await prisma.shared.findFirst({
        where: where,
        include: include
      });
      console.log("shared ------", kind, shared)
      return NextResponse.json(shared);    
    }
    
}

export async function PUT(req: Request,
  { params }: { params: { email: string } }
  ) {
  const data = await req.json();  
  console.log("sharedUsers put data---", data)
  const shared = await prisma.shared.update({
    where: {
      id: data.id,   
      email: params.email,      
    },
    data: {
      name: data.name,
      desc: data.desc,
      mount_id: data.mount_id,
      share: data.share,
      read: data.read?? false,
      write: data.write??false,
      list: data.list??false,
    },
  });
  console.log("shared-put-------", shared)
  return NextResponse.json(shared);  
}

export async function DELETE(req: Request,
  { params }: { params: { id: string } }
  ) {
    const session = await GetServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Need to login" }, { status: 401 });
    }
    const shared = await prisma.shared.delete({
      where: {
        id: Number(params.id),
      }
    })
    return NextResponse.json(shared); 
  }

