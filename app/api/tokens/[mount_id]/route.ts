import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
const crypto = require('crypto');
import GetServerSession from "@/lib/session";
const jose = require('jose');
const xid = require('xid-js');

import genJWT from '@/lib/jwt'


export async function GET(req: Request,
  { params }: { params: { mount_id: string } }
  ) {
  const session = await GetServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "login required" }, { status: 401 });
  }

  const mount_id = params.mount_id;
  if (!mount_id) {
    return NextResponse.json("invalid mount id", { status: 400 });  
  }
  console.log("mount_id", mount_id)

  const url = new URL(req.url)
  const share = url.searchParams.get("share")

  
  try {

    const query = {
      where: {
        id: +mount_id,     
      }
    }

    if (share) {
      query.include = {
        shares: {
          where: {
            share: share
          },
          include: {
            sharedUsers: {
              where: {
                email: session.user.email
              }
            }
          }
        },
        inboxes: {
          where: {
            share: share
          }
        }
      }
    }
  
    const mount = await prisma.mount.findUnique(query);
    if (!mount) {
      return NextResponse.json("no such xfer account", { status: 401 });  
    }



  const data = {
    /* src:{
      paths:[
        "/"
      ]
    } */
     /* src:{
      cd:"",
      share: "share1",
      paths:[
        "/file.txt"
      ],
      path_pairs:[
        {
          src:"file.txt.1",
          dst:"dest/file.txt.1"
        }
      ]
    }, 
    dst: {
      share: "share1",
      path:"dest",
    } */
  }


    


  if (mount.email != session.user.email) {
    data.sub = session.user.email    
    data.sbr = 'regular'
    data.pls = {}
    
    const shared = mount.shares?.[0]
    const inbox = mount.inboxes?.[0]
    if (shared && shared.sharedUsers?.length > 0) {
      data.pls[share] = []
      if (shared.read) {
        data.pls[share].push('read')
      }
      if (shared.write) {
        data.pls[share].push('write')
      }
      if (shared.list) {
        data.pls[share].push('list')
      }
      if (shared.delete) {
        data.pls[share].push('rm')
      }
      if (data.pls[share].length > 0) {
        data.pls[share].push('stat')
      }
    } else if (inbox) {
      data.pls[share] = ['write','list','stat']      
      data.paths = [inbox.path]
    } else {
      return NextResponse.json("no such share", { status: 401 });  
    }

    
  }

  const token = await genJWT(data, mount.username, mount.privatekey, mount.kid)

  
console.log("token.........", token)
    
    
    return NextResponse.json({mount: mount, token: token});
  
  

} catch(error) {
  console.log('--------------------------------',error)
  return NextResponse.json(error.message?? error, { status: 500 });  
}

}


export async function POST(req: Request,
  { params }: { params: { mount_id: string } }
  ) {
  const session = await GetServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "login required" }, { status: 401 });
  }
  const mount_id = params.mount_id;
  const data = await req.json();
  const url = new URL(req.url)
  const share = url.searchParams.get("share")


  
  try {

    

    




  
  const mount = await prisma.mount.findUnique({
    where: {
        id: +mount_id,
    },
  });

  if (mount.email != session.user.email) {
    data.sub = session.user.email    
    data.sbr = 'regular'
    data.pls = {}
    if (!share) {
      return NextResponse.json("Share is required", { status: 400 });  
    }

  
    const shared = await prisma.sharedUser.findFirst({
      where: {
          email: session.user.email,
          share: {
            mount_id: +mount_id,
            share: share,
          }
      },
      include: {
        share: true
      }
    });
    if (shared) {
      data.pls[share] = []
      if (shared.share.read) {
        data.pls[share].push('read')
      }
      if (shared.share.write) {
        data.pls[share].push('write')
      }
      if (shared.share.list) {
        data.pls[share].push('list')
      }
      if (shared.share.delete) {
        data.pls[share].push('rm')
      }
      if (data.pls[share].length > 0) {
        data.pls[share].push('stat')
      }
    } else {
      return NextResponse.json("not shared to you " + share, { status: 403 });
    }
  

  }

  

  

  const token = await genJWT(data, mount.username, mount.privatekey, mount.kid)

  
console.log("token.........", data, token)
    
    
    return NextResponse.json({host: mount?.host, token: token});
  
  

} catch(error) {
  console.log('--------------------------------',error)
  return NextResponse.json(error.message?? error, { status: 500 });  
}

}
