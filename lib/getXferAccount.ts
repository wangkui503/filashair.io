var pathlib = require('path');
import toast from "react-hot-toast";
import { uniqueByKey } from "@/lib/unique";
import { sherr } from "./errors";
export async function getPubKey(mount, token, kid) {

    const res = await fetch(mount.host + '/keys/' + kid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },      
    })
    
    
      if (res.status === 200) {
        const pubkey = await res.json()
        return pubkey
        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  

  export async function getSelfRaw(host, username, password) {
    const res = await fetch(host + '/self', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + btoa(username + ":" + password)
      },      
    })
    
    
      if (res.status === 200) {
        const self = await res.json()
        return self
        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  export async function getPylonSelf(host, token) {
    const res = await fetch(host + '/self', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },      
    })
    
    
      if (res.status === 200) {
        const self = await res.json()
        console.log('getPylonSelf--', self)
        return self        
      } else {
        throw res
      }
    
  }


  export async function getSelf(mount, token) {
    try {
      const res = await fetch(mount.host + '/self', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token,
        },      
      })
    
    
      if (res.status === 200) {
        const self = await res.json()
        return self
        
      } else {
        throw res        
      }
    } catch (error) {
      sherr(error)
      
    }
    
  }

  export async function getShares(mount, token) {
    const res = await fetch(mount.host + '/shares', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },      
    })
    
    
      if (res.status === 200) {
        const shares = await res.json()
        return shares        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  export async function getShare(mount, token, share) {
    const res = await fetch(mount.host + '/shares/' + share, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },      
    })
    
    
      if (res.status === 200) {
        const share = await res.json()
        return share        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  export async function getPylonToken(userid) {
    const res = await fetch("/api/pylon/" + userid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },      
    })
    
    
      if (res.status === 200) {
        const token = await res.json()
        return token        
      } else {
        throw res
      }
    
  }

  export async function getTokenWithShare(mount_id, share) {
    const res = await fetch("/api/tokens/" + mount_id + "?share=" + share, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },      
    })
    
    
      if (res.status === 200) {
        const result = await res.json()
        return result.token        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }


  export async function getMountWithToken(mount_id, share) {
    const res = await fetch("/api/tokens/" + mount_id + '?share=' + share, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },      
    })
    
    
      if (res.status === 200) {
        const result = await res.json()
        return result       
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }
  

  export async function getToken(mount_id) {
    const res = await fetch("/api/tokens/" + mount_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },      
    })
    
    
      if (res.status === 200) {
        const result = await res.json()
        return result.token        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  export async function postShares(mount, token, data) {
    const res = await fetch(mount.host + '/shares', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },     
      body: JSON.stringify(data), 
    })
    
    
      if (res.status === 200) {
        const share = await res.json()
        return share        
      } else if (res.status === 409) {
        return data
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  export async function createFile(mount, token, storage, data) {
    const res = await fetch(mount.host + '/files', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
        'filash-storage': storage,
        'filash-recursively': 'true'
      },     
      body: JSON.stringify(data), 
    })
    
    
      if (res.status === 200 || res.status === 409) {
        return true
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  export async function newXferAccount(host, token, data) {
    const res = await fetch(host + '/users', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,                
      },    
      body: JSON.stringify(data),
    })
      if (res.status === 200) {        
        const acc = await res.json()
        console.log("newXferAccount 200--------------",acc)        
        return acc        
      }
      console.log("newXferAccount throw--------------",res)        
      throw res
      
    
  }

  export async function newStorage(host, token, data) {
    const res = await fetch(host + '/storages', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,        
      },    
      body: JSON.stringify(data),
    })
      if (res.status === 200) {        
        const storage = await res.json()
        console.log("newStorage 200--------------",storage)        
        return storage
      } else if (res.status === 409) {
        console.log("newStorage 409--------------",data)        
        return data
      } else {
        throw res
      }
    
  }

  export async function newShare(host, token, data) {
    const res = await fetch(host + '/shares', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,        
      },    
      body: JSON.stringify(data),
    })
      if (res.status === 200) {        
        const share = await res.json()
        console.log("newShare--------------",share)        
        return share
      } else if (res.status === 409) {
        return data
      } else {
        throw res
      }
    
  }



  export async function getResourcesWith(cache, refresh, resource, limit, mount, token, ascend, setList, count, setCount, share, storage, domain, more, callback) {
    if (!mount || !token) return
    if (!domain) {
      domain = ''
    }
    
    let slot = mount
    if (domain) {
      slot['filash-domain'] = slot['filash-domain'] ?? {}
        if (refresh) {
        slot['filash-domain'][domain] = {}
      } else {
        slot['filash-domain'][domain] = slot['filash-domain'][domain] ?? {}        
      }
      slot = slot['filash-domain'][domain]
    }
    if (storage) {
      slot['filash-storage'] = slot['filash-storage'] ?? {}
      if (refresh) {
        slot['filash-storage'][storage] = {}
      } else {
        slot['filash-storage'][storage] = slot['filash-storage'][storage] ?? {}
      }
      slot = slot['filash-storage'][storage]
    } else if (share) {
      slot['filash-share'] = slot['filash-share'] ?? {}
      if (refresh) {
        slot['filash-share'][share] = {}
      } else {
        slot['filash-share'][share] = slot['filash-share'][share] ?? {}
      }      
      slot = slot['filash-share'][share]
    }
    if (refresh) {
      slot[resource] = {}
    } else {
      slot[resource] = slot[resource] ?? {}
    }
    slot = slot[resource]
    if (cache && slot.all) {
      setList(slot?.all)
      return
    }

    if (ascend && !slot?.filashnexttoken) {
      return
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token,
      'Filash-Next-Token': ascend? slot?.filashnexttoken??'' : slot?.olderfilashnexttoken??''
    }
    if (domain) {
      headers['filash-domain'] = domain
    }
    if (storage) {
      headers['filash-storage'] = storage
    } else if (share) {
      headers['filash-share'] = share
    }
    if (ascend) {
      headers['filash-ascend'] = 'true'
    }        
    
    fetch(mount.host + '/'+resource+'?limit='+limit, {
      method: "GET",
      headers: headers,
    }).then(async (res) => {
      if (res.status === 200) {
        const xcount = Number(res.headers.get("X-Count"))?? 0
        const xtotalcount = Number(res.headers.get("X-Total-Count"))?? 0

        const newNextToken = res.headers.get('Filash-Next-Token')        
        
        slot.xtotalcount = xtotalcount
        slot.all = slot.all ?? []
        

        if (!newNextToken || xcount < 1) {
          if (!ascend) {            
            slot.more = false
            more.meta = slot.more
          }
        } else {
          if (!ascend) {    
            slot.more = true
            more.meta = slot.more
          }
        }
        
        
        let result = []
        if (xcount > 0) {
          result = await res.json()
        }
        
        

        if (newNextToken) {
          if (!slot.olderfilashnexttoken) {
            slot.olderfilashnexttoken = newNextToken  
          }
          if (!slot.filashnexttoken) {
            slot.filashnexttoken = newNextToken
          }
          if (ascend) {
            slot.filashnexttoken = newNextToken            
          } else {            
            slot.olderfilashnexttoken = newNextToken
          }
        }
        
        if (result.length > 0) {
          if (ascend) {
            slot.all = uniqueByKey([...result.reverse(), ...slot.all], 'id')          
          } else {
            slot.all = uniqueByKey([...slot.all, ...result], 'id')
          }
        }

        console.log("getLatestJobs result--------------", result, slot?.all, newNextToken, resource+domain)

        setList(slot?.all)
        
        console.log("getLatestJobs filashnexttoken--------------",more.meta, slot?.filashnexttoken)
        
        if (callback) {
          callback(slot)
        }
        return
      }
      sherr(res)
    });
  }



  export async function createFolder(path, mount, token, share, storage, domain, callback) {
    if (!mount || !token || (!storage && !share)) {
      toast.error('mount, token and storage/share are required');
      return
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token,    
    }
    if (domain) {
      headers['filash-domain'] = domain
    }
    if (storage) {
      headers['filash-storage'] = storage
    } else if (share) {
      headers['filash-share'] = share
    }
    
    const data = {
      path: path,
      type: 'folder'
    }
    const res = await fetch(mount.host + '/files', {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
    
    
      if (res.status === 200) {        
        toast.success('Created successfully!')
        callback()        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
  }

  

  export async function newSearchJob(keyword, path, mount, token, share, storage, domain) {
    if (!mount || !token || (!storage && !share)) {
      toast.error('mount, token and storage/share are required');
      return
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token,                
    }
    if (domain) {
      headers['filash-domain'] = domain
    }
    if (storage) {
      headers['filash-storage'] = storage
    } else if (share) {
      headers['filash-share'] = share
    }
    const data = {
      spec: {
        action: 'search',
        path: path,
        name: keyword
      }
    }
    if (storage) {
      data.spec.storage = storage
    } else if (share) {
      data.spec.share = share
    }
    if (!data.spec.path) {
      data.spec.path = "/"
      return
    }
    if (!data.spec.name) {
      toast.error('keyword is required')
      return
    }
    fetch(mount.host + '/jobs', {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        const job = await res.json()
        console.log("new job--------------",job)           
        return job
      }
      throw res
    })
  }

  export async function deleteJob(parent, file, mount, token, share, storage, domain) {
    if (!mount || !token || (!storage && !share)) {
      toast.error('mount, token and storage/share are required');
      return
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token,                
    }
    if (domain) {
      headers['filash-domain'] = domain
    }
    if (storage) {
      headers['filash-storage'] = storage
    } else if (share) {
      headers['filash-share'] = share
    }
    const data = {
      spec: {
        action: 'rm',
        path: pathlib.join(parent, file.name),
      }
    }
    if (storage) {
      data.spec.storage = storage
    } else if (share) {
      data.spec.share = share
    }
    if (!confirm('Delete ' + data.spec.path)) return
    
    if (!data.spec.path) {
      toast.error('path is required')
      return
    }
    fetch(mount.host + '/jobs', {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        const job = await res.json()
        console.log("new job--------------",job)        
        return job
      }
      throw res
    })
  }

  export async function rmShare(share, mount, token, domain, callback) {
    if (!mount || !token) {
      toast.error('mount, token are required');
      return
    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token,  
      'last_updated_at': share.last_updated_at
    }
    if (domain) {
      headers['filash-domain'] = domain
    }

    if (!confirm("Delete " + share.id + " ?")) return
    fetch(mount.host + '/shares/' + share.id, {
      method: "DELETE",
      headers: headers,
    }).then(async (res) => {
      if (res.status === 200) {
        callback()        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }

  export async function rmStorage(storage, mount, token, domain, callback) {
    if (!mount || !token) {
      toast.error('mount, token are required');
      return
    }
    if (!confirm("Delete " + storage.id + " ?")) return  
    const headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token,
      'last_updated_at': storage.last_updated_at,
    }
    if (domain) {
      headers['filash-domain'] = domain
    }
    fetch(mount.host + "/storages/" + storage.id, {
      method: "DELETE",
      headers: headers,
    }).then(async (res) => {
      if (res.status === 200) {
        callback()        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    });
  }


  function pathParents(path) {
    const names = []
    for (;;) {
      if (!pathlib.basename(path)) {
        break
      }
      names.push(path)
      path = pathlib.dirname(path) + '/'
      console.log("parents names---", names)
    }
    names.push('/')    
    
    return names.reverse()
  }
  
  
  export async function getFilesResource(cache, refresh, path, limit, mount, token, share, storage, domain, callback) {
    if (!mount || !token) return
    if (!domain) {
      domain = ''
    }




    const resource = pathlib.join('files', path)
    let slot = mount
    if (domain) {
      slot['filash-domain'] = slot['filash-domain'] ?? {}
        if (refresh) {
        slot['filash-domain'][domain] = {}
      } else {
        slot['filash-domain'][domain] = slot['filash-domain'][domain] ?? {}        
      }
      slot = slot['filash-domain'][domain]
    }
    if (storage) {
      slot['filash-storage'] = slot['filash-storage'] ?? {}
      if (refresh) {
        slot['filash-storage'][storage] = {}
      } else {
        slot['filash-storage'][storage] = slot['filash-storage'][storage] ?? {}
      }
      slot = slot['filash-storage'][storage]
    } else if (share) {
      slot['filash-share'] = slot['filash-share'] ?? {}
      if (refresh) {
        slot['filash-share'][share] = {}
      } else {
        slot['filash-share'][share] = slot['filash-share'][share] ?? {}
      }      
      slot = slot['filash-share'][share]
    }
    if (refresh) {
      slot[resource] = {}
    } else {
      slot[resource] = slot[resource] ?? {}
    }
    slot = slot[resource]

    if (cache && slot.all) {
      callback(slot)
      return
    }

    const headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token,
      'Filash-Next-Token': slot?.filashnexttoken?? '',
    }
    if (domain) {
      headers['filash-domain'] = domain
    }
    if (storage) {
      headers['filash-storage'] = storage
    } else if (share) {
      headers['filash-share'] = share
    }
    
    
    
    
    fetch(mount.host + '/'+resource+'?limit='+limit, {
      method: "GET",
      headers: headers,  
    }).then(async (res) => {    
    
      if (res.status === 200) {
        const xcount = Number(res.headers.get("X-Count"))?? 0
        const xtotalcount = Number(res.headers.get("X-Total-Count"))?? 0
        slot.xcount = xcount
        slot.xtotalcount = xtotalcount
              
        const newNextToken = res.headers.get('Filash-Next-Token')        
        if (newNextToken) {
          slot.filashnexttoken = newNextToken
        }
        slot.all = slot.all ?? []
        slot.storage = storage
        slot.share = share
        slot.path = path
        slot.type = path.endsWith('/') ? 'folder': ''
        slot.parents = pathParents(path)

        if (!newNextToken || xcount < 1) {
            slot.more = false        
        } else {
            slot.more = true 
        }
        let result = []
        if (xcount > 0) {
          result = await res.json()
        }

        if (result.length > 0) {
            slot.all = uniqueByKey([...slot.all, ...result], 'name')          
        }
        callback(slot)
        return
      }
      sherr(res)
    });
      
    
  }