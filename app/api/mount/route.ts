import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import GetServerSession from '@/lib/session'
const crypto = require("crypto");

function createHash(data, len) {
    return crypto.createHash("shake256", { outputLength: len })
      .update(data)
      .digest("base64");
}

const jose = require('jose');
const xid = require('xid-js');

export async function GET(req: Request) {
  try {    
  const session = await GetServerSession()
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });  
  }
  const url = new URL(req.url)
  const skip = Number(url.searchParams.get("skip")??0)
  const take = Number(url.searchParams.get("take")??50)
  const mounts = await prisma.mount.findMany({
    skip: skip,
    take: take,
    select: {
      id:true,
      email:true,
      host:true,
      xfer_addr:true,
      kid:true,
      username:true,
      alias:true,
      createdby:true,
      createdat:true,
      updatedat:true,      
    },
    orderBy: [
      {
        host: 'asc',
      }
    ],
    where: {
        email: session?.user?.email,      
    },
  });

  console.log("find mounts..........", session, mounts)
  
    return NextResponse.json(mounts);  
} catch(error) {
  console.log('--------------------------------',error)
  return NextResponse.json(error.message?? error, { status: 500 });  
}

}

export async function POST(req: Request) {
  const { email, host, xfer_addr, username, password, alias } = await req.json();
  console.log("console.log(email, host, username, password, alias)")
  console.log(email, host, username, password, alias)

  
  try {

    const keypair = crypto.generateKeyPairSync(
    'ed25519', 
    {
      privateKeyEncoding: { format: 'pem', type: 'pkcs8' }, 
      publicKeyEncoding: { format: 'pem', type: 'spki' }
    }
  )
  
  console.log(keypair.privateKey)
  console.log(keypair.publicKey)

  
  const exists = await prisma.mount.findUnique({
    where: {
      email_host_username: {
        email,
        host,
        username,
      }
    },
  });
  if (exists) {
    return NextResponse.json("Mount already exists", { status: 409 });
  } else {
    const mount = await prisma.mount.create({
      data: {
        email,
        host,
        xfer_addr,
        username,        
        alias,
        privatekey:keypair.privateKey,
        pubKey:keypair.publicKey,
        kid: "key_" + createHash(keypair.privateKey, 8),
      },
    });
    mount.privatekey = ''
    return NextResponse.json(mount);
  
  }

} catch(error) {
  console.log('--------------------------------',error)
  return NextResponse.json(error.message?? error, { status: 500 });  
}

}