var pathlib = require('path');
import { useRef, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useCounter } from "@/components/context/context";
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import { abortXfers } from "@/lib/transfers";
import { getMountWithToken } from "@/lib/getXferAccount";
import { shortBPS } from "@/lib/bps";
const final_statuses = ['completed', 'aborted']

export default function MessageListCard({transfer, i, provisionInviteMessage, setDetailSendMessage}) {    
  const funcsRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]

  const [transferCard, setTransferCard] = useState({meta:transfer});

  const expiresat = transferCard.meta?.createdat? new Date(transferCard.meta?.createdat) : new Date()
  expiresat.setHours(expiresat.getHours() + +transferCard.meta.expire);

  async function expireit() {
    if (!transferCard.meta) return
    if (transferCard.meta.status == 'completed') return
    const now = new Date()
    if (!expiresat || now < expiresat) return
    transferCard.meta.status = 'completed'
    transferCard.meta.error = 'expired'
    updateTransferStatus(transfer)
  }


  useEffect(() => {    
    
    if (!transfer) return
    transferCard.meta = transfer
    setTransferCard({meta:transferCard.meta})
    if (transfer.kind != 'xfer') return
    if (final_statuses.includes(transferCard.meta.status)) return
    if (!transferCard.meta.xfers) {
      transferCard.meta.xfers = JSON.parse(transferCard.meta.specs)
    }
    if (transferCard.meta.xfers?.length < 1 ) {
      return
    }
    doPollTransferStatus(transferCard)
    const pollingStatusThread = setInterval(() => {   
      console.log("transfer status polling--------------", transfer, transferCard)
        if (final_statuses.includes(transferCard.meta.status))
          clearInterval(pollingStatusThread); 
        else 
          doPollTransferStatus(transferCard)
    }, 1000)
    return () => clearInterval(pollingStatusThread);
  }, [transfer])

  async function doPollTransferStatus(transfer) {
    if (final_statuses.includes(transferCard.meta.status)) return
    transferCard.meta.xfers?.map(xfer => {
      if (!xfer.id || final_statuses.includes(xfer.status)) return
      getXfer(transfer, xfer)    
    })    
  }

  async function getXferLoc(transfer, xfer, loc) {
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "bearer " + loc.mount.token,
      },    
    })
    if (res.status === 200) {
      const result = await res.json()
      xfer.status = result.status
      xfer.progress = result.progress
      transferCard.meta.updatedat = result.last_updated_at
      if (result.error) {
        transferCard.meta.error = result.error
      }
      
      const xfers = transferCard.meta.xfers?.filter(xfer => xfer.id)
      if (final_statuses.includes(xfer.status)) {
        isAllCompleted(transfer)        
      }
      const progresses = xfers?.reduce(
        (accumulator, currentValue) => (accumulator + currentValue.progress?.progress??0),
        0,
      ) / xfers.length
      if (progresses != transferCard.meta.progress) {
        transferCard.meta.progress = progresses.toFixed(2)?? 0
        console.log("transferCard.progress---", transferCard.meta.progress)
        setTransferCard({meta:transferCard.meta})
      }
      
      console.log("getXferLoc--------------",xfer.progress?.progress, xfer)
      return true;
    } else {
      xfer.status = 'completed'
      xfer.error = res.statusText
      transferCard.meta.error = xfer.error
      expireit()
      console.log("Get transfer error: " + res.status);
    } 
    return false   
  }

  async function isAllCompleted(transfer) {
    const xfers = transferCard.meta.xfers
    const completeds = xfers?.reduce(
      (accumulator, currentValue) => accumulator + (final_statuses.includes(currentValue.status) ? 1 : 0),
      0,
    );

    if (completeds == xfers?.length) {
      transferCard.meta.status = 'completed'
      updateTransferStatus(transfer)
      setTransferCard({meta:transferCard.meta})
    }        
  }

  async function getXferLocDownload(transfer, xfer) {
    const success = await getXferLoc(transfer, xfer, xfer.spec.dest)
    if (success) return
    await getXferLoc(transfer, xfer, xfer.spec.source)
  }

  async function getXferUpload(transfer, xfer) {
    const success = await getXferLoc(transfer, xfer, xfer.spec.source)
    if (success) return
    await getXferLoc(transfer, xfer, xfer.spec.dest)    
  }

  async function getXfer(transfer, xfer) {
    if (xfer.spec?.action === 'download')
      await getXferLocDownload(transfer, xfer)
    else if (xfer.spec?.action === 'upload')
      await getXferUpload(transfer, xfer)    
  }
 

  async function updateTransferStatus(transfer) {
    const data = {
      id: transferCard.meta.id,
      status: transferCard.meta.status,
      error: transferCard.meta.error,
      updatedat: transferCard.meta.updatedat
    }
    fetch("/api/messages/"+transferCard.meta.id + "?kind=send", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },    
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        await res.json()
        console.log("updateTransferStatus--------------",transfer)        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }


  const specsObj = JSON.parse(transferCard.meta.specs)
  const sources = specsObj?.map(xfer => xfer.spec?.source?.paths)
  

    return (
        
  <div className={`${transferCard.meta.error ? 'bg-red-100' : i%2 === 0 ? 'bg-stone-100':''} ${transferCard.meta.direction === 'upload' ? 'font-semibold':'font-normal'} w-full grid md:grid-cols-9 justify-start gap-3 border-b md:hover:shadow-xl md:hover:bg-slate-200`}>
      <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta?.id}
          </p>
        </div>
        
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.tos}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
            {!final_statuses.includes(transferCard.meta.status)? transferCard.meta.progress + "%" + ' - ' + shortBPS(transferCard.meta.xfers): transferCard.meta.status}
          </p>
        </div>
        
        <div className="w-full whitespace-nowrap overflow-x-auto scrollbar-hide flex flex-col md:flex-row justify-start py-3 leading-normal">                    
          <span className="hidden md:block md:whitespace-nowrap">&nbsp; - &nbsp;</span>
          <button 
              onClick={()=>{setDetailSendMessage(transferCard.meta); tabSwitch('sendMessageDetailRef', 'auto')}}
          className="whitespace-nowrap overflow-x-auto scrollbar-hide whitespace-nowrap text-gray-500">
          <span>{transferCard.meta.subject}</span>
          <span>{transferCard.meta.message}</span>
          </button>          
        </div>
        
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {sources.join(',')}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {expiresat?.toISOString()}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.error}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.updatedat}
          </p>
        </div>
        <div className="flex flex-row gap-6 justify-start py-3 leading-normal">
          <button 
          onClick={()=>{setDetailSendMessage(transferCard.meta); tabSwitch('sendMessageDetailRef', 'auto')}}
          >
          <svg className="w-6 h-6" fill="#137ED9" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8h9a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"></path></g></svg>
          </button>          
          {
            final_statuses.includes(transferCard.meta.status) ? '' : (
              <button 
              onClick={() => abortXfers(transferCard.meta)}
              >
              <svg className="w-6 h-6" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128z m0 85.333333c66.133333 0 128 23.466667 179.2 59.733334L273.066667 691.2C236.8 640 213.333333 578.133333 213.333333 512c0-164.266667 134.4-298.666667 298.666667-298.666667z m0 597.333334c-66.133333 0-128-23.466667-179.2-59.733334l418.133333-418.133333C787.2 384 810.666667 445.866667 810.666667 512c0 164.266667-134.4 298.666667-298.666667 298.666667z" fill="#D50000"></path></g></svg>
              </button>                    
            )
          }
        </div>
        
        
      </div>             
 
      )
}