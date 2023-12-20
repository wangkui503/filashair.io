'use client';
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import prisma from "@/lib/prisma";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import ShortFilterBar from "./shortfilterbar";

export default function Mountsnav() {   
  const [count, setCount] = useCounter();
  const mounts = count.meta.mounts
  
  console.log("mounts-------", mounts)
  
  const { data: session, status } = useSession()

  const [currentMountID, setCurrentMountID] = useState();

  const curmount = count.meta?.[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
  const notSharedToMe = !curshare?.sharedToMe
  


  async function getPubKey(mount, token, kid) {

    const res = await fetch(mount.host + '/keys/' + kid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },      
    })
    
    
      if (res.status === 200) {
        const pubkey = await res.json()
        return pubkey
        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }


  async function getSelf(mount_id, mount, token, callback) {
    const res = await fetch(mount.host + '/self', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },      
    })
    
    
      if (res.status === 200) {
        const self = await res.json()
        callback(self)
        mount.self = self
        count.meta[mount_id].self = self
        return self
        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  async function getShares(mount_id, mount, token) {
    const res = await fetch(mount.host + '/shares', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },      
    })
    
    
      if (res.status === 200) {
        const xcount = Number(res.headers.get("X-Count"))?? 0
        if (xcount > 0) {
          const shares = await res.json()
          count.meta[mount_id].shares = shares
          setCount({
            meta: count.meta
          })
          console.log("setCount shares------", shares)
        }        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  async function getDomains(mount_id, mount, token) {
    const res = await fetch(mount.host + '/domains', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },      
    })
    
    
      if (res.status === 200) {
        const xcount = Number(res.headers.get("X-Count"))?? 0
        if (xcount > 0) {
          const domains = await res.json()
          count.meta[mount_id].domains = domains
          setCount({
            meta: count.meta
          })
          console.log("setCount domains------", domains)
        }        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    
  }

  

  async function getToken(mount_id, callback) {
    const res = await fetch("/api/tokens/" + mount_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },      
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        callback(result.token)
        count.meta[mount_id].token = result.token
        setCount({
          meta: count.meta
        })
        
        return result.token
        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    });
    
  }

  async function onclick(mount_id) {
    const curmount = mounts.filter((mount) => mount.id == mount_id)[0]
    count.meta[mount_id] = count.meta[mount_id]?? {}
    count.meta[mount_id].mount = curmount
    getToken(mount_id, (token)=>{
      getSelf(mount_id, curmount, token, (self)=>{
        count.meta[mount_id].curdomainid = self.domain
        /* if (self.role == 'admin' || self.role == 'super') {
          getShares(mount_id, curmount, token)
        } */
        if (self.role == 'super') {
          getDomains(mount_id, curmount, token)
        }
      })  
      
    })  
    
    
    
    
    
    count.meta.curmountid = mount_id
    setCount({
      meta: count.meta
    })
    
    setCurrentMountID(mount_id)
    
    
  }



  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return mounts
    
    const patterns = filterPattern.split(' ')
    let filtered = mounts
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.alias?.includes(pattern) || item.host?.includes(pattern) || item.username?.includes(pattern) || item.xfer_addr?.includes(pattern) || item.updatedat?.includes(pattern))
    }
    
    return filtered
  }




  if (session?.user) {  
  return (

    
  
    
    


  <div className="w-full flex gap-6 snap-x snap-mandatory whitespace-nowrap overflow-x-auto scrollbar-hide">
    <div className="snap-center shrink-0">
      <div className="shrink-0 w-4 sm:w-48" />
    </div>
    <div id="mountsearchtoggle" className="flex flex-row snap-center shrink-0 first:pl-8 last:pr-8">
      <div className="relative py-2">
        <button 
        onClick={() => {
          const search = document.getElementById("mountsearch")
          const mountsearchpath = document.getElementById("mountsearchpath")
          search?.classList.toggle('hidden');
          
          if (!search?.classList.contains('hidden')) {
            mountsearchpath.style.stroke = "#0369a1"
          } else {
            mountsearchpath.style.stroke = "currentColor"
          }
          
        }}
        className="block w-7 h-7 text-center text-xl leading-0 absolute top-4 right-2 text-gray-400 md:hover:text-gray-900 transition-colors">
          
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
          <path id="mountsearchpath" d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
          </svg>

        </button>
      </div>
      <div id="mountsearch" className="hidden relative py-2">
        <ShortFilterBar title="mountsearch" setFilterPattern={setFilterPattern}/>        
      </div>
    </div>
    
      {
        filter()?.map((mount) => {
          const mounturl = new URL(mount.host)
          const mountString = mount.username + "@" + mounturl.hostname + (mounturl.port? ":"+mounturl.port : "");
          return (
              <div key={mount.id} className="snap-center shrink-0 first:pl-8 last:pr-8">
                <button
                onClick={() => onclick(mount.id)}                            
                className={`inline-block px-2 pt-4 pb-2 ${(currentMountID==mount.id && !curmount?.foreign) ? "border-b-2 text-blue-600 border-blue-600 active " : "border-b rounded-t-lg md:hover:text-gray-600 md:hover:border-gray-300 "}`}
              >
                {mount.alias}
              </button>
            </div>
          )
        })
      }

    
    {/* <div className="snap-center shrink-0 first:pl-8 last:pr-8">
    <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed">
        Disabled
      </a>
    </div> */}
    
    <div className="snap-center shrink-0">
      <div className="shrink-0 w-4 sm:w-48" />
    </div>
  </div>

  );
  }
}
