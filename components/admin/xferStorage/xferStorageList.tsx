'use client';
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import { tabSwitch } from "@/lib/tab";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import XferStorageNav from "./xferStorageNav";
import { getResourcesWith } from "@/lib/getXferAccount";
import NextPage from "../nextPage";
import StorageCard from "./storageCard";
import { rmStorage } from "@/lib/getXferAccount";

export default function XferStorageList({list, setList, title, showOff, funcs, back}) {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const filterPatternRef = useRef<HTMLInputElement | null>(null);  
  const [count, setCount] = useCounter();
  const { data: session, status } = useSession()
  const [loaded, setLoaded] = useState(false);
  const [shareds, setShareds] = useState([]);

  const [domains, setDomains] = useState([]);
  

  const [currentMount, setcurrentMount] = useState({meta:null});

  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token

  const [moreMeta, setMoreMeta] = useState({meta:true});  
  const [paging, setPaging] = useState({meta:0});
  const newLimit = () => setPaging({meta: paging.meta+1})
  useEffect(() => {
    if (paging.meta < 1) return
    getList(false, false)
  }, [paging]); 



  async function deleteStorage(storage) {
    rmStorage(storage, mount, token, curmount?.curdomainid, () => {
      setList([...list.filter(item => item.id != storage.id)])
        console.log("storage delete--------------",storage)        
    })    
  }
  
  async function refreshList(ascend) {
    if (!mount || !token) return
    getResourcesWith(false, true, 'storages', 5, mount, token, ascend, setList, count, setCount, null, null, curmount.curdomainid, moreMeta)
    currentMount.meta = curmount
  }


  async function getList(cache, ascend) {
    if (!mount || !token || mount.self?.role == 'regular') return
    getResourcesWith(cache, false, 'storages', 5, mount, token, ascend, setList, count, setCount, null, null, curmount.curdomainid, moreMeta)
    currentMount.meta = curmount  
  }

  function setupPolling(interval) {
    const pollingThread = setInterval(() => {  
        if (!mount?.storages) return
        getList(false, true)
        
        console.log("storages polling--------------",mount?.storages?.filashnexttoken)        
    }, interval)
    return pollingThread       
  }


  useEffect(() => {
    if (!listRef?.current) return;
    if (!curmount?.token || !curmount?.self || curmount?.self?.role === 'regular') {
      return
    }
    
    const observer = new IntersectionObserver(([entry]) => {
        
      if (entry.isIntersecting) {
        console.log("Storage isIntersecting-- ", entry)
        getList(true, false)
        observer.disconnect();
      }
    },
    {
        threshold: 1,
    }
    );
    
    const pollingThread = setupPolling(30000);
    observer.observe(listRef.current);
    return () => {
      clearInterval(pollingThread);
          observer.disconnect();          
      };
    
  }, [curmount?.token, curmount?.curdomainid])

  
  useEffect(() => {
    setDomains(curmount?.domains)
  }, [curmount?.domains])


  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return list
    
    const patterns = filterPattern.split(' ')
    let filtered = list
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.type === pattern || item.id?.includes(pattern) || item.store.path?.includes(pattern) || item.last_updated_at?.includes(pattern))
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

<div ref={listRef} className="pb-4 bg-white ">
  <XferStorageNav page="xferStorageListRef" title={title} back={back}/>    
  </div>

  

{ curmount?.self?.role === 'super' ? (
  <>
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
  </>
) : ''
}

  <div className="w-full flex flex-col md:flex-row ">
    <form onSubmit={(e) => {
          e.preventDefault();
          if (e.currentTarget.searchPattern.value == '') {
            clearFilterPattern()
            return
          }
          setFilterPattern(e.currentTarget.searchPattern.value)
    }}
    className="w-full pb-2 bg-white ">
      <div className="relative py-2 z-0 w-full mb-4 group border-b border-neutral-300">
          <input
            className="block pr-16 py-1 w-full bg-transparent appearance-none peer"
            placeholder=" "
            id="searchPattern"
            name="searchPattern"
            type="text"        
            ref={filterPatternRef}
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Filter
          </label>
          <button 
          type="submit"
          className="block w-7 h-7 text-center text-xl leading-0 absolute top-4 right-8 text-gray-400 md:hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke="#1C274C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>

          <button 
          type="reset"
          onClick={()=>clearFilterPattern()}
          className="block w-5 h-5 text-center text-xl leading-0 absolute top-5 right-2 text-gray-400 md:hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 15L21 21M21 15L15 21M10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L17 11" stroke="#1C274C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>
        </div>          
    </form>
  </div>








  <div className="w-full">

<div className="w-full grid md:grid-cols-8 justify-start border-b">

<div className="flex flex-row justify-start gap-4 p-3 leading-normal">
    <h5 className="font-semibold tracking-tight text-gray-900 ">
      ID    
    </h5>   
    <div>
      <button
      onClick={()=>refreshList(false)}
      >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0789 2.25C7.2854 2.25 3.34478 5.913 2.96055 10.5833H2.00002C1.69614 10.5833 1.42229 10.7667 1.30655 11.0477C1.19081 11.3287 1.25606 11.6517 1.47178 11.8657L3.15159 13.5324C3.444 13.8225 3.91567 13.8225 4.20808 13.5324L5.88789 11.8657C6.10361 11.6517 6.16886 11.3287 6.05312 11.0477C5.93738 10.7667 5.66353 10.5833 5.35965 10.5833H4.4668C4.84652 6.75167 8.10479 3.75 12.0789 3.75C14.8484 3.75 17.2727 5.20845 18.6156 7.39279C18.8325 7.74565 19.2944 7.85585 19.6473 7.63892C20.0002 7.42199 20.1104 6.96007 19.8934 6.60721C18.2871 3.99427 15.3873 2.25 12.0789 2.25Z" fill="#1C274C"></path> <path d="M20.8411 10.4666C20.549 10.1778 20.0789 10.1778 19.7867 10.4666L18.1005 12.1333C17.8841 12.3471 17.8184 12.6703 17.9339 12.9517C18.0495 13.233 18.3235 13.4167 18.6277 13.4167H19.5268C19.1455 17.2462 15.8759 20.25 11.8828 20.25C9.10026 20.25 6.66586 18.7903 5.31796 16.6061C5.10042 16.2536 4.63833 16.1442 4.28583 16.3618C3.93334 16.5793 3.82393 17.0414 4.04146 17.3939C5.65407 20.007 8.56406 21.75 11.8828 21.75C16.6906 21.75 20.6475 18.0892 21.0331 13.4167H22.0002C22.3043 13.4167 22.5783 13.233 22.6939 12.9517C22.8095 12.6703 22.7437 12.3471 22.5274 12.1333L20.8411 10.4666Z" fill="#1C274C"></path> </g></svg>
      </button>
    </div> 
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Type
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Path
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Store
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
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
      Last updated at
    </p>
  </div>
</div>


{  currentMount.meta != curmount ? 'loading...' : 
  filter()?.map((storage, i) => (
    <StorageCard 
    key={i} 
    i={i}
    storage={storage}
    title={title}
    showOff={showOff}
    funcs={funcs}
    delFunc={deleteStorage}
    />
  ))
}

{
  currentMount.meta != curmount ? '' : (
<div>
  {list.length} entries
</div>

  )
}

  
  <NextPage more={moreMeta.meta} newLimit={newLimit} monitors={[count.meta?.curmountid]}/>


</div>
        
          
          </>                    
  
  );
  }
}
