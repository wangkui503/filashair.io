import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import GetServerSession from "@/lib/session";
const crypto = require("crypto");

function generatePassword() {
    return Array(12)
        .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
        .map(function (x) {
            return x[crypto.randomInt(0, 10_000) % x.length];
        })
        .join("");
}

export async function POST(req: Request) {
  const session = await GetServerSession();
  console.log("session?.user?.role---", session?.user)
  if (!session?.user?.email || session?.user?.role != 'admin') {
    return NextResponse.json({ message: "Only admin can invite." }, { status: 403 });
  }


  const { email, mount_id, share, role } = await req.json();

  const mount = await prisma.mount.findUnique({
    where: {
      id: mount_id
    }
  })
  if (!mount) {
    return NextResponse.json({ message: "no such xfer account" }, { status: 404 });
  }

  
const password = generatePassword()

console.log("password----", password)

    const myShair = await prisma.sharedUser.create({
      data: {
        user: {
          connectOrCreate: {
            where: {
              email
            },
            create: {
              email: email,
              password: await hash('1234', 10),
              role: role,
            }
          }          
        },       
        share: {
          create: {
              alias: 'My shAir',
              desc: 'The home share of on the cloud',
              email: session?.user?.email,
              share: share,
              mount_id: mount_id,              
              read: true,
              write: true,
              list: true,
              delete: true              
          }
        },        
        createdby: session?.user?.email
      },
    });
    if (!myShair) {
      return NextResponse.json({ message: "failed to create myShair" }, { status: 500 });
    }
    const user = await prisma.user.findUnique({
      where :{
        email
      }
    })
    if (!user) {
      return NextResponse.json({ message: "no such user" }, { status: 404 });
    }
    user.password = null
    myShair.user = user
    return NextResponse.json(myShair);
  
}
