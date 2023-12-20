var pathlib = require('path');
import { useRef, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useCounter } from "@/components/context/context";
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import { shortBPS } from "@/lib/bps";

const final_statuses = ['completed', 'aborted']

export default function ReceiveMessageListCard({currentPath, setCurrentPath, transfer, i, provisionInviteMessage, setDetailReceiveMessage}) {    
  const funcsRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]

  const [transferCard, setTransferCard] = useState({meta:transfer});

  const expiresat = transferCard.meta?.createdat? new Date(transferCard.meta?.createdat) : new Date()
  expiresat.setHours(expiresat.getHours() + +transferCard.meta.message.expire);

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
      console.log("transferCard.meta.xfers---", transferCard.meta.xfers)
    }
    if (transferCard.meta.xfers?.length < 1 ) {
      return
    }

    doPollTransferStatus(transferCard)
    const pollingStatusThread = setInterval(() => {   
      console.log("ReceiveMessageListCard status polling--------------", transfer, transferCard)
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
    console.log("getXferLoc---", loc)
    if (!loc.token || !loc.host) return
    const res = await fetch(loc.host + "/transfers/"+xfer.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': loc.token,
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
    fetch("/api/messages/"+transferCard.meta.id, {
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

  const specsObj = JSON.parse(transferCard?.meta?.message?.specs)
  const sources = specsObj?.map(xfer => xfer.spec?.source?.paths)


  async function goSub() {
    const mountExist = count.meta?.[count.meta.curuser?.inbox?.mount_id]
    
    if (!mountExist) {
      console.log("message gosub-- ", count.meta.curmountid, count.meta.mounts, count.meta.curuser?.inbox?.mount_id)
      toast.error('the xfer account is not loaded')
      return
    }
    const exist = curmount?.shares?.filter((share)=>share.id == count.meta.curuser?.inbox?.share)[0]
    if (!exist) {
      toast.error('the share is not loaded')
      return
    }

    
    count.meta.curmountid = count.meta.curuser?.inbox?.mount_id
    curmount.curshareid = count.meta.curuser?.inbox?.share
    setCount({
      meta: count.meta
    })
    
    currentPath.share = count.meta.curuser?.inbox?.share
    currentPath.meta = pathlib.join(count.meta.curuser?.inbox?.path, transferCard.meta?.message?.id, '/')
    setCurrentPath({meta:currentPath.meta})
    console.log('message go sub--', count)
    tabSwitch('filesListRef', 'auto')      
    
    console.log("message go sub---", currentPath.meta)
        
}
   

    return (
        
  <div className={`${transferCard.meta.error ? 'bg-red-100' : i%2 === 0 ? 'bg-stone-100':''} ${transferCard.meta.direction === 'upload' ? 'font-semibold':'font-normal'} w-full grid md:grid-cols-9 justify-start gap-3 border-b md:hover:shadow-xl md:hover:bg-slate-200`}>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
            <button onClick={goSub}>
              {transferCard.meta?.message.id}
            </button>          
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
        
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta?.message?.email}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
            {transferCard.meta.progress < 100? transferCard.meta.progress + "%" + ' - ' + shortBPS(transferCard.meta.xfers): transferCard.meta.status}
          </p>
        </div>
        


        <div className="w-full whitespace-nowrap overflow-x-auto scrollbar-hide flex flex-col gap-3 md:flex-row justify-start py-3 leading-normal">                    
        {
          transferCard.meta.kind === 'invite' ? (
            <button 
              onClick={()=>provisionInviteMessage(transferCard.meta)}
            className="whitespace-nowrap text-gray-700">
              {
                transferCard.meta.message?.direction === 'upload' ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z" fill="#137ED9"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#137ED9"></path> </g></svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C11.5858 1.25 11.25 1.58579 11.25 2V12.9726L9.56944 11.0119C9.29988 10.6974 8.8264 10.661 8.51191 10.9306C8.19741 11.2001 8.16099 11.6736 8.43056 11.9881L11.4306 15.4881C11.573 15.6543 11.7811 15.75 12 15.75C12.2189 15.75 12.427 15.6543 12.5694 15.4881L15.5694 11.9881C15.839 11.6736 15.8026 11.2001 15.4881 10.9306C15.1736 10.661 14.7001 10.6974 14.4306 11.0119L12.75 12.9726L12.75 2C12.75 1.58579 12.4142 1.25 12 1.25Z" fill="#137ED9"></path> <path d="M14.25 9V9.37828C14.9836 9.11973 15.8312 9.2491 16.4642 9.79167C17.4077 10.6004 17.517 12.0208 16.7083 12.9643L13.7083 16.4643C13.2808 16.963 12.6568 17.25 12 17.25C11.3431 17.25 10.7191 16.963 10.2916 16.4643L7.29163 12.9643C6.48293 12.0208 6.5922 10.6004 7.53568 9.79167C8.16868 9.2491 9.01637 9.11973 9.74996 9.37828V9H8C5.17157 9 3.75736 9 2.87868 9.87868C2 10.7574 2 12.1716 2 15V16C2 18.8284 2 20.2426 2.87868 21.1213C3.75736 22 5.17157 22 7.99999 22H16C18.8284 22 20.2426 22 21.1213 21.1213C22 20.2426 22 18.8284 22 16V15C22 12.1716 22 10.7574 21.1213 9.87868C20.2426 9 18.8284 9 16 9H14.25Z" fill="#137ED9"></path> </g></svg>
                )
              }
              
            </button>  
            
          ) : ''
        }
          <button 
              onClick={()=>{setDetailReceiveMessage(transferCard.meta); tabSwitch('receveMessageDetailRef', 'auto')}}
          className="whitespace-nowrap overflow-x-auto scrollbar-hide whitespace-nowrap text-gray-500">            
            <span>{transferCard.meta.message?.subject}</span>
            <span className="whitespace-nowrap">&nbsp; - &nbsp;</span>
            <span>{transferCard.meta.message?.message}</span>
          </button>          
        </div>
        
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {sources?.join(',')}
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
          onClick={()=>{setDetailReceiveMessage(transferCard.meta); tabSwitch('receveMessageDetailRef', 'auto')}}
          >
          <svg className="w-6 h-6" fill="#137ED9" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8h9a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"></path></g></svg>
          </button>          
        </div>
        
      </div>             
 
      )
}