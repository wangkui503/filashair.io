import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, mount_id, share, path } = await req.json();  
  const inbox = await prisma.inbox.upsert({
    where: {
      email,
    },
    update: {
      mount_id,
      share,
      path,
    },
    create: {
      email,
      mount_id,
      share,
      path,      
    },
  });
  return NextResponse.json(inbox);
}
