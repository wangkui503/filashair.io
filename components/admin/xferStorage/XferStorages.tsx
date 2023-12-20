'use client'

import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import XferStorageList from "./xferStorageList";
import XferStorageNew from "./XferStorageNew";
import FilesPage from "./files/page";



export default function XferStorages({title, showOff, funcs, back}) {
  const xferAddrRef = useRef<HTMLDivElement | null>(null);
  const [list, setList] = useState([]);  
  
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
        <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
          <div id={title+'xferStorageListRef'} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferStorageList list={list} setList={setList} title={title} showOff={showOff} funcs={funcs} back={back}/>
          </div>
          <div id={title+'xferStorageNewRef'} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferStorageNew list={list} setList={setList} title={title} back={'xferStorageListRef'}/>
          </div>
          <div id={title+'xferStorageFilesRef'} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <FilesPage title={title} funcs={[]} back={title+'xferStorageListRef'}/>
          </div>
      </div>
      
      );

}