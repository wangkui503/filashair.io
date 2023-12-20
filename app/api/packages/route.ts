import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();  
  const message = await prisma.package.create({
    data: {
      email: data.email,
      status: 'posted',
      direction: data.direction,
      from: data.email,
      to: data.to,
      cc: data.cc,
      subject: data.subject,
      message: data.message,
      specs: JSON.stringify(data.specs),
      createdby: data.email

    }
  })
    console.log("package--------", data.specs[0].spec)
    return NextResponse.json(data);  
}


export async function GET(req: Request) {
  const { email } = await req.json();  
    const user = await prisma.user.findFirst({
      where: {
        email
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
