import { getMountWithToken } from "./getXferAccount";
import toast from "react-hot-toast"
async function abortXferLoc(xfer, loc) {    
    const mount_id = loc.mount_id
    if (!loc.mount) {
      const mountWithToken = await getMountWithToken(loc.mount_id, loc.share)
      loc.mount = mountWithToken.mount  
      loc.mount.token = mountWithToken.token
      if (!loc.mount) {
        return false
      }      
    }
    const res = await fetch(loc.mount.host + "/transfers/"+xfer.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "bearer " + loc.mount.token,
      },    
      body: JSON.stringify({"status":"aborted"}),
    })
    console.log("abortXfer--------------",xfer, res)
    if (res.status === 204) {
      
      return true;
    } else if (res.status === 404) {
      const result = await res.json()
      toast.error("Abort xfer error: " + res.status);
    } else {
      toast.error("Abort xfer error: " + res.status);
    } 
    return false   
  }

  async function abortXferLocDownload(xfer) {
    const success = await abortXferLoc(xfer, xfer.spec.dest)
    if (success) return
    await abortXferLoc(xfer, xfer.spec.source)
  }

  async function abortXferUpload(xfer) {
    const success = await abortXferLoc(xfer, xfer.spec.source)
    if (success) return
    await abortXferLoc(xfer, xfer.spec.dest)    
  }

  async function abortXfer(xfer) {
    if (xfer.spec?.action === 'download')
      await abortXferLocDownload(xfer)
    else if (xfer.spec?.action === 'upload')
      await abortXferUpload(xfer)    
  }

  export async function abortXfers(transfer) {
    transfer.xfers?.map(xfer => {
      abortXfer(xfer)
    })
    transfer.error = 'Aborted'
  }