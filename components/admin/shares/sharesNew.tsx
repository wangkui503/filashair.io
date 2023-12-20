'use client';
const xid = require('xid-js');
import { tabSwitch } from "@/lib/tab";
import { useCounter } from "@/components/context/context";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { useOnScreen } from "@/lib/isVisible";
import NewShareNav from "./newShareNav";
import { uniqueByKey } from "@/lib/unique";

export default function SharesNew({xferShareslist, setXferSharesList, currentSharedMeta, setCurrentSharedMeta, userList, setUserList, title, back, forward}) {   
  const idRef = useRef<HTMLInputElement | null>(null);
  const storageRef = useRef<HTMLInputElement | null>(null);
  const pathRef = useRef<HTMLInputElement | null>(null);
  
  const currentShared = currentSharedMeta.meta.currentShared
  
  const { data: session, status } = useSession();

  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token
  const key = "storage_" + curmount?.curstorageid


  async function createShare() {
    if (!curmount?.curstorageid) return
    if (!idRef.current?.value) {
      if (!confirm("Use random ID?")) {
        return
      }      
    }
    if (!storageRef.current?.value) {
      toast.error("storage is required.")
      return
    }
    if (!pathRef.current?.value) {
      toast.error("path is required.")
      return
    }
    const data = {
      id: idRef.current?.value ?? "sh_" + xid.next(),
      storage: storageRef.current?.value,
      path: pathRef.current?.value,
    }
    const res = await fetch(mount.host + '/shares', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,     
      },      
      body: JSON.stringify(data),
    })
        
      if (res.status === 200) {        
        toast.success('Share created successfully!')
        const result  = await res.json();
        curmount.shares = uniqueByKey([result, ...curmount.shares??[]], 'id')
        setCount({
          meta: count.meta
        })
        setXferSharesList(uniqueByKey([result, ...xferShareslist??[]], 'id'))
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
  }
  
  
  
  
  
  
    return (
<div className="relative overflow-y-auto">

<div className="pb-4 bg-white ">
<NewShareNav title={title}/>
</div>


      <div className="">
        <div className="flex flex-row w-full">
          <div className="relative z-0 w-full mb-4 group">
            <input
              maxLength={1024}
              type="text"
              ref={idRef}     
              name="shareid"
              id="shareid"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="shareid"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              ID
            </label>
          </div>
        </div>

        <div className="flex flex-row w-full">
          <div className="relative z-0 w-full mb-4 group">
            <input
              maxLength={1024}
              type="text"
              ref={storageRef}     
              name="storageid"
              id="storageid"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              required
              value={curmount?.curstorageid}
            />
            <label
              htmlFor="storageid"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Storage
            </label>
          </div>
        </div>

        <div className="flex flex-row w-full">
          <div className="relative z-0 w-full mb-4 group">
            <input
              maxLength={1024}
              type="text"
              ref={pathRef}     
              name="sharepath"
              id="sharepath"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              required
              value={curmount?.curstoragepath}
            />
            <label
              htmlFor="sharepath"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Path
            </label>
          </div>
        </div>


        </div>
      


        <button type="button" 
        onClick={createShare}
        className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Submit</button>
        <button type="reset" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>


</div>
    );

}