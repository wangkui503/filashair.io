'use client';
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import { tabSwitch } from "@/lib/tab";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import NextPage from "../nextPage";
import { uniqueByKey } from "@/lib/unique";
import TransferNav from "./transferNav";
import TransferListCard from "./transferListCard";
import FilterBar from "@/components/filterbar";

export default function TransferList({refreshList, list, more, newLimit, setDetailTransfer}) {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const filterPatternRef = useRef<HTMLInputElement | null>(null);  
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useCounter();
  const { data: session, status } = useSession()
  const [loaded, setLoaded] = useState(false);
  const [shareds, setShareds] = useState([]);

  const [currentMount, setcurrentMount] = useState({meta:null});
  
  
  const curmount = count.meta[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
  const mount = curmount?.mount
  const token = curmount?.token


  

  function provisionInviteMessage(message) {
    console.log("provisionInviteMessage------", message)
    console.log("provisionInviteMessage message------", message.message)
    const specs = JSON.parse(message.specs)
    console.log("provisionInviteMessage message specs------", message.direction, specs)

    xferDrawer.meta.messageDrawer = xferDrawer.meta.messageDrawer?? {}

    if (xferDrawer.meta.messageDrawer?.friends?.length > 0 || 
      xferDrawer.meta.messageDrawer?.sources?.length > 0 || 
      xferDrawer.meta.messageDrawer?.dests?.length > 0) {
      if (xferDrawer.meta.messageDrawer?.message && 
        xferDrawer.meta.messageDrawer?.message.id != message.id) {
        if (confirm("Clear current message?")) {
        xferDrawer.meta.messageDrawer = {}
        /* setxferDrawer({
          meta: xferDrawer.meta
        }) */
      } else {
        return
      }
    }}

    
    xferDrawer.meta.messageDrawer.message = message
    xferDrawer.meta.messageDrawer.message.resubject = "Re: " + message.subject
    xferDrawer.meta.messageDrawer.message.remessage = "\n\n" + "On " + message.createdat + "\n" + "From  " + message.email + "\n" + message.message + "\n\n"

    
      xferDrawer.meta.messageDrawer.sources = []
      const sources = xferDrawer.meta.messageDrawer?.sources
      xferDrawer.meta.messageDrawer.dests = []
      const dests = xferDrawer.meta.messageDrawer?.dests
      
      specs?.map((spec) => {
        const source = {
          key: spec.spec.source.mount_id+spec.spec.source.share,
          mount_id: spec.spec.source.mount_id,
          xfer_addr: spec.spec.remote_address,
          share: spec.spec.source.share,
          paths: [],
        }
        spec.spec.source.paths.map((path)=>{
          source.paths.push({path: path})
        })
        sources.push(source)

        const dest = {
          key: spec.spec.dest.mount_id+spec.spec.dest.share+spec.spec.dest.path,
          mount_id: spec.spec.dest.mount_id,
          xfer_addr:  spec.spec.remote_address,
          share: spec.spec.dest.share,
          path: spec.spec.dest.path,
        }
        dests.push(dest)
        console.log("provisionInviteMessage dests-----", dests)
        console.log("provisionInviteMessage spec-----", spec.spec)
        console.log("provisionInviteMessage sources-----", sources)
      })
      setXferDrawer({
        meta: xferDrawer.meta
      })
    
    tabSwitch('createTransferRef', 'auto')
  }





  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return list
    
    const patterns = filterPattern.split(' ')
    let filtered = list
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.status === pattern || item.direction === pattern || item.message?.includes(pattern) || item.specs?.includes(pattern) || item.updatedat?.includes(pattern))
    }
    
    return filtered
  }

  function clearFilterPattern() {
    if (!filterPatternRef.current) return
    setFilterPattern(undefined)
    filterPatternRef.current.value = ''
  }


  if (session?.user) {  
  return (
<>

<div ref={listRef} className="relative pb-4 bg-white ">
<TransferNav page="transferListRef"/>
    
  </div>

  <FilterBar setFilterPattern={setFilterPattern}/>









  <div className="w-full">

<div className="w-full grid md:grid-cols-8 justify-start border-b">

<div className="flex flex-row justify-start gap-4 leading-normal">
    <h5 className="font-semibold tracking-tight text-gray-900 ">
      Direction 
    </h5>    
    <div>
      <button
      onClick={()=>refreshList()}
      >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0789 2.25C7.2854 2.25 3.34478 5.913 2.96055 10.5833H2.00002C1.69614 10.5833 1.42229 10.7667 1.30655 11.0477C1.19081 11.3287 1.25606 11.6517 1.47178 11.8657L3.15159 13.5324C3.444 13.8225 3.91567 13.8225 4.20808 13.5324L5.88789 11.8657C6.10361 11.6517 6.16886 11.3287 6.05312 11.0477C5.93738 10.7667 5.66353 10.5833 5.35965 10.5833H4.4668C4.84652 6.75167 8.10479 3.75 12.0789 3.75C14.8484 3.75 17.2727 5.20845 18.6156 7.39279C18.8325 7.74565 19.2944 7.85585 19.6473 7.63892C20.0002 7.42199 20.1104 6.96007 19.8934 6.60721C18.2871 3.99427 15.3873 2.25 12.0789 2.25Z" fill="#1C274C"></path> <path d="M20.8411 10.4666C20.549 10.1778 20.0789 10.1778 19.7867 10.4666L18.1005 12.1333C17.8841 12.3471 17.8184 12.6703 17.9339 12.9517C18.0495 13.233 18.3235 13.4167 18.6277 13.4167H19.5268C19.1455 17.2462 15.8759 20.25 11.8828 20.25C9.10026 20.25 6.66586 18.7903 5.31796 16.6061C5.10042 16.2536 4.63833 16.1442 4.28583 16.3618C3.93334 16.5793 3.82393 17.0414 4.04146 17.3939C5.65407 20.007 8.56406 21.75 11.8828 21.75C16.6906 21.75 20.6475 18.0892 21.0331 13.4167H22.0002C22.3043 13.4167 22.5783 13.233 22.6939 12.9517C22.8095 12.6703 22.7437 12.3471 22.5274 12.1333L20.8411 10.4666Z" fill="#1C274C"></path> </g></svg>
      </button>
    </div> 
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      Status
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      Comments
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      Sources
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      Dests
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
      Error
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
      Last Updated at
    </p>
  </div>
  
</div>


{
  filter()?.map((transfer, i) => {
    return (
      <TransferListCard key={i} transfer={transfer} i={i} provisionInviteMessage={provisionInviteMessage} setDetailTransfer={setDetailTransfer}/>
    )
  })
}
  
<div>
  {list.length} entries
</div>


<NextPage more={more} newLimit={newLimit} monitors={[]}/>



</div>
        
          
          </>                    
  
  );
  }
}
