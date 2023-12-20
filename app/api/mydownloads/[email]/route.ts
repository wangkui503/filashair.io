import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function GET(req: Request,
  { params }: { params: { email: string } }
  ) {
    const user = await prisma.user.findFirst({
      where: {
        email: params.email,
      },
      include: {
        inbox: {
          include: {
            mount: true,
          }
        }
      },
    });
    return NextResponse.json(user);  
}
