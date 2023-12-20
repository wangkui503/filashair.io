import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import GetServerSession from "@/lib/session";

export async function POST(req: Request) {
  const session = await GetServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Need to login" }, { status: 401 });
    }
  const data = await req.json();  
  console.log("shares post data---", data)
  const shared = await prisma.shared.upsert({
    where: {
      email_mount_id_share: {
        email: session.user.email,
        mount_id: data.mount_id,
        share: data.share,      
      }      
    },
    update: {
      alias: data.alias,
      desc: data.desc,
      read: data.read?? false,
      write: data.write??false,
      list: data.list??false,
      delete: data.delete??false,
    },
    create: {
      alias: data.alias,
      desc: data.desc,
      email: session.user.email,
      mount_id: data.mount_id,
      share: data.share,
      read: data.read?? false,
      write: data.write??false,
      list: data.list??false,
      delete: data.delete??false,
    },
  });
  console.log("share--------", shared)
  return NextResponse.json(shared);  
}

export async function GET(req: Request) {
    const session = await GetServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Need to login" }, { status: 401 });
    }
    const url = new URL(req.url)
    const action = url.searchParams.get("action")
    if (action === 'search') {
      return search(req, session.user.email)
    }
    const kind = url.searchParams.get("kind")
    const skip = Number(url.searchParams.get("skip")??0)
    const take = Number(url.searchParams.get("take")??50)
  
    const inc = url.searchParams.get("inc")
    const mount_id = url.searchParams.get("mount_id")
    const share = url.searchParams.get("share")
    let table = prisma.shared
    if (kind == "to") {
      const shareds = await prisma.sharedUser.findMany({
        skip: skip,
        take: take,
        orderBy: [
          {
            updatedat: 'desc',
          }
        ],    
        where: {
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
        email: session?.user?.email
      }
      if (mount_id) {
        where.mount_id = parseInt(mount_id)
      }
      if (share) {
        where.share = share
      }
      console.log("where---", where)
      const shareds = await prisma.shared.findMany({
        skip: skip,
        take: take,        
        orderBy: [
          {
            updatedat: 'desc',
          }
        ],    
        where: where,
        include: include
      });
      console.log("shared ------", kind, shareds)
      return NextResponse.json(shareds);
    }
    
}

async function search(req: Request, email: string) {
  const url = new URL(req.url)
  const mount_id = Number(url.searchParams.get("mount_id")) ?? 0
  if (!mount_id) {
    return NextResponse.json({ message: "mount id is required" }, { status: 400 });
  }
  const share = url.searchParams.get("share") ?? ''
  if (!share) {
    return NextResponse.json({ message: "share is required" }, { status: 400 });
  }
  const incUsers = url.searchParams.get("users") ?? ''
  const select = {
    id: true,
    alias: true,
    desc: true,
    email: true,
    mount_id: true,
    share: true,
    read: true,
    write: true,
    list: true,
    delete: true,
    updatedby: true,
    updatedat: true,
  }
  if (incUsers) {
    select.sharedUsers = true
  }
  const shared = await prisma.shared.findUnique({
    select: select,
    where: {
      email_mount_id_share: {
        email: email,
        mount_id: mount_id,
        share: share,
      }      
    }    
  });
  console.log("shareds search----", mount_id, share, shared)
  if (shared) {
    return NextResponse.json([shared]);
  }
  return NextResponse.json([]);
}