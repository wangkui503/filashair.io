import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import GetServerSession from "@/lib/session";

export async function GET(req: Request,
  { params }: { params: { email: string } }
  ) {
    const url = new URL(req.url)
    const kind = url.searchParams.get("kind")
    const inc = url.searchParams.get("inc")
    const mount_id = url.searchParams.get("mount_id")
    const share = url.searchParams.get("share")
    let table = prisma.shared
    if (kind == "to") {
      const shareds = await prisma.sharedUser.findMany({
        orderBy: [
          {
            updatedat: 'desc',
          }
        ],    
        where: {
          email: params.email
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
        email: params.email
      }
      if (mount_id) {
        where.mount_id = parseInt(mount_id)
      }
      if (share) {
        where.share = share
      }
      console.log("where---", where)
      const shareds = await prisma.shared.findMany({
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





export async function DELETE(req: Request,
  { params }: { params: { id: string } }
  ) {
    const sharedUser = await prisma.sharedUser.delete({
      where: {
        id: +params.id
      }
    })
    if (!sharedUser) {
      return NextResponse.json({ message: "no such shared user" }, { status: 404 });
    }
    return NextResponse.json(sharedUser); 
  }