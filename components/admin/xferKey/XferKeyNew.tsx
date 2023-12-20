'use client'
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { useCounter } from "@/components/context/context";


export default function XferKeyNew({back}) {
  const pubKeyRef = useRef<HTMLTextAreaElement | null>(null);

  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token
  

  async function newKey() {
    const data = {
      key: pubKeyRef.current?.value
    }
    if (!data.key) {
      toast.error('public key is required')
      return
    }
    fetch(mount.host + '/keys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,                
      },    
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        const key = await res.json()
        mount.keys.list = [key, ...mount.keys.list]
        
        setCount({
          meta: count.meta
        })
        //setCurrent('')
        console.log("new key--------------",key)        
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
        Upload a public key
      </div>
      </div>
          

          <div className="relative z-0 w-full mb-4 group">
            <textarea
              maxLength={4096}
              rows={4}
              cols={50}
              ref={pubKeyRef}         
              name="msgtxt"
              id="msgtxt"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
            />
            <label
              htmlFor="msgtxt"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Public key
            </label>
          </div>
        
        <button 
        onClick={newKey}
        className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Submit</button>
        <button type="reset" form="newKeyForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
      

      </div>
      
      );

}