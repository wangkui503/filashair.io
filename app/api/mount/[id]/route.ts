import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
const crypto = require('crypto');
import GetServerSession from '@/lib/session'
import genJWT from '@/lib/jwt'

const jose = require('jose');
const xid = require('xid-js');

export async function GET(req: Request,
  { params }: { params: { id: string } }
  ) {
  try {    
  const session = await GetServerSession()
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });  
  }
  const mount = await prisma.mount.findUnique({
    select: {
      id:true,
      email:true,
      host:true,
      xfer_addr:true,
      privatekey: true,
      kid:true,
      username:true,
      createdby:true,
      createdat:true,
      updatedat:true,      
    },
    where: {
        id: Number(params.id),        
    },
  });
  if (!mount) {
    return NextResponse.json('', { status: 404 });  
  }
  delete mount.privatekey
  console.log("get mount..........", params.id, session, mount)
  
  return NextResponse.json(mount);  
} catch(error) {
  console.log('--------------------------------',error)
  return NextResponse.json(error.message?? error, { status: 500 });  
}

}

export async function PUT(req: Request,
  { params }: { params: { id: string } }
  ) {
  const { kid } = await req.json();

  const mount = await prisma.mount.update({
    where: {
      id: Number(params.id)
    },
    data: {
      kid: kid
    },
  });
  return NextResponse.json(mount);  
}

export async function DELETE(req: Request,
  { params }: { params: { id: string } }
  ) {
  try {    
  const session = await GetServerSession()
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });  
  }
  const url = new URL(req.url)
  const force = url.searchParams.get("force")
  const mount = await prisma.mount.findUnique({
    select: {
      id:true,
      alias:true,
      email:true,
      host:true,
      xfer_addr:true,
      privatekey: true,
      kid:true,
      username:true,
      createdby:true,
      createdat:true,
      updatedat:true,
      _count: {
        select: { 
          inboxes: true, 
          shares: true,
        },
      },
    },
    where: {
        id: Number(params.id),        
    },
  });
  if (!mount) {
    return NextResponse.json('', { status: 404 });  
  }
  mount.force = force
  console.log('DELETE mount--------------------------------',mount)

  const counts = Object.values(mount?._count)?.reduce((a, c) => a + c, 0)
  if (counts > 0 && !force) {
    return NextResponse.json(mount, { status: 403 });    
  }
  const deleteMount = await prisma.mount.delete({
    where: {
      id: Number(params.id),
    },
  })

  return NextResponse.json(deleteMount);  
} catch(error) {
  console.log('--------------------------------',error)
  return NextResponse.json(error.message?? error, { status: 500 });  
}

}