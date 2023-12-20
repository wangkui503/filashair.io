'use client'
import { useCounter } from "@/components/context/context";
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";



export default function XferPolicyNew({back}) {
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const shareRef = useRef<HTMLInputElement | null>(null);
  const readRef = useRef<HTMLInputElement | null>(null);
  const writeRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLInputElement | null>(null);
  const [count, setCount] = useCounter();
  const [read, setRead] = useState(false);
  const [write, setWrite] = useState(false);
  const [list, setList] = useState(false);

  const { data: session, status } = useSession()
  
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token


  async function newPolicy() {
    const data = {
      subject: subjectRef.current?.value,
      share: shareRef.current?.value,      
    }
    data.permissions = []
    if (readRef.current?.checked) {
      data.permissions.push('read')
    }
    if (writeRef.current?.checked) {
      data.permissions.push('write')
    }
    if (listRef.current?.checked) {
      data.permissions.push('list')
    }
    if (data.permissions.length > 0) {
      data.permissions.push('stat')
    }
    if (!data.subject) {
      toast.error('subject is required')
      return
    }
    if (!data.share) {
      toast.error('share is required')
      return
    }
    if (!data.permissions || data.permissions.length < 1) {
      toast.error('permission is required')
      return
    }
    fetch(mount.host + '/policies', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,                
      },    
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        const policy = await res.json()
        mount.policies = mount.policies ?? {}
        mount.policies.list = [policy, ...mount.policies.list]
        
        setCount({
          meta: count.meta
        })
        //setCurrent('')
        console.log("new policy--------------",policy)        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }
    

      

      return (
        <div className="p-3">
          <div className="w-full gap-4 flex flex-row py-4">
        <button
        className="block w-6 h-6 text-center text-xl leading-0 text-gray-400 md:hover:text-gray-900 transition-colors"
        onClick={()=>tabSwitch(back, 'auto')}
        >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </button>
      <div>
        Create a Policy
      </div>
      </div>
          

        <div className="mb-6">
          <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 ">Subject</label>
          <input ref={subjectRef} type="text" id="subject" name="subject" maxLength={64} defaultValue="" placeholder="User or group name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="share" className="block mb-2 text-sm font-medium text-gray-900 ">Share</label>
          <input ref={shareRef} type="text" id="share" name="share" maxLength={4096} defaultValue={curmount?.curshareid} placeholder="Share id"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        

        <div className="mb-6">
          <label htmlFor="share" className="block mb-2 text-sm font-medium text-gray-900 ">Permissions</label>
        <div className="mb-6 flex flex-row gap-3">
          <div>
                <input
                ref={readRef}
                checked={read}
                onChange={(e)=>setRead(e.target.checked)}
            type="checkbox"
            className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
          /> Read
          </div>
          <div>
              <input
              ref={writeRef}
              checked={write}
              onChange={(e)=>setWrite(e.target.checked)}
          type="checkbox"
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
        /> Write
        </div>
        <div>
              <input
              ref={listRef}
              checked={list}
              onChange={(e)=>setList(e.target.checked)}
          type="checkbox"
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
        /> List
        </div>
        <div>
              <input
              checked={read && write && list}
              onChange={(e)=>{setRead(e.target.checked);setWrite(e.target.checked);setList(e.target.checked);}}
          type="checkbox"
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
        /> All
        </div>
        </div>
        </div>

        <button 
        onClick={newPolicy}
        className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Submit</button>
        <button type="reset" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
      
      

      </div>
      
      );

}