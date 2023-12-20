'use client';
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import { tabSwitch } from "@/lib/tab";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import SharesNav from "./sharesNav";
import FilterBar from "@/components/filterbar";
import NextPage from "../nextPage";
import { uniqueByKey } from "@/lib/unique";


export default function SharesSharedToMe({sharedsToMe, setSharedsToMe, currentSharedMeta}) {    
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
    getSharedsToMe()
  }, [paging]); 
  
  async function getSharedsToMe() {
    fetch("/api/shareds?kind=to&take=50&skip="+sharedsToMe?.length??0, {
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
        const newShareds = uniqueByKey([...sharedsToMe, ...result], 'id')

        count.meta.sharedToMe = newShareds
        setCount({meta: count.meta})
        setSharedsToMe(newShareds)
        //setCurrent('')
        console.log("shareds to load init--------------",result)        
        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }

  useEffect(() => {
    
    const email = session?.user?.email
    
    if (!loaded && email) {
      console.log("email..........", email)
      getSharedsToMe()

    setLoaded(true)
    }
  },[]);

  async function refreshList() {
    sharedsToMe = []
    getSharedsToMe()
  }


  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return sharedsToMe
    
    const patterns = filterPattern.split(' ')
    let filtered = sharedsToMe
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> 
        (pattern ==='read' && item.share?.read) ||
        (pattern ==='write' && item.share?.write) ||
        (pattern ==='list' && item.share?.list) ||
        (pattern ==='delete' && item.share?.delete) ||
        item.share?.alias?.includes(pattern) || 
        item.share?.desc?.includes(pattern) || 
        item.createdby.includes(pattern) || 
        item.updatedat?.includes(pattern))
    }
    
    return filtered
  }
  
  if (session?.user) {  
  return (
<>

<div className="pb-4 bg-white ">
  <SharesNav page="sharedToMeRef" currentShared={currentSharedMeta.meta.currentShared}/>    
  </div>

  <FilterBar setFilterPattern={setFilterPattern}/>









  <div className="w-full">

<div className="w-full grid md:grid-cols-5 justify-start border-b">

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
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
      Shared by
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="whitespace-nowrap overflow-x-auto scrollbar-hide whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
      Last Updated at
    </p>
  </div>
  
</div>


{
  filter()?.map((shared, i) => {
    return (
      <div key={i} className="w-full grid md:grid-cols-5 justify-start border-b md:hover:shadow-xl md:hover:bg-slate-200">

      <div className="flex flex-row justify-start p-3 leading-normal overflow-x-auto">
              <div 
              
              className="whitespace-nowrap overflow-x-auto scrollbar-hide font-semibold tracking-tight text-gray-900 ">
              
              {shared.share?.alias}
          </div>        
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.share?.desc}
          </p>
        </div>
        <div className="flex flex-row gap-2 justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.share?.read?'read':''}
          </p>
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.share?.write?'write':''}
          </p>
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.share?.list?'list':''}
          </p>
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.share?.delete?'delete':''}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.createdby}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide text-gray-700">
          {shared.updatedat}
          </p>
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
