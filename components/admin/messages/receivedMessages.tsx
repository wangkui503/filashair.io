'use client';
var pathlib = require('path');
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useCounter } from "@/components/context/context";
import ReplyMessage from "./replyMessage";
import SentMessages from "./sentMessages";
import MessagesMenu from "./messageMenu";
import { checkSourceDuplicate, checkDestDuplicate } from "@/lib/duplicate";
import CreateMessage from "./createMessage";
import NextPage from "../nextPage";
import { uniqueByKey } from "@/lib/unique";
import ReceiveMessageListCard from "./receivMessageListCard";
import FilterBar from "@/components/filterbar";

export default function ReceivedMessages({currentPath, setCurrentPath, msgDrawer, setMsgDrawer, setDetailReceiveMessage}) {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const filterPatternRef = useRef<HTMLInputElement | null>(null);  
  
  const [count] = useCounter();

  const { data: session, status } = useSession()
  const [loaded, setLoaded] = useState(false);

  const [pathStore, setPathStore] = useState({paths:{}});


  
  const [detailTransfer, setDetailTransfer] = useState();


  function provisionInviteMessage(message, tab) {
    console.log("provisionInviteMessage------", message)
    console.log("provisionInviteMessage message------", message.message)
    
    
    if (msgDrawer.meta.replyDrawer?.messageID && message.id != msgDrawer.meta.replyDrawer?.messageID) {
      if (!confirm("Clear current reply?")) {
        return
      }
    }
    msgDrawer.meta.replyDrawer = {}
    msgDrawer.meta.replyDrawer.original = message.message
    msgDrawer.meta.replyDrawer.friends = []
    msgDrawer.meta.replyDrawer.friends.push({email: message.message?.email})

    
    
    msgDrawer.meta.replyDrawer.subject = "Re: " + message.message.subject?? ''
    msgDrawer.meta.replyDrawer.message = "\n\n" + "On " + message.createdat + "\n" + "From  " + message.email + "\n" + message.message.message + "\n\n"

    
    if (message.message?.specs) {
      const specs = JSON.parse(message.message?.specs)
      console.log("provisionInviteMessage message specs------", message.direction, specs)

      if (message.message?.direction=='download') {
        msgDrawer.meta.replyDrawer.sources = []
        const sources = msgDrawer.meta.replyDrawer?.sources
        
        specs?.map((spec) => {
          const source = {
            key: spec.spec.source.mount_id+spec.spec.source.share,
            mount_id: spec.spec.source.mount_id,
            xfer_addr: spec.spec.remote_address,
            share: spec.spec.source.share,
            token: spec.spec.source.token,
            paths: [],
          }
          spec.spec.source.paths.map((path)=>{
            source.paths.push({path: path})
          })
          sources.push(source)
          console.log("provisionInviteMessage spec-----", spec.spec)
          console.log("provisionInviteMessage sources-----", sources)
        })
        
      } else if (message.message?.direction=='upload') {
        msgDrawer.meta.replyDrawer.dests = []
        const dests = msgDrawer.meta.replyDrawer?.dests

        specs.map((spec)=>{
          const dest = {
            key: spec.spec.dest.mount_id+spec.spec.dest.share+spec.spec.dest.path,
            mount_id: spec.spec.dest.mount_id,
            xfer_addr:  spec.spec.remote_address,
            share: spec.spec.dest.share,
            path: spec.spec.dest.path,
            token: spec.spec.dest.token,
          }
          dests.push(dest)
          console.log("provisionInviteMessage dests-----", dests)
        })
        
      }
    }
    setMsgDrawer({
      meta: msgDrawer.meta
    })
    tabSwitch(tab ?? 'replyMessage', 'auto')
  }


  const curmount = count.meta?.[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]

  const [lastTransfer, setLastTransfer] = useState({meta:null});
  const [oldestTransfer, setOldestTransfer] = useState({meta:null});
  const [more, setMore] = useState(true);
  const [refreshPaging, setRefreshPaging] = useState({meta:0});
  const refresh = () => setRefreshPaging({meta: refreshPaging.meta+1})
  const [list, setList] = useState([]);  
  const [paging, setPaging] = useState({meta:0});
  const newLimit = () => setPaging({meta: paging.meta+1})
  useEffect(() => {
    if (paging.meta < 1) return
    getList(false)
    console.log("transfers paging--------------",paging)
  }, [paging]); 

  useEffect(() => {
    if (refreshPaging.meta < 1) return
    getList(true)
    console.log("transfers refreshPaging--------------",refreshPaging)
  }, [refreshPaging]); 

  
  async function getList(ascend, kind) {
    const email = session?.user?.email
    const time = ascend ? (list[0]?.createdat ?? new Date(+0)) : (list[list.length-1]?.createdat ?? new Date())
    const url = "/api/messages/?limit=20&time="+time + (ascend?'':'&older=true') + (kind ? "&kind=" + kind : '')
    
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },    
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        console.log("messages getList--------------",url, result)
        if (result.length < 1) {
          if (!ascend) setMore(false)
          return
        }
        let newList = []
        if (ascend) {
          newList = uniqueByKey([...result, ...list], 'id')
        } else {
          
          newList = uniqueByKey([...list, ...result], 'id')          
        }
        oldestTransfer.meta = newList[result.length-1]
        lastTransfer.meta = newList[0]
        setList(newList)
        
        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }

  async function refreshList() {
    list.length = 0
    newLimit()
  }

  function setupPolling(interval) {
    const pollingThread = setInterval(() => {  
        refresh()
        console.log("messages polling--------------")        
    }, interval)
    return pollingThread       
  }

  useEffect(() => {
    if (!listRef?.current) return;
    const observer = new IntersectionObserver(([entry]) => {
        
      if (entry.isIntersecting) {
        console.log("messages isIntersecting-- ", count.meta?.curmountid)
        newLimit()
        observer.disconnect();
      }
    },
    {
        threshold: 1,
    }
    );
    observer.observe(listRef.current);

    const pollingThread = setupPolling(5000);
    return () => {          
      observer.disconnect();
      clearInterval(pollingThread);
      };
    
  }, [])


  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return list
    
    const patterns = filterPattern.split(' ')
    let filtered = list
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.message?.email?.includes(pattern) || item.message?.subject?.includes(pattern) || item.message?.message?.includes(pattern) || item.message?.specs?.includes(pattern) || item.message?.updatedat?.includes(pattern))
    }
    
    return filtered
  }

  function clearFilterPattern() {
    if (!filterPatternRef.current) return
    setFilterPattern(undefined)
    filterPatternRef.current.value = ''
  }

  
  return (
    <div className="w-full bg-white  ">
  
<div ref={listRef} className="relative pb-4 bg-white ">
<MessagesMenu page="receivedMessages" message={msgDrawer.meta.replyDrawer?.message}/>
</div>

<FilterBar setFilterPattern={setFilterPattern}/>

  <div className="w-full grid md:grid-cols-9 justify-start gap-3 border-b">
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      ID
    </p>
  </div>
  
  <div className="flex flex-row justify-start gap-4 leading-normal">
    <h5 className="font-semibold tracking-tight text-gray-900 ">
      From
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
      Message
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      Sources
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      Expires at
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      Error
    </p>
  </div>
  <div className="flex flex-col justify-start leading-normal">
    <p className="font-normal text-gray-700">
      Last Updated At
    </p>
  </div>
  
</div>

{
  filter()?.map((rec, i) => {    
    return (
      <ReceiveMessageListCard key={i} currentPath={currentPath} setCurrentPath={setCurrentPath} transfer={rec} i={i} provisionInviteMessage={provisionInviteMessage} setDetailReceiveMessage={setDetailReceiveMessage}/>
    )
  })
}

<div>
  {list.length} entries
</div>


<NextPage more={more} newLimit={newLimit} monitors={[]}/>




</div>



        
  
  );
  }

