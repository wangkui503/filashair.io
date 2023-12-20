'use client'
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import ProfileNav from "./nav";
import { useCounter } from "@/components/context/context";
import { sherr, toastPromise } from "@/lib/errors";


export default function UpdateProfile() {
  const { data: session, status } = useSession()
  const hostRef = useRef<HTMLInputElement | null>(null);
  const xferAddrRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const aliasRef = useRef<HTMLInputElement | null>(null);
  const storageRef = useRef<HTMLInputElement | null>(null);
  const shareRef = useRef<HTMLInputElement | null>(null);
  const [count, setCount] = useCounter();

  const curuser = count.meta.curuser

  const [unsubmitable, setUnsubmitable] = useState(false);

  async function updateProfile() {
    setUnsubmitable(true)
    //await new Promise(r => setTimeout(r, 5000));
    if (!session?.user?.email) {
      toast.error('Please login');
      return
    }
    fetch("/api/users/" + session?.user?.email, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },    
      body: JSON.stringify({name:nameRef.current?.value}),
    }).then(async (res) => {
      setUnsubmitable(false)
      if (res.status === 200) {
        const user = await res.json()
        count.meta.curuser = user
        setCount({
          meta: count.meta
        })
        console.log("updateProfile--------------",user)        
      } else {
        throw res
      }
    }).catch(res => {
      sherr(res)      
    })
  }

      return (
        <div className="p-3">
          <ProfileNav page='UpdateProfileRef'/>
          
          <div className="flex flex-col gap-4">
        <div className={`flex flex-col space-y-4 rounded bg-stone-50 px-4 py-4 sm:px-16`}>
        <form className="w-full" id="updateProfileForm">
          <p className="py-4">My info</p>

          <div className="md:grid md:grid-cols-2 gap-3">
        <div className="">
          <label htmlFor="host" className="block mb-2 text-sm font-medium text-gray-900 ">Email</label>
          <p 
          ref={hostRef}          
          className="bg-gray-50 border-b border-gray-300 text-gray-900 text-sm block w-full py-2.5   " >
            {curuser?.email}
          </p>
        </div>
        <div className="">
          <label htmlFor="xfer_addr" className="block mb-2 text-sm font-medium text-gray-900 ">Role</label>
          <p ref={xferAddrRef}
          className="bg-gray-50 border-b border-gray-300 text-gray-900 text-sm block w-full py-2.5   " >
            {curuser?.role}
          </p>
        </div>
        <div className="md:col-span-2 ">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
          <input ref={nameRef} 
          type="text" id="name" name="name" maxLength={256} defaultValue={curuser?.name} placeholder="Name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        
        
        </div>
        <div className="flex flex-row">
        <button 
        disabled={unsubmitable}
        onClick={() => toastPromise(updateProfile())}
        type="button" form="updateProfileForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Submit</button>
        <button type="reset" form="updateProfileForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
        </div>
        </form>
        </div>

        
        <div className={`flex flex-col space-y-4 rounded bg-stone-200 px-4 py-4 sm:px-16`}>
        <p>My inbox</p>
        <div className="mb-6">
          <p ref={shareRef}
          className={`border-b border-gray-400 ${curuser?.inbox?.path? 'text-gray-900': 'text-yellow-600'}  text-sm block w-full p-2.5`} >
            {curuser?.inbox?.path} @ {curuser?.inbox?.share} 
          </p>
        </div>        
        </div>

        </div>  
      
      

      
      </div>
      
      );

}