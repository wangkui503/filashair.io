'use client';
var pathlib = require('path');
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"
import React, { useEffect, useState, useRef, FormEvent } from 'react'
import { useCounter } from "@/components/context/context";
import CreateTransfer from "./createTransfer";
import FilesPage from "../files/page";
import TransferDetail from "./transferDetail";
import { uniqueByKey } from "@/lib/unique";
import TransferList from "./transferList";
import { checkSourceDuplicate, checkDestDuplicate, checkSourceFriends, checkDestFriends } from "@/lib/duplicate";

export default function Transfers() {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useCounter();
  const [checked, setChecked] = useState('tab1');
  const { data: session, status } = useSession()
  const [xferDrawer, setXferDrawer] = useState({meta:{}});

  
  const [runningTransfers, setRunningTransfers] = useState([]);
  const [completedtransfers, setCompletedTransfers] = useState([]);

  const [detailTransfer, setDetailTransfer] = useState();

  const curmount = count.meta?.[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]


  const [lastTransfer, setLastTransfer] = useState({meta:null});
  const [oldestTransfer, setOldestTransfer] = useState({meta:null});
  const [more, setMore] = useState(true);
  const [list, setList] = useState([]);  
  const [refreshPaging, setRefreshPaging] = useState({meta:0});
  const refresh = () => setRefreshPaging({meta: refreshPaging.meta+1})
  const [paging, setPaging] = useState({meta:0});
  const newLimit = () => setPaging({meta: paging.meta+1})
  useEffect(() => {
    if (paging.meta < 1) return
    getList(false)
    console.log("transfers paging--------------",paging)
  }, [paging]); 

  useEffect(() => {
    if (paging.meta < 1) return
    getList(true)
    console.log("transfers refreshPaging--------------",paging)
  }, [refreshPaging]); 

  
  async function getList(ascend) {
    const email = session?.user?.email
    const time = ascend ? (list[0]?.createdat ?? new Date(+0)) : (list[list.length-1]?.createdat ?? new Date())
    const url = "/api/transfers/" + email + "?limit=20&time="+time + (ascend?'':'&older=true')
    
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },    
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        console.log("transfers getList--------------",url, result)
        if (result.length < 1) {
          if (!ascend) setMore(false)
          return
        } else {
          if (!ascend) setMore(true)
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
    getList(true)
  }


  function setupPolling(interval) {
    const pollingThread = setInterval(() => {  
        refresh()
        console.log("transfers polling--------------")        
    }, interval)
    return pollingThread       
  }

  useEffect(() => {
    if (!listRef?.current) return;
    const observer = new IntersectionObserver(([entry]) => {
        
      if (entry.isIntersecting) {
        console.log("transfers isIntersecting-- ", count.meta?.curmountid)
        getList(true)
        observer.disconnect();
      }
    },
    {
        threshold: 1,
    }
    );
    observer.observe(listRef.current);

    const pollingThread = setupPolling(10000);
    return () => {          
      observer.disconnect();
      clearInterval(pollingThread);
      };
    
  }, [])



  function addSource(session, curmount, parentPath, file) {
    const key = curmount?.mount?.id+curshare?.id
    const path = pathlib.normalize(parentPath + file.name + '/');
 
    xferDrawer.meta.messageDrawer = xferDrawer.meta.messageDrawer?? {}
    xferDrawer.meta.messageDrawer.dests = xferDrawer.meta.messageDrawer?.dests?? []
    xferDrawer.meta.messageDrawer.sources = xferDrawer.meta.messageDrawer?.sources?? []

    const sources = xferDrawer.meta.messageDrawer.sources 
    
    const dests = xferDrawer.meta.messageDrawer.dests
    
    if (checkSourceDuplicate(sources,key,path)) {
      toast.error("already in source");
      return
    }
    
    if (checkDestDuplicate(dests,key+path)) {
      toast.error("already in dest");
      return
    }

    
    
    const source = sources.filter((source)=>source.key == key)[0]?? {}
    source.paths = source.paths?? []
    source.paths.push({file: file, path:path})
    if (!sources.filter((source)=>source.key == key)[0]) {
      source.key = key
      source.mount_id =  curmount?.mount?.id
      source.mount_alias = curmount?.mount?.alias
      source.host = curmount?.mount?.host
      source.xfer_addr = curmount?.mount?.xfer_addr
      source.username = curmount?.mount?.username
      source.share = curshare?.id
      source.share_kind = curshare.share_kind
      source.share_alias = curshare?.alias
      sources.push(source)
    }

    setXferDrawer({
      meta: xferDrawer.meta
    }) 
    toast.success(file.name+ ' is added as source')
  }

  
  function addDest(session, curmount, parentPath, file) {
    const path = pathlib.normalize(parentPath + file.name + '/');
    const key = curmount?.mount?.id + curshare?.id
    
    xferDrawer.meta.messageDrawer = xferDrawer.meta.messageDrawer?? {}
    xferDrawer.meta.messageDrawer.dests = xferDrawer.meta.messageDrawer?.dests?? []
    xferDrawer.meta.messageDrawer.sources = xferDrawer.meta.messageDrawer?.sources?? []

    const sources = xferDrawer.meta.messageDrawer.sources 
    
    const dests = xferDrawer.meta.messageDrawer.dests
    
    
    if (checkSourceDuplicate(sources,key,path)) {
      toast.error("already in source");
      return
    }

    if (checkDestDuplicate(dests,key+path)) {
      toast.error("already in dest");
      return
    }

    

    dests.push({
      key: key + path,
      mount_id: curmount?.mount?.id,
      mount_alias: curmount?.mount?.alias,
      host: curmount?.mount?.host,
      xfer_addr: curmount?.mount?.xfer_addr,
      username: curmount?.mount?.username,
      share: curshare?.id,
      share_kind: curshare.share_kind,
      share_alias: curshare?.alias,
      path: path,
      file: file
    })

    setXferDrawer({
      meta: xferDrawer.meta
    })
    toast.success(file.name+ ' is added as dest')
  }


  const [currentPath, setCurrentPath] = useState({meta:'/'});  
  
  return (
    <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
    <p ref={listRef}></p>
  <div id="transferListRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <TransferList refreshList={refreshList} list={list} more={more} newLimit={newLimit} setDetailTransfer={setDetailTransfer}/>
  </div>

  <div id="createTransferRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <CreateTransfer addNewTransfer={(transfer)=>setList([transfer, ...list])} runningTransfers={runningTransfers} setRunningTransfers={setRunningTransfers} xferDrawer={xferDrawer} setXferDrawer={setXferDrawer} back={'transferListRef'}/>
    </div>

  <div id="createTransferFilesRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <FilesPage currentPath={currentPath} setCurrentPath={setCurrentPath} title="Transfer" showOff={true} funcs={[{name: 'Source', action: addSource}, {name: 'Dest', action: addDest}]} back={'createTransferRef'}/>
  </div>

  <div id="detailTransferRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <TransferDetail detailTransfer={detailTransfer} back={'transferListRef'}/>
  </div>


</div>
        
        
  
  );
  }

