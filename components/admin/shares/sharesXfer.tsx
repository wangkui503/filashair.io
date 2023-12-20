'use client';
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import { tabSwitch } from "@/lib/tab";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import SharesNav from "./sharesNav";
import { getResourcesWith, rmShare } from "@/lib/getXferAccount";
import NextPage from "../nextPage";
import { deleteShared } from "@/lib/shared";
import FilterBar from "@/components/filterbar";

export default function SharesXfer({xferShareslist, setXferSharesList, sharedsToMe, setSharedsToMe, shareds, setShareds, currentSharedMeta, setCurrentSharedMeta}) {    
  const listRef = useRef<HTMLDivElement | null>(null);
  
  const { data: session, status } = useSession()
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useCounter();

  const [currentMount, setcurrentMount] = useState({meta:null});

  const curmount = count.meta?.[count.meta?.curmountid]   
  const mount = curmount?.mount
  const token = curmount?.token 
  
  const [moreMeta, setMoreMeta] = useState({meta:true});  
  const [paging, setPaging] = useState({meta:0});
  const newLimit = () => setPaging({meta: paging.meta+1})
  useEffect(() => {
    if (paging.meta < 1) return
    getList(false, false)
  }, [paging]); 

  
  async function getList(cache, ascend) {
    if (!mount || !token) return
    getResourcesWith(cache, false, 'shares', 5, mount, token, ascend, setXferSharesList, count, setCount, null, null, null, moreMeta, (slot) => {
      count.meta[mount.id].shares = slot.all
      setCount({
        meta: count.meta
      })
    })
    currentMount.meta = curmount  
  }

  useEffect(() => {
    if (!listRef?.current) return;
    if (!curmount?.token) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
        
      if (entry.isIntersecting) {
        console.log("xfer shares isIntersecting-- ", entry)
        getList(true, false)
        observer.disconnect();
      }
    },
    {
        threshold: 1,
    }
    );
    observer.observe(listRef.current);

    
    return () => {          
      observer.disconnect();
    
      };
    
  }, [curmount?.token])


  async function refreshList() {
    delete mount['shares']
    newLimit()
  }


  

  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return xferShareslist
    
    const patterns = filterPattern.split(' ')
    let filtered = xferShareslist
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.id?.includes(pattern) || item.path?.includes(pattern) || item.last_updated_at?.includes(pattern))
    }
    
    return filtered
  }

  async function getShared(mount_id, share) {
    currentSharedMeta.meta = {}
    setCurrentSharedMeta({meta:currentSharedMeta.meta})
    fetch('/api/shareds?action=search&mount_id='+mount_id + "&share=" + share.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",        
      },    
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json();
        if (result?.length > 0) {
          if (!confirm("It is shared to people, force delete " + result[0].id + " ?")) return
          deleteShared(result[0].id, ()=>{
            deleteShare(share)
            setShareds(shareds.filter(shared => shared.id != result[0].id))
            setSharedsToMe(sharedsToMe.filter(item => item.share?.id != result[0].id))

            count.meta.sharedToMe = count.meta.sharedToMe.filter(k => k.share?.id != result[0].id)
            setCount({
              meta: count.meta
            })
          })
        } else {
          deleteShare(share)
        }
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }

  
  async function deleteShare(share) {
    rmShare(share, mount, token, curmount?.curmountid, () => {
      if (curmount.curshareid == share.id) {
        delete curmount.curshareid
      }

      curmount.shares = curmount.shares.filter(k => k.id != share.id)
      setCount({
        meta: count.meta
      })        

      setXferSharesList(xferShareslist.filter(k => k.id != share.id))
      
      console.log("deleted share--------------",share)        
      toast.success('share deleted')
    })    
  }

  
  if (session?.user) {  
  return (
<>

<div ref={listRef} className="pb-4 bg-white ">
  <SharesNav page="shareMenuRef" currentShared={currentSharedMeta.meta.currentShared}/>    
  </div>

  <FilterBar setFilterPattern={setFilterPattern}/>








  <div className="w-full">

<div className="w-full grid md:grid-cols-6 justify-start border-b">

<div className="flex flex-row justify-start gap-4 p-3 leading-normal">
    <h5 className="whitespace-nowrap overflow-x-auto scrollbar-hide font-semibold tracking-tight text-gray-900 ">
      ID    
    </h5>    
    <div>
      <button
      onClick={()=>refreshList()}
      >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0789 2.25C7.2854 2.25 3.34478 5.913 2.96055 10.5833H2.00002C1.69614 10.5833 1.42229 10.7667 1.30655 11.0477C1.19081 11.3287 1.25606 11.6517 1.47178 11.8657L3.15159 13.5324C3.444 13.8225 3.91567 13.8225 4.20808 13.5324L5.88789 11.8657C6.10361 11.6517 6.16886 11.3287 6.05312 11.0477C5.93738 10.7667 5.66353 10.5833 5.35965 10.5833H4.4668C4.84652 6.75167 8.10479 3.75 12.0789 3.75C14.8484 3.75 17.2727 5.20845 18.6156 7.39279C18.8325 7.74565 19.2944 7.85585 19.6473 7.63892C20.0002 7.42199 20.1104 6.96007 19.8934 6.60721C18.2871 3.99427 15.3873 2.25 12.0789 2.25Z" fill="#1C274C"></path> <path d="M20.8411 10.4666C20.549 10.1778 20.0789 10.1778 19.7867 10.4666L18.1005 12.1333C17.8841 12.3471 17.8184 12.6703 17.9339 12.9517C18.0495 13.233 18.3235 13.4167 18.6277 13.4167H19.5268C19.1455 17.2462 15.8759 20.25 11.8828 20.25C9.10026 20.25 6.66586 18.7903 5.31796 16.6061C5.10042 16.2536 4.63833 16.1442 4.28583 16.3618C3.93334 16.5793 3.82393 17.0414 4.04146 17.3939C5.65407 20.007 8.56406 21.75 11.8828 21.75C16.6906 21.75 20.6475 18.0892 21.0331 13.4167H22.0002C22.3043 13.4167 22.5783 13.233 22.6939 12.9517C22.8095 12.6703 22.7437 12.3471 22.5274 12.1333L20.8411 10.4666Z" fill="#1C274C"></path> </g></svg>
      </button>
    </div> 
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
      Storage
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
      Path
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
      Last updated by 
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
      Last updated at
    </p>
  </div>
  
</div>


{  currentMount.meta != curmount ? 'loading...' : 
  filter()?.map((share, i) => {
  //curmount?.shares?.filter(v=>!(currentSharedMeta.meta.sharedByMe?.some(e=>(e.mount_id == curmount.mount.id && e.share === v.id)))).map((share) => {
    const shared = {
      email: session.user?.email,
      mount_id: curmount.mount.id,
      share: share.id,
    }
    return (
      <div key={i} className="w-full grid md:grid-cols-6 justify-start border-b md:hover:shadow-xl md:hover:bg-slate-200">

      <div className="flex flex-row justify-start p-3 leading-normal overflow-x-auto">
              <div 
              
              className="whitespace-nowrap overflow-x-auto scrollbar-hide font-semibold tracking-tight text-gray-900 ">
              
              {share.id}
          </div>        
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {share.storage}
          </p>
        </div>
        
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {share.path}
          </p>
        </div>

        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {share.last_updated_by}
          </p>
        </div>
        
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {share.last_updated_at}
          </p>
        </div>
        
        <div className="flex flex-row gap-4 justify-start p-3 leading-normal">
          <button           
          
          onClick={()=>{currentSharedMeta.meta.currentShared=shared;setCurrentSharedMeta({meta:currentSharedMeta.meta});tabSwitch('shareNetworkRef', 'auto')}}
          className="font-normal text-gray-700">
          
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z" fill="#137ED9"></path> </g></svg>
          </button>
          <button           
          onClick={()=>getShared(count.meta?.curmountid, share)}
          className="font-normal text-gray-700">
          <svg className="w-5 h-5" fill="#137ED9" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-e</title><path d="M296,64H216a7.91,7.91,0,0,0-8,8V96h96V72A7.91,7.91,0,0,0,296,64Z"></path><path d="M432,96H336V72a40,40,0,0,0-40-40H216a40,40,0,0,0-40,40V96H80a16,16,0,0,0,0,32H97L116,432.92c1.42,26.85,22,47.08,48,47.08H348c26.13,0,46.3-19.78,48-47L415,128h17a16,16,0,0,0,0-32ZM192.57,416H192a16,16,0,0,1-16-15.43l-8-224a16,16,0,1,1,32-1.14l8,224A16,16,0,0,1,192.57,416ZM272,400a16,16,0,0,1-32,0V176a16,16,0,0,1,32,0ZM304,96H208V72a7.91,7.91,0,0,1,8-8h80a7.91,7.91,0,0,1,8,8Zm32,304.57A16,16,0,0,1,320,416h-.58A16,16,0,0,1,304,399.43l8-224a16,16,0,1,1,32,1.14Z"></path></g></svg>
          </button>
        </div>

        
      </div>    
    )
  })
}

{
  currentMount.meta != curmount ? '' : (
<div>
  {xferShareslist.length} entries
</div>

  )
}

<NextPage more={moreMeta.meta} newLimit={newLimit} monitors={[count.meta?.curmountid]}/>


</div>
        
          
          </>                    
  
  );
  }
}
