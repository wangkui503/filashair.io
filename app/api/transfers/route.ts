import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { tokens } from "@/lib/tokens";
import GetServerSession from "@/lib/session";

export async function POST(req: Request) {
  const session = await GetServerSession()
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });  
  }
  const data = await req.json();  
  const specsStr = JSON.stringify(data.specs)

  await tokens(session, data.specs)
  const errors = data.specs.filter(data => (data.spec?.source?.error || data.spec?.dest?.error))
  if (errors?.length > 0 ) {
    return NextResponse.json(data.specs, { status: 400 });  
  }  

  const message = await prisma.transfer.create({
    data: {
      email: data.email,
      status: 'posted',
      direction: data.direction,
      subject: data.subject,
      message: data.message,
      specs: specsStr,
      createdby: data.email

    }
  })
  if (!message) {
    return NextResponse.json("failed to create transfer", { status: 500 });
  }

  message.datas = data.specs
  console.log("transfers post --------", data.specs[0].spec.source)
  return NextResponse.json(message);  
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
