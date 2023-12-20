import prisma from "@/lib/prisma";
const xid = require('xid-js');
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import GetServerSession from "@/lib/session";
import { tokens } from "@/lib/tokens";

export async function POST(req: Request) {
  const session = await GetServerSession()
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });  
  }
  const data = await req.json();  

  const expire = data.expire
  
  const specs = JSON.parse(data.specs)
  await tokens(session, specs, expire)
  
  const errors = specs.filter(data => (data.spec?.source?.error || data.spec?.dest?.error))
  if (errors?.length > 0 ) {
    return NextResponse.json(specs, { status: 400 });  
  }  

  data.specs = JSON.stringify(specs)

  console.log("message post recipient --", data.recipients, specs)

  data.recipients?.create?.map(recipient => {
    if (recipient.specs) {
      const resipientSpecs = JSON.parse(recipient.specs)
      const filteredResipientSpecs = specs.filter(spec => resipientSpecs.some(rs => rs.id == spec.id))
      console.log('resipientSpecs---', recipient, filteredResipientSpecs[0].spec.source.token)
      recipient.specs = JSON.stringify(filteredResipientSpecs)
    }
  })

  
  const message = await prisma.message.create({
    data: data,
  })
  if (!message) {
    return NextResponse.json("failed to create message", { status: 500 });
  }
  message.datas = specs
  return NextResponse.json(message);  
}

export async function GET(req: Request) {
    const session = await GetServerSession()
  if (!session?.user?.email) {
    return NextResponse.json('', { status: 401 });  
  }

    const url = new URL(req.url)
    const kind = url.searchParams.get("kind")
    const status = url.searchParams.get("status")
    const time = new Date(url.searchParams.get("time")) ?? new Date(+0)
    const older = url.searchParams.get("older")
    const limit = Number(url.searchParams.get("limit")) ?? 50

    const where = {
      email: session?.user?.email,
    }
    if (status) {
      where.status = status
    }
    if (time) {
      if (older) {
        where.createdat = {
          lt: time
        }
      } else {
        where.createdat = {
          gt: time
        }
      }
    }
    

  if (kind == "send") {
    const messages = await prisma.message.findMany({
      take: limit,
      orderBy: [
        {
          createdat: 'desc',
        }
      ],    
      where: where    
    });
    
    return NextResponse.json(messages);  
  } else {
      const messages = await prisma.recipient.findMany({
        take: limit,
        include: {
          message: true
        },
        orderBy: [
          {
            createdat: 'desc',
          }
        ],    
        where: where    
      });
      
    return NextResponse.json(messages);  
    }
}
