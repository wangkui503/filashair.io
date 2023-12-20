'use client';
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import { tabSwitch } from "@/lib/tab";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import XferAccountNav from "./xferAccountNav";
import { getResourcesWith } from "@/lib/getXferAccount";
import NextPage from "../nextPage";
import FilterBar from "@/components/filterbar";

export default function XferAccountUnpluggedList({list, setList, setCurrentUser}) {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const filterPatternRef = useRef<HTMLInputElement | null>(null);  
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useCounter();
  const { data: session, status } = useSession()
  const [loaded, setLoaded] = useState(false);
  const [shareds, setShareds] = useState([]);

  const [domains, setDomains] = useState([]);
  
  const [currentMount, setcurrentMount] = useState({meta:null});

  const curmount = count.meta[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
  const mount = curmount?.mount
  const token = curmount?.token

  const resourceKind = 'users'
  
  const [moreMeta, setMoreMeta] = useState({meta:true});  
  const [paging, setPaging] = useState({meta:0});
  const newLimit = () => setPaging({meta: paging.meta+1})
  useEffect(() => {
    if (paging.meta < 1) return
    getList(false, false)
    console.log("xfer account paging--------------",count.meta?.curmountid)        
  }, [paging]); 

  
  async function getList(cache, ascend) {    
    if (!mount || !token) return
    getResourcesWith(cache, false, resourceKind, 5, mount, token, ascend, setList, count, setCount, null, null, curmount?.curdomainid, moreMeta)
    currentMount.meta = curmount  
  }

  async function refreshList() {
    if (!mount || !token) return
    getResourcesWith(false, true, resourceKind, 5, mount, token, false, setList, count, setCount, null, null, curmount?.curdomainid, moreMeta)
    currentMount.meta = curmount  
  }

  function setupPolling(interval) {
    const pollingThread = setInterval(() => {  
      if (!mount?.[resourceKind]) return
        getList(false, true)
        console.log("xfer account polling--------------",mount?.[resourceKind]?.filashnexttoken)        
    }, interval)
    return pollingThread       
  }

  useEffect(() => {
    if (!listRef?.current) return;
    if (!curmount?.token) {
      return
    }
    
    
    const observer = new IntersectionObserver(([entry]) => {
        
      if (entry.isIntersecting) {
        console.log("xfer account isIntersecting-- ", count.meta?.curmountid)
        getList(true, false)
        observer.disconnect();
      }
    },
    {
        threshold: 1,
    }
    );
    observer.observe(listRef.current);

    //const pollingThread = setupPolling(5000);
    return () => {          
      observer.disconnect();
      //    clearInterval(pollingThread);
      };
    
  }, [curmount?.token, curmount?.curdomainid])

  useEffect(() => {
    setDomains(curmount?.domains)
  }, [curmount?.domains])

  
  async function deleteUser(user) {
    if (!confirm("Delete " + user.id + " ?")) return
    fetch(mount.host + '/users/' + user.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,  
        'last_updated_at': user.last_updated_at
      },    
    }).then(async (res) => {
      if (res.status === 200) {
        console.log("mount.users?.list---", user.id, mount.users?.list, mount.users?.list?.filter(k => k.id != user.id))
        setList(list?.filter(k => k.id != user.id))
        
        console.log("delete user--------------",user)        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }

  
  

  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return list
    
    const patterns = filterPattern.split(' ')
    let filtered = list
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.role === pattern || item.id?.includes(pattern) || item.created_by?.includes(pattern) || item.created_at?.includes(pattern))
    }
    
    return filtered
  }

  function clearFilterPattern() {
    if (!filterPatternRef.current) return
    setFilterPattern(undefined)
    filterPatternRef.current.value = ''
  }


  function onClickSetCurrentDomain(domain) {
    curmount.curdomainid = domain.id
    setCount({
      meta: count.meta
    })    
  }


  if (session?.user) {  
  return (
<>

<div ref={listRef} className="relative pb-4 bg-white ">
  <XferAccountNav page="xferAccountUnpluggedListRef"/>      
  </div>

  <span className="py-2 text-sm text-slate-500">
    Domains
  </span>

  <div id="domainstab" className="w-full py-2 flex flex-row gap-4 md:flex-row ">
  {
    domains?.map((domain, i) => {
      return (
        <button
        key={i}
        onClick={() => onClickSetCurrentDomain(domain)}
        className={`${curmount.curdomainid==domain.id ? 'py-2 text-blue-600 border-b-2 border-blue-600 active' : 'border-b border-blue-200'}`}
        >
          {domain.id}
        </button>
      )
    })
  }
  </div>
  

  <FilterBar setFilterPattern={setFilterPattern}/>







  <div className="w-full">

<div className="w-full grid md:grid-cols-6 justify-start border-b">

<div className="flex flex-row justify-start gap-4 p-3 leading-normal">  
    <h5 className="font-semibold tracking-tight text-gray-900 ">
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
    <p className="font-normal text-gray-700">
      Role
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Domain
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Created by
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Created at
    </p>
  </div>
  
</div>


{  currentMount.meta != curmount ? 'loading...' : 
  filter()?.map((user, i) => {
    return (
      <div key={i} className="w-full grid md:grid-cols-6 justify-start border-b md:hover:shadow-xl md:hover:bg-slate-200">

      <div className="flex flex-row justify-start p-3 leading-normal overflow-x-auto">
              <div 
              
              className="font-semibold tracking-tight text-gray-900 ">
              
              {user.id}
          </div>        
        </div>
        <div className="truncate flex flex-col justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {user.role}
          </p>
        </div>
        <div className="truncate flex flex-col justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {user.domain}
          </p>
        </div>
        <div className="truncate flex flex-col justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {user.created_by}
          </p>
        </div>
        <div className="truncate flex flex-col justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {user.created_at}
          </p>
        </div>

        <div className="flex flex-row gap-6 justify-start p-3 leading-normal">
          <button           
          onClick={()=>{setCurrentUser(user); tabSwitch('xferAccountPlugRef', 'auto')}}
          className="font-normal text-gray-700">
          <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#137ED9"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="horoscope"> <g> <path d="M25.6,25.6,22.2,29,19,25.8l3.4-3.4a2,2,0,0,0-2.8-2.8L16.2,23l-1.3-1.3a1.9,1.9,0,0,0-2.8,0l-3,3a9.8,9.8,0,0,0-3,7,9.1,9.1,0,0,0,1.8,5.6L4.6,40.6a1.9,1.9,0,0,0,0,2.8,1.9,1.9,0,0,0,2.8,0l3.2-3.2a10.1,10.1,0,0,0,5.9,1.9,10.2,10.2,0,0,0,7.1-2.9l3-3a2,2,0,0,0,.6-1.4,1.7,1.7,0,0,0-.6-1.4L25,31.8l3.4-3.4a2,2,0,0,0-2.8-2.8Z"></path> <path d="M43.4,4.6a1.9,1.9,0,0,0-2.8,0L37.2,8a10,10,0,0,0-13,.9l-3,3a2,2,0,0,0-.6,1.4,1.7,1.7,0,0,0,.6,1.4L32.9,26.4a1.9,1.9,0,0,0,2.8,0l3-2.9a9.9,9.9,0,0,0,2.9-7.1A10.4,10.4,0,0,0,40,10.9l3.4-3.5A1.9,1.9,0,0,0,43.4,4.6Z"></path> </g> </g> </g> </g></svg>
          </button>
          <button           
          onClick={()=>deleteUser(user)}
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
  {list?.length} entries
</div>

  )
}


<NextPage more={moreMeta.meta} newLimit={newLimit} monitors={[count.meta?.curmountid]}/>



</div>
        
          
          </>                    
  
  );
  }
}
