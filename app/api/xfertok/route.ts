import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
const crypto = require('crypto');
import GetServerSession from "@/lib/session";
const jose = require('jose');
const xid = require('xid-js');

import genJWT from '@/lib/jwt'


export async function POST(req: Request) {
  const session = await GetServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "login required" }, { status: 401 });
  }
  const {kind, data} = await req.json();

  

  
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
        if (shared.read || shared.share.read) {
          data.pls[share].push('read')
        }
        if (shared.write || shared.share.write) {
          data.pls[share].push('write')
        }
        if (shared.list || shared.share.list) {
          data.pls[share].push('list')
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

async function admin(session, data) {
  const mount_id = data.mount_id
  if (!mount_id) {
    return NextResponse.json("xfer id is required", { status: 400 });  
  }
  const mount = await prisma.mount.findUnique({
    where: {
        id: +mount_id,
    },
  });
  if (!mount) {
    return NextResponse.json("no such xfer account", { status: 401 });  
  }
  if (session.user?.email != mount?.email) {
    return NextResponse.json("not owner", { status: 403 });  
  }

  const token = await genJWT({}, mount.username, mount.privatekey, mount.kid)
  return NextResponse.json({host: mount?.host, token: token});
}


async function inbox(session, data) {
  const email = data.email
  if (!email) {
    return NextResponse.json("email is required", { status: 400 });  
  }
  const inbox = await prisma.inbox.findFirst({
    include: {
      mount: true,
    },
    where: {
        email: email,
    },
  });
  if (!inbox) {
    return NextResponse.json("no inbox set", { status: 401 });  
  }
  data = {}
  if (session.user?.email != inbox.mount?.email) {    
    data.pls = {}
    data.pls[data.share] = ['list','write','stat']    
  }

  const token = await genJWT(data, inbox.mount.username, inbox.mount.privatekey, inbox.mount.kid)
  return NextResponse.json({host: inbox.mount?.host, token: token});
}


async function sharedToMe(session, data) {
  const mount_id = data.mount_id
  if (!mount_id) {
    return NextResponse.json("xfer account is required", { status: 400 });
  }
  const share = data.share
  if (!share) {
    return NextResponse.json("share is required", { status: 400 });
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
      share: {
        include: {
          mount: true
        }
      }
    }
  });
  if (!shared) {
    return NextResponse.json("not shared to me", { status: 401 });
  }
  data = {}
  data.pls = {}
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
  const token = await genJWT(data, shared.share.mount.username, shared.share.mount.privatekey, shared.share.mount.kid)
  return NextResponse.json({host: shared.share.mount?.host, token: token});
}

async function invite(session, data) {
  const message_id = data.message_id
  const message = await prisma.recipient.findUnique({
    include: {
      message: true
    },
    where: {
        email_message_id: {
          email: session.user.email,
          message_id: message_id,
        }   
    },
  });
  if (!message || message.message) {
    return NextResponse.json("no such message", { status: 401 });
  }
  if (message.kind != 'invite') {
    return NextResponse.json("not an invite", { status: 400 });
  }
  if (!message.message.specs) {
    return NextResponse.json("no message xfer specs", { status: 401 });
  }
  const datas = JSON.parse(message.message.specs)
  const tokenPromises = []
  datas.map(data => {
    const spec = data.spec
    if (!spec) return
    if (spec.source) {
      tokenPromises.push(getSourceToken(spec.source))
    } else if (spec.dest) {
      tokenPromises.push(getDestToken(spec.dest))
      
    }
  })
  await Promise.all(tokenPromises)
  return NextResponse.json(datas);  
}

async function message(session, data) {
  const id = data.id
  const message = await prisma.message.findUnique({
    where: {
        id: id
    },
  });
  if (!message) {
    return NextResponse.json("no such message", { status: 401 });
  }
  if (message.kind != 'xfer') {
    return NextResponse.json("not an xfer message", { status: 400 });
  }
  if (!message.specs) {
    return NextResponse.json("no message xfer specs", { status: 401 });
  }
  const datas = JSON.parse(message.specs)
  const tokenPromises = []
  datas.map(async data => {
    const spec = data.spec
    if (!spec) return
    if (spec.source) {
      tokenPromises.push(getSourceToken(spec.source))      
    }
    if (spec.dest) {
      tokenPromises.push(getDestToken(spec.dest))      
    }
  })
  await Promise.all(tokenPromises)
  return NextResponse.json(datas);  
}

