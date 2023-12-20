import toast from "react-hot-toast";

export async function getSelfRaw(host, token) {
    const res = await fetch(host + '/self', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': token
      },      
    })
    
    
      if (res.status === 200) {
        const self = await res.json()
        return self        
      } 
      throw res
    
  }
  
export async function putPubKey(mount, mount_id, host, token, kid, pubKey) {
    const res = await fetch(host + '/keys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': token
      },      
      body: JSON.stringify({id: kid, key:pubKey}),
    })
      if (res.status === 200) {
        const result = await res.json()
        return result
      } 
      throw res
    
    
  }

  export async function postMount(serverSpec) {
    const res = await fetch("/api/mount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serverSpec),
    })
      if (res.status === 200) {
        const result = await res.json()
        console.log("new mount--------", result)
        return result 
      }    
      throw res
  }