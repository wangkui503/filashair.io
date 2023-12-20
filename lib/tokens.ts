import prisma from "@/lib/prisma";
import genJWT from '@/lib/jwt'

async function permit(datas, invite) {
  
}

async function permitShare(session, mount, section, direction) {
  if (session.user.email === mount.email) {
    return
  }
  if (!section.share) {
    section.error = {error: 'share is required', code: 400}
    return
  }
  if (section.share_kind === 'inbox') {
    const inbox = await prisma.inbox.findFirst({
      where: {
          email: section.friend,
      },
    });
    if (inbox) {
      section.pls = {}
      section.pls[section.share] = ['list','write','stat']
      return
    }
  } else if (section.share_kind === 'shared') {
    const shared = await prisma.sharedUser.findFirst({
      where: {
          email: session.user.email,
          share: {
            mount_id: mount.id,
            share: section.share,
          }
      },
      include: {
        share: true
      }
    });
    if (shared) {
      section.pls = {}
      if (shared.share.read) {
        section.pls[section.share].push('read')
      }
      if (shared.share.write) {
        section.pls[section.share].push('write')
      }
      if (shared.share.list) {
        section.pls[section.share].push('list')
      }
      if (shared.share.delete) {
        section.pls[section.share].push('rm')
      }
      if (section.pls[section.share].length > 0) {
        section.pls[section.share].push('stat')
      }  
      return
    } else if (section.share_kind === 'invite') {
      section.pls = {}
      if (direction === 'upload') {        
        section.pls[section.share] = ['list','write','stat']
      } else {
        section.pls[section.share] = ['list','read','stat']
      }
    }
  }
  section.error = {error: 'no permission', code: 403}  
}

async function permitShares(datas, mounts) {
  const permitPromises = []
  datas.map(data => {
    const spec = data.spec
    if (spec.source?.mount_id) {
      permitPromises.push(permitShare(null, mounts.filter(mount => mount.id === spec.source?.mount_id)[0], spec.source, spec.direction))
    }
    if (spec.dest?.mount_id) {
      permitPromises.push(permitShare(null, mounts.filter(mount => mount.id === spec.dest?.mount_id)[0], spec.dest, spec.direction))
    }
  })
}































export async function tokens(session, datas, expire) {
    const mounts = []
    datas.map(data => {
      const spec = data.spec
      if (spec.source?.mount_id) {
        console.log("tokens spec.source.token exist --- ", spec.source)
        if (!spec.source.token) {
          if (!mounts.some(mount => mount.id == spec.source?.mount_id && mount.share == spec.source?.share)) {
            mounts.push({id: spec.source?.mount_id, share: spec.source?.share})
          }
        }
      }
      if (spec.dest?.mount_id) {
        console.log("tokens spec.dest.token exist --- ", spec.dest)
        if (!spec.dest.token) {
          if (!mounts.some(mount => mount.id == spec.dest?.mount_id && mount.share == spec.dest?.share)) {
            mounts.push({id: spec.dest?.mount_id, share: spec.dest?.share})
          }
        }
      }
    })
    await getMounts(session,mounts)
    const tokenPromises = []
    datas.map(data => {
      const spec = data.spec
      console.log("tokens-spec----", spec)
      if (spec.source) {
        tokenPromises.push(sourceToken(session, spec.source, mounts.filter(mount => mount.id == spec.source.mount_id && mount.share == spec.source.share)[0], expire))
      }
      if (spec.dest) {
        tokenPromises.push(destToken(session, spec.dest, mounts.filter(mount => mount.id == spec.dest.mount_id && mount.share == spec.dest.share)[0], expire))
      }
    })
    await Promise.all(tokenPromises)
    console.log("tokens datas --", datas)
    return datas
  }
  
  async function sourceToken(session, source, mount, expire) {
    console.log("sourceToken----", source, mount)
    if (!mount) {
      return
    }
    if (mount.error) {
      source.error = mount.error
      return
    }
    if (!source.share) {
      source.error = {error: 'share is required', code: 400}      
      return
    }
    const paths = source.paths??[]
    if (source.path_pairs) {
      paths.concat(source.path_pairs?.map(pair => pair.src))
    }

    const data = {paths: paths}
    data.pls = {}
    data.pls[source.share] = ['read','list','stat']   
    if (source.remove_after) {
      data.pls[source.share].push('rm')
    }   
    if (session.user?.email != mount.email) {
      data.sub = session.user.email    
      data.sbr = 'regular'
      const shared = mount.shares?.filter(shared => shared.share == source.share)?.[0]
      if (shared && shared.sharedUsers?.length > 0) {
        if (!shared.read || !shared.list) {
          source.error = {error: 'insufficient permissions', code: 403}      
          return
        }
      } else {
        source.error = {error: 'no such share', code: 400}      
        return
      }            
    }

    const token = await genJWT(data, mount.username, mount.privatekey, mount.kid, expire)
    source.host = mount.host
    source.token = "bearer " + token   
    console.log("source.token---", source.token) 
  }
  
  async function destToken(session, dest, mount, expire) {
    
    if (!mount) {
      return
    }
    if (mount.error) {
      dest.error = mount.error
      return
    }
    if (!dest.share) {
      dest.error = {error: 'share is required', code: 400}      
      return
    }
    const data = {}
    if (dest.path) {
      data.paths = [dest.path]
    }
    data.pls = {}
    data.pls[dest.share] = ['write','list','stat']      
    if (session.user?.email != mount.email) {
      data.sub = session.user.email    
      data.sbr = 'regular'
      const shared = mount.shares?.filter(shared => shared.share == dest.share)?.[0]
      const inbox = mount.inboxes?.[0]
      console.log("destToken----", dest, mount)
      if (inbox && !(shared && shared?.sharedUsers?.length > 0)) {
        if (!dest.path.startsWith(inbox.path)) {
          dest.error = {error: 'insufficient permissions for path: ' + dest.path + ' -- ' + inbox.path, code: 403}      
          return
        }
      } else if (shared && shared.sharedUsers?.length > 0) {
        if (!shared.write || !shared.list) {
          dest.error = {error: 'insufficient permissions', code: 403}      
          return
        }
      } else {
        dest.error = {error: 'no such share', code: 400}      
        return
      }       
    }
    const token = await genJWT(data, mount.username, mount.privatekey, mount.kid, expire)
    dest.host = mount.host
    dest.token = "bearer " + token  
  }
  
  async function getMounts(session,mounts) {
    const mountPromises = []
    mounts.map(mount => {
      mountPromises.push(getMount(session,mount))
    })
    await Promise.all(mountPromises)
  }
  
  async function getMount(session,mount) {
    const m = await prisma.mount.findUnique({
      where: {
          id: +mount.id,          
      },
      include: {
        shares: {
          where: {
            share: mount.share
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
            share: mount.share
          }
        }
      }
    });
    if (!m) {
      mount.error = {error: 'no such xfer account', code: 400}      
      return
    }
    mount.email = m.email
    mount.username = m.username
    mount.privatekey = m.privatekey
    mount.kid = m.kid  
    mount.host = m.host
    mount.shares = m.shares
    mount.inboxes = m.inboxes

    console.log("getMount---", m)
  }