async function transfer(session, data) {
  const id = data.id
  const transfer = await prisma.transfer.findUnique({
    where: {      
        id: +id,
        email: session.user.email
    },
  });
  if (!transfer) {
    return NextResponse.json("no such transfer", { status: 401 });
  }
  if (!transfer.specs) {
    return NextResponse.json("no xfer specs", { status: 401 });
  }
  const datas = JSON.parse(transfer.specs)
  const tokenPromises = []
  datas.map(async data => {
    const spec = data.spec
    if (!spec) return
    if (spec.source) {
      tokenPromises.push(getSourceToken(spec.source))      
    }
    if (spec.dest) {
      tokenPromises.push(getDestToken(spec.dest))      
    }
  })
  await Promise.all(tokenPromises)
  return NextResponse.json(datas);  
}

async function getSourceToken(source) {
  const mount_id = source.mount_id
    if (!mount_id) {
      source.error = {message: 'xfer account is required', code: 400}      
      return
    }
    const share = source.share
    if (!share) {
      source.error = {message: 'share is required', code: 400}      
      return
    }
    let paths = []
    const sourcePaths = source.paths??[]
    if (source.path_pairs) {
      paths = sourcePaths.concat(source.path_pairs?.map(pair => pair.src))
    }

    const mount = await prisma.mount.findUnique({
      where: {
          id: +mount_id,
      },
    });
    if (!mount) {
      source.error = {message: 'no such xfer account', code: 400}      
      return      
    }
    const data = {paths: paths}
    data.pls = {}
    data.pls[share] = ['read','list','stat']   
    if (source.remove_after) {
      data.pls[share].push('delete')
    }   
    const token = await genJWT(data, mount.username, mount.privatekey, mount.kid)
    source.token = "bearer " + token
    return null
}

async function getDestToken(dest) {
  const mount_id = dest.mount_id
    if (!mount_id) {
      dest.error = {message: 'xfer account is required', code: 400}      
      return      
    }
    const share = dest.share
    if (!share) {
      dest.error = {message: 'share is required', code: 400}      
      return
    }
    const mount = await prisma.mount.findUnique({
      where: {
          id: +mount_id,
      },
    });
    if (!mount) {
      dest.error = {message: 'no such xfer account', code: 400}      
      return
    }
    const data = {}
    if (dest.path) {
      data.paths = [dest.path]
    }
    data.pls = {}
    data.pls[share] = ['write','list','stat']      
    const token = await genJWT(data, mount.username, mount.privatekey, mount.kid)
    dest.token = "bearer " + token
    return null
}

async function tokens(specs) {
  const datas = JSON.parse(specs)
  const mounts = []
  datas.map(data => {
    const spec = data.spec
    if (spec.source?.mount_id) {
      mounts.push({id: spec.source?.mount_id})
    }
    if (spec.dest?.mount_id) {
      mounts.push({id: spec.dest?.mount_id})
    }
  })
  await getMounts(mounts)
  const tokenPromises = []
  datas.map(data => {
    const spec = data.spec
    if (spec.source) {
      tokenPromises.push(sourceToken(spec.source), mounts.filter(mount => mount.id == spec.source.mount_id))
    }
    if (spec.dest) {
      tokenPromises.push(destToken(spec.dest), mounts.filter(mount => mount.id == spec.dest.mount_id))
    }
  })
  await Promise.all(tokenPromises)
  return datas
}

async function sourceToken(source, mount) {
  if (!mount) {
    return
  }
  if (mount.error) {
    source.error = mount.error
    return
  }
  if (!source.share) {
    source.error = {message: 'share is required', code: 400}      
    return
  }
  let paths = []
  const sourcePaths = source.paths??[]
  if (source.path_pairs) {
    paths = sourcePaths.concat(source.path_pairs?.map(pair => pair.src))
  }
  const data = {paths: paths}
    data.pls = {}
    data.pls[source.share] = ['read','list','stat']   
    if (source.remove_after) {
      data.pls[source.share].push('rm')
    }   
    const token = await genJWT(data, mount.username, mount.privatekey, mount.kid)
    source.token = "bearer " + token    
}

async function destToken(dest, mount) {
  if (!mount) {
    return
  }
  if (mount.error) {
    dest.error = mount.error
    return
  }
  if (!dest.share) {
    dest.error = {message: 'share is required', code: 400}      
    return
  }
  const data = {}
  if (dest.path) {
    data.paths = [dest.path]
  }
  data.pls = {}
  data.pls[dest.share] = ['write','list','stat']      
  const token = await genJWT(data, mount.username, mount.privatekey, mount.kid)
  dest.token = "bearer " + token  
}

async function getMounts(mounts) {
  const mountPromises = []
  mounts.map(mount => {
    mountPromises.push(getMount(mount))
  })
  await Promise.all(mountPromises)
}

async function getMount(mount) {
  const m = await prisma.mount.findUnique({
    where: {
        id: +mount.id,
    },
  });
  if (!m) {
    mount.error = {message: 'no such xfer account', code: 400}      
    return
  }
  mount.username = m.username
  mount.privatekey = m.privatekey
  mount.kid = m.kid  
}