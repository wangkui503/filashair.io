'use client';
import { useCounter } from "@/components/context/context";

import { useSession } from "next-auth/react"
import { setCookie, getCookie } from 'cookies-next';
import { getTokenWithShare, getSelf, getPubKey, getShare } from "@/lib/getXferAccount";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import ShortFilterBar from "./shortfilterbar";

export default function Sharenav() {    
  const [count, setCount] = useCounter();
  const { data: session, status } = useSession()
  const curmount = count.meta?.[count.meta?.curmountid]

  console.log("curmount..>>>>..", curmount)
  
  async function onclick(share_id) {
    if (!curmount) return
    else curmount.curshareid = share_id
    setCount({
      meta: count.meta
    })
    console.log("meta...<<<", count.meta)    
  }

  async function getXferAccountInfo(shared) {
    const mount = shared.share?.mount
    const shareid = shared.share?.share
    const alias = shared.share?.alias
    //if (!count.meta[mount.id]) {
      const token = await getTokenWithShare(mount.id, shareid)  
      const self = await getSelf(mount, token)  
      count.meta[mount.id] = count.meta[mount.id]?? {}
      count.meta[mount.id].mount = mount
      count.meta[mount.id].token = token
      count.meta[mount.id].self = self      
    //}
    count.meta[mount.id].shares = count.meta[mount.id].shares?? []
    const share = count.meta[mount.id].shares?.filter((share)=>share.id === shareid)[0]
    if (!share) {
      const shareDetails = await getShare(mount, count.meta[mount.id].token, shareid)  
      shareDetails.sharedToMe = true
      shareDetails.share_kind = 'shared'
      shareDetails.alias = alias
      count.meta[mount.id].shares.push(shareDetails)
    }        
  }

  async function onSharedClick(shared) {
    //if (!count.meta[shared.share?.mount?.id]) {
      await getXferAccountInfo(shared)
    //}
    /* if (count.meta.curmountid === shared.share?.mount?.id &&       
      count.meta[count.meta?.curmountid].curshareid === shared.share?.share) {
        return
    } */
    count.meta.curmountid = shared.share?.mount?.id
    count.meta[count.meta?.curmountid] = count.meta[count.meta?.curmountid]?? {}
    count.meta[count.meta?.curmountid].curshareid = shared.share?.share 
    count.meta[count.meta?.curmountid].mount = shared.share?.mount 
    
    setCount({
      meta: count.meta
    }) 
    console.log("onSharedClick...<<<", count.meta[count.meta?.curmountid])    
  }

  

  

  const [filterPattern, setFilterPattern] = useState();  
  
  function filterSharedToMe() {
    if (!filterPattern) return count.meta.sharedToMe??[]
    
    const patterns = filterPattern.split(' ')
    let filtered = count.meta.sharedToMe??[]
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

  function filterShares() {
    if (!filterPattern) return curmount?.shares??[]
    
    const patterns = filterPattern.split(' ')
    let filtered = curmount?.shares??[]
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.id?.includes(pattern) || item.path?.includes(pattern) || item.last_updated_at?.includes(pattern))
    }
    
    return filtered
  }



  if (session?.user) {  
  return (
  <div className="w-full flex gap-6 snap-x snap-mandatory whitespace-nowrap overflow-x-auto scrollbar-hide">
    <div className="snap-center shrink-0">
      <div className="shrink-0 w-4 sm:w-48" />
    </div>
    <div id="sharesearchtoggle" className="flex flex-row snap-center shrink-0 first:pl-8 last:pr-8">
      <div className="relative py-2">
        <button 
        onClick={() => {
          const search = document.getElementById("sharesearch")
          const sharesearchpath = document.getElementById("sharesearchpath")
          search?.classList.toggle('hidden');
          
          if (!search?.classList.contains('hidden')) {
            sharesearchpath.style.stroke = "#0369a1"
          } else {
            sharesearchpath.style.stroke = "currentColor"
          }
          
        }}
        className="block w-7 h-7 text-center text-xl leading-0 absolute top-4 right-2 text-gray-400 md:hover:text-gray-900 transition-colors">
          
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
          <path id="sharesearchpath" d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
          </svg>

        </button>
      </div>
      <div id="sharesearch" className="hidden relative py-2">
      <ShortFilterBar title="sharesearch" setFilterPattern={setFilterPattern}/>        
      </div>
    </div>
    

    {
      filterSharedToMe()?.map((shared) => {
        console.log("shared------", shared)
        return (
          <>
        <div className="snap-center shrink-0 first:pl-8 last:pr-8">
          <button
          onClick={() => onSharedClick(shared)}
          className={`inline-block px-2 pt-4 pb-2 ${count.meta?.curmountid == shared.share?.mount?.id && curmount?.curshareid ==shared.share?.share ? "border-b-2 text-blue-600 border-blue-600 active " : "border-b rounded-t-lg md:hover:text-gray-600 md:hover:border-gray-300 "}`}
            aria-current="page"
          >
            {shared.share?.alias}
          </button>
        </div>        
        </>
        )
      })
    } 
    <div className="snap-center shrink-0 first:pl-8 last:pr-8 border-l my-4"/>
    {
    filterShares()?.map((share) => {      
        if(count.meta.sharedToMe?.some(shared => shared.share?.mount?.id == count.meta?.curmountid && shared.share?.share == share.id)) {
          return ''
        }

      return (
      <div key={share.id} className="snap-center shrink-0 first:pl-8 last:pr-8">
        <button
          onClick={() => onclick(share.id)}
          className={`inline-block px-2 pt-4 pb-2 ${curmount?.curshareid ==share.id ? "border-b-2 text-blue-600 border-blue-600 active " : "border-b rounded-t-lg md:hover:text-gray-600 md:hover:border-gray-300 "}`}
          aria-current="page"
        >
          {share.id}
        </button>
      </div>
      )
    })
    }    
    <div className="snap-center shrink-0">
      <div className="shrink-0 w-4 sm:w-48" />
    </div>
  </div>

  );
  }
}
