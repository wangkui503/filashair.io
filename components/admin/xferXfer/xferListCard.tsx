var pathlib = require('path');
import { useRef, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useCounter } from "@/components/context/context";
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";

const final_statuses = ['completed', 'aborted']

export default function XferListCard({transfer, i, setDetailTransfer}) {    
  const funcsRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token

  const [transferCard, setTransferCard] = useState({meta:transfer});


  useEffect(() => {    
    
    if (!transfer) return
    transferCard.meta = transfer
    setTransferCard({meta:transferCard.meta})
    if (final_statuses.includes(transferCard.meta.status)) return
    doPollTransferStatus()
    const pollingStatusThread = setInterval(() => {   
      console.log("transfer status polling--------------", transfer, transferCard)
        if (final_statuses.includes(transferCard.meta.status))
          clearInterval(pollingStatusThread); 
        else 
          doPollTransferStatus()
    }, 5000)
    return () => clearInterval(pollingStatusThread);
  }, [transfer])

  async function doPollTransferStatus(pollingStatusThread) {
    if (final_statuses.includes(transferCard.meta.status)) return
    getXfer(pollingStatusThread)
  }

  async function getXfer(pollingStatusThread) {
    if (!token) return
    const res = await fetch(mount.host + "/transfers/"+transferCard.meta.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "bearer " + token,
      },    
    })
    if (res.status === 200) {
      const result = await res.json()
      transferCard.meta.status = result.status
      transferCard.meta.progress = result.progress
      setTransferCard({meta:transferCard.meta})
      
      console.log("getXferLoc-count.meta?.curmountid-------------", count.meta?.curmountid)
      return true;
    } else {
      if (res.status === 404) {
        const result = await res.json()        
      }
      if (pollingStatusThread) {
        clearInterval(pollingStatusThread);
      }
      console.log("Get transfer error: " + res.status);
    } 
    return false   
  }

    return (
        
  <div className={`${transferCard.meta.error? 'bg-red-50' : (i%2 === 0 ? 'bg-stone-100':'')} ${transferCard.meta.direction === 'upload' ? 'font-semibold':'font-normal'} w-full grid md:grid-cols-9 justify-start gap-4 border-b md:hover:shadow-xl md:hover:bg-slate-200`}>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.id}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.spec?.action}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.status}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.progress?.progress}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.spec?.source?.paths?.join(', ')} {" @ "} {transferCard.meta.spec?.source?.share}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.spec?.dest?.path} {" @ "} {transferCard.meta.spec?.dest?.share}
          </p>
        </div>
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.error}
          </p>
        </div>
        
        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {transferCard.meta.last_updated_at}
          </p>
        </div>

        <div className="flex flex-col justify-start py-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
            <button onClick={() => {setDetailTransfer(transferCard.meta);tabSwitch('xferDetailRef','auto')}}>
            <svg className="w-6 h-6" fill="#137ED9" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8h9a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"></path></g></svg>
            </button>
          </p>
        </div>
        
        
      </div>             
 
      )
}