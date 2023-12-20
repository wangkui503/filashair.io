'use client'
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import XferPolicyList from "./xferPolicyList";



export default function XferPolicyPlug({back}) {
  const xferAddrRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  
  const { data: session, status } = useSession()
  const submitButtonText = 'Submit'
  const submittedButtonText = 'Submitted'
  const submittingButtonText = 'Submitting...'
  const submitButtonDelay = 1000
  
  const [isLoading, setIsLoading] = useState<string>(submitButtonText)
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setIsLoading(submittingButtonText) 
      try {
      const formData = new FormData(event.currentTarget)
      const target = event.target as typeof event.target & {
        host: { value: string };
        xfer_addr: { value: string };
        username: { value: string };
        password: { value: string };
        jwttoken: { value: string };          
      };

      if (target.password.value ==='' && target.jwttoken.value ==='') {
        throw Error('password or jwt token is required')
      }
  
      const serverSpec  = {
        email: session?.user?.email,
        host: target.host.value,
        xfer_addr: target.xfer_addr.value,
        username: target.username.value,
        password: target.password.value,
        jwttoken: target.jwttoken.value      
    }

    fetch("/api/mount/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serverSpec),
    }).then(async (res) => {
      if (res.status === 200) {
        toast.success("Mount created! Redirecting to login...");        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    });

  

      }catch(error) {
        console.log(error)
        return alert((error as Error)?.message);
      } finally {
        setIsLoading(submittedButtonText)
        setTimeout(() => {
          setIsLoading(submitButtonText)
        }, submitButtonDelay);          
      }
          
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
        Plug in an Xfer account
      </div>
      </div>
          

        <form className="w-full" id="profileForm" onSubmit={onSubmit}>
        <div className="mb-6">
          <label htmlFor="host" className="block mb-2 text-sm font-medium text-gray-900 ">Host</label>
          <input 
          onChange={(e)=>{
            try{
            const url = new URL(e.currentTarget.value)
             if (url) {
              xferAddrRef.current.value = url.hostname + (url.port? ':' + (Number(url.port)+1).toString() : '');
            }
          } catch(e){

          }
          }}
          type="text" id="host" name="host" maxLength={256} defaultValue="https://localhost:55000" placeholder="Host"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="xfer_addr" className="block mb-2 text-sm font-medium text-gray-900 ">Transfer address</label>
          <input ref={xferAddrRef} type="text" id="xfer_addr" name="xfer_addr" maxLength={256} defaultValue="localhost:55001" placeholder="Transfer Host"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">User name</label>
          <input type="text" id="username" name="username" maxLength={64} defaultValue="admin" placeholder="User name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
          <input type="password" id="password" name="password" maxLength={64} defaultValue="" placeholder="Password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="jwttoken" className="block mb-2 text-sm font-medium text-gray-900 ">JWT token</label>
          <input type="text" id="jwttoken" name="jwttoken" maxLength={4096} defaultValue="" placeholder="JWT token"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        
        <button disabled={isLoading != submitButtonText} type="submit" form="profileForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">{isLoading}</button>
        <button type="reset" form="profileForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
      </form>
      

      <XferPolicyList/>

      </div>
      
      );

}