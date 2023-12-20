'use client';
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import { tabSwitch } from "@/lib/tab";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import XferKeyNav from "./xferKeyNav";
import { useOnScreen } from "@/lib/isVisible";
import NextPage from "../nextPage";
import { getResourcesWith } from "@/lib/getXferAccount";

export default function XferKeyList() {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const filterPatternRef = useRef<HTMLInputElement | null>(null);  
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [count, setCount] = useCounter();
  const { data: session, status } = useSession()
  const [loaded, setLoaded] = useState(false);
  const [shareds, setShareds] = useState([]);

  const [currentMount, setcurrentMount] = useState({meta:null});

  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token

  const resourceKind = 'keys'
  const [moreMeta, setMoreMeta] = useState({meta:true});  
  const [list, setList] = useState([]);  
  const [paging, setPaging] = useState({meta:0});
  const newLimit = () => setPaging({meta: paging.meta+1})
  useEffect(() => {
    if (paging.meta < 1) return
    getList(false, false)
  }, [paging]); 

  
  async function getList(cache, ascend) {
    if (!mount || !token) return
    getResourcesWith(cache, false, resourceKind, 5, mount, token, ascend, setList, count, setCount, null, null, null, moreMeta)
    currentMount.meta = curmount  
  }

  function setupPolling(interval) {
    const pollingThread = setInterval(() => {  
      if (!mount?.[resourceKind]) return
      getList(false, true)
        
      console.log("keys polling--------------",mount?.[resourceKind]?.filashnexttoken)        
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
        console.log("events isIntersecting-- ", entry)
        getList(true, false)
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
    
    }, [curmount?.token])
  
  
  async function deleteKey(key) {
    if (!confirm("Delete " + key.id + " ?")) return
    fetch(mount.host + '/keys/' + key.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,  
        'last_updated_at': key.last_updated_at
      },    
    }).then(async (res) => {
      if (res.status === 200) {        
        console.log("delete key--------------",key)        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }


  function search(keyword) {
    
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      email: { value: string };      
    };
    search(emailsRef.current.value)
  }


  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return list
    
    const patterns = filterPattern.split(' ')
    let filtered = list
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.id?.includes(pattern) || item.user_id?.includes(pattern) || item.key?.includes(pattern) || item.last_updated_by?.includes(pattern) || item.last_updated_at?.includes(pattern))
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

<div ref={listRef} className="pb-4 bg-white ">
  <XferKeyNav page="sharedToMeRef"/>    
  </div>

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

<div className="flex flex-col justify-between p-3 leading-normal">

  
    <h5 className="font-semibold tracking-tight text-gray-900 ">
      ID    
    </h5>    
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      User ID
    </p>
  </div>
  <div className="flex flex-col md:col-span-3 justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Key
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
    Last Updated By
    </p>
  </div>
  <div className="flex flex-col md:col-span-3 justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
    Last Updated At
    </p>
  </div>
  
</div>


{  currentMount.meta != curmount ? 'loading...' : 
  filter()?.map((key, i) => {
    return (
      <div key={i} className="w-full grid md:grid-cols-8 justify-start border-b md:hover:shadow-xl md:hover:bg-slate-200">

      <div className="flex flex-row justify-start p-3 leading-normal overflow-x-auto">
          <div className="whitespace-nowrap overflow-x-auto scrollbar-hide font-semibold tracking-tight text-gray-900 ">              
              {key.id}
          </div>        
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {key.user_id}
          </p>
        </div>
        <div className="flex flex-col md:col-span-3 justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {key.key}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {key.last_updated_by}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {key.last_updated_at}
          </p>
        </div>
        
        <div className="flex flex-col justify-start p-3 leading-normal">
          <button           
          onClick={()=>deleteKey(key)}
          className="font-normal text-gray-700">
          Remove
          </button>
        </div>
        
        
      </div>    
    )
  })
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
