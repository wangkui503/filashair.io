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
      id: data.id,
      email: data.email,      
    },
    update: {
      alias: data.name,
      desc: data.desc,
      mount_id: data.mount_id,
      share: data.share,
      read: data.read?? false,
      write: data.write??false,
      list: data.list??false,
      delete: data.delete??false,
    },
    create: {
      alias: data.name,
      desc: data.desc,
      email: data.email,
      mount_id: data.mount_id,
      share: data.share,  
      read: data.read?? false,
      write: data.write??false,
      list: data.list??false,
      delete: data.delete??false,
    },
  });
  data.users.map((user)=>{
    user.shared_id = shared.id
  })
  const sharedUsers = await prisma.sharedUser.createMany({
    data: data.users,
    skipDuplicates: true,
  })

  console.log("share--------", shared)
  console.log("sharedUsers--------", sharedUsers)
  return NextResponse.json(shared);  
}


export async function PUT(req: Request,
  { params }: { params: { email: string } }
  ) {
    const session = await GetServerSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Need to login" }, { status: 401 });
    }
  const data = await req.json();  
  console.log("sharedUsers put data---", data)

  const mount_id = data.shared?.mount_id
  if (!mount_id) {
    return NextResponse.json({ message: "xfer account id is required" }, { status: 400 });
  }
  const mount = await prisma.mount.findUnique({
    where: {
      id: mount_id
    }
  })
  if (!mount) {
    return NextResponse.json({ message: "no such xfer account" }, { status: 404 });
  }

  const shared = await upsertShared(session, data.shared)
  if (!shared) {
    return NextResponse.json({ message: "failed to update shared" }, { status: 500 });
  }
  mount.privatekey= ''
  mount.password= null
  shared.mount = mount
  const sharedUser = await prisma.sharedUser.upsert({
    where: {
      email_shared_id: {
        email: data.email,
        shared_id: shared.id,
      }      
    },
    update: {
      email: data.email,
      shared_id: shared.id, 
      updatedat: new Date(),
      expireat: data.expireat
    },
    create: {
      email: data.email,
      shared_id: shared.id,
      expireat: data.expireat,
      createdby: session?.user?.email,      
    },
  });
  sharedUser.share = shared
  console.log("sharedUsers-put-------", sharedUser)
  return NextResponse.json(sharedUser);  
}

async function upsertShared(session, data) {
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
  return shared
}
