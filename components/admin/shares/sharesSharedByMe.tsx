'use client';
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import { tabSwitch } from "@/lib/tab";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import SharesNav from "./sharesNav";
import { deleteShared } from "@/lib/shared";
import FilterBar from "@/components/filterbar";
import NextPage from "../nextPage";
import { uniqueByKey } from "@/lib/unique";

export default function SharesSharedByMe({sharedsToMe, setSharedsToMe, shareds, setShareds, currentSharedMeta, setCurrentSharedMeta}) {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useCounter();
  const curmount = count.meta?.[count.meta?.curmountid]    
  const { data: session, status } = useSession()
  const [loaded, setLoaded] = useState(false);  

  const [paging, setPaging] = useState({meta:0});
  const [more, setMore] = useState(true);
  const newLimit = () => setPaging({meta: paging.meta+1})
  useEffect(() => {
    if (paging.meta < 1) return
    getShareds()
  }, [paging]); 


  async function getShareds() {
    fetch("/api/shareds?kind=by&take=50&skip="+shareds?.length??0, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },    
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        if (result.length < 1) {
          setMore(false)
          return
        } else {
          setMore(true)
        }
        const newShareds = uniqueByKey([...shareds, ...result], 'id')

        setShareds(newShareds)
        currentSharedMeta.meta.sharedByMe = newShareds
        setCurrentSharedMeta({meta: currentSharedMeta.meta})
        
        console.log("shareds load init--------------",newShareds)        
        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }

  useEffect(() => {
    if (!listRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
        
      if (entry.isIntersecting) {
        console.log("shared by me isIntersecting-- ", entry)
        getShareds()
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
    }        
  },[]);

  async function refreshList() {
    shareds = []
    getShareds()
  }


  async function unshare(shared) {
    currentSharedMeta.meta = {}
    setCurrentSharedMeta({meta:currentSharedMeta.meta})
    if (!confirm("Unshare " + shared.alias)) return
    deleteShared(shared.id, () => {
      toast.success('Successfully unshared.')
      const filtered = shareds.filter(item => item.id != shared.id)
      setShareds(filtered)
      setSharedsToMe(sharedsToMe.filter(item => item.share?.id != shared.id))
      currentSharedMeta.meta.sharedByMe = filtered

      count.meta.sharedToMe = count.meta.sharedToMe.filter(k => k.share?.id != shared.id)
      setCount({
        meta: count.meta
      })
    })
  }

  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return shareds
    
    const patterns = filterPattern.split(' ')
    let filtered = shareds
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> 
        (pattern ==='read' && item.read) ||
        (pattern ==='write' && item.write) ||
        (pattern ==='list' && item.list) ||
        (pattern ==='delete' && item.delete) ||
        item.alias?.includes(pattern) || 
        item.desc?.includes(pattern) || 
        item.updatedat?.includes(pattern))
    }
    
    return filtered
  }


  
  if (session?.user) {  
  return (
<>

<div className="pb-4 bg-white ">
  <SharesNav page="sharedByMeRef" currentShared={currentSharedMeta.meta.currentShared}/>    
  </div>

  <FilterBar setFilterPattern={setFilterPattern}/>







  <div className="w-full">

<div ref={listRef} className="w-full grid md:grid-cols-6 justify-start border-b">

<div className="flex flex-row justify-start gap-4 p-3 leading-normal">
    <h5 className="font-semibold tracking-tight text-gray-900 ">
      Alias    
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
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
      Description
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
      Permissions
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
      Xfer Account
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
      Last updated at
    </p>
  </div>
  
</div>


{
  filter()?.map((shared, i) => {
    return (
      <div key={i} className="w-full grid md:grid-cols-6 justify-start border-b md:hover:shadow-xl md:hover:bg-slate-200">

      <div className="flex flex-row justify-start p-3 leading-normal overflow-x-auto">
              <div 
              
              className="whitespace-nowrap overflow-x-auto scrollbar-hide font-semibold tracking-tight text-gray-900 ">
              
              {shared.alias}
          </div>        
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.desc}
          </p>
        </div>
        <div className="flex flex-row gap-2 justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.read?'read':''}
          </p>
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.write?'write':''}
          </p>
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.list?'list':''}
          </p>
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.delete?'delete':''}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.mount?.alias}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.updatedat}
          </p>
        </div>
        
        
        <div className="flex flex-row gap-4 justify-start p-3 leading-normal">
          <button           
          
          onClick={()=>{currentSharedMeta.meta.currentShared=shared;setCurrentSharedMeta({meta:currentSharedMeta.meta});tabSwitch('shareNetworkRef', 'auto')}}
          className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z" fill="#137ED9"></path> </g></svg>
          </button>
          <button           
          onClick={() => unshare(shared)}
          className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.8294 2.43983C7.52083 1.98179 6.89937 1.86062 6.44132 2.16919C5.98328 2.47776 5.86211 3.09922 6.17068 3.55726L10.9634 10.6715L8.63676 14.3491C8.13715 14.1248 7.58315 14 7 14C4.79086 14 3 15.7909 3 18C3 20.2091 4.79086 22 7 22C9.20914 22 11 20.2091 11 18C11 17.1033 10.705 16.2756 10.2067 15.6085L12.1839 12.4832L14.0676 15.2795C13.4051 15.9932 13 16.9493 13 18C13 20.2091 14.7909 22 17 22C19.2091 22 21 20.2091 21 18C21 15.7909 19.2091 14 17 14C16.5639 14 16.1441 14.0698 15.7511 14.1988L12.1319 8.82451L12.1313 8.8255L7.8294 2.43983ZM5 18C5 16.8954 5.89543 16 7 16C8.10457 16 9 16.8954 9 18C9 19.1046 8.10457 20 7 20C5.89543 20 5 19.1046 5 18ZM15 18C15 16.8954 15.8954 16 17 16C18.1046 16 19 16.8954 19 18C19 19.1046 18.1046 20 17 20C15.8954 20 15 19.1046 15 18Z" fill="#137ED9"></path> <path d="M14.5202 8.79027L17.8452 3.53461C18.1404 3.06789 18.0014 2.45017 17.5347 2.15489C17.068 1.85962 16.4503 1.99861 16.155 2.46534L13.2998 6.97841L14.5202 8.79027Z" fill="#137ED9"></path> </g></svg>
          </button>
        </div>
        
        
      </div>    
    )
  })
}

<NextPage more={more} newLimit={newLimit}/>


</div>
        
          
          </>                    
  
  );
  }
}
