'use client'
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { useCounter } from "@/components/context/context";
import { uniqueByKey } from "@/lib/unique";
import XferAccountNav from "./xferAccountNav";
import { putPubKey, getSelfRaw, postMount } from "@/lib/xferAccount";
import { getPylonToken } from "@/lib/getXferAccount";
import { sherr } from "@/lib/errors";



export default function XferAccountPlug({list, setList, currentUser, setCurrentUser, back}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const hostRef = useRef<HTMLInputElement | null>(null);
  const xferAddrRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLDivElement | null>(null);
  const aliasRef = useRef<HTMLInputElement | null>(null);
  const pylonRef = useRef<HTMLInputElement | null>(null);
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
  const mount = curmount?.mount
  const token = curmount?.token


  
  const { data: session, status } = useSession()
  const submitButtonText = 'Submit'
  const submittedButtonText = 'Submitted'
  const submittingButtonText = 'Submitting...'
  const submitButtonDelay = 1000
  
  const [isLoading, setIsLoading] = useState<string>(submitButtonText)
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setIsLoading(submittingButtonText) 
      const target = event.target as typeof event.target & {
        host: { value: string };
        xfer_addr: { value: string };
        username: { value: string };
        password: { value: string };
        alias: { value: string };
        pylon: { value: string };
      };

      if (!pylonRef.current?.checked && target.password.value ==='') {
        throw Error('password is required')
      }

      const serverSpec  = {
        email: session?.user?.email,
        host: target.host.value,
        xfer_addr: target.xfer_addr.value,
        username: target.username.value,
        password: target.password.value,
        alias: target.alias.value,    
        
      }
      if (pylonRef.current?.checked) {
        try {
          const token = await getPylonToken(target.username.value)
          console.log('getPylonToken-- super pylon--', token)
          serverSpec.token = 'bearer ' + token            
        } catch(error) {
          sherr(error)
        }   
      } else {
        serverSpec.token = 'Basic ' + btoa(target.username.value + ":" + target.password.value)
      }

      if (!serverSpec.token) {
        return
      }
            
      let newMount
      getSelfRaw(serverSpec.host, serverSpec.token).then(
        self => postMount(serverSpec)
      ).then(
        mount => {
          newMount= mount
          return putPubKey(mount, mount.id, serverSpec.host, serverSpec.token, mount.kid, mount.pubKey)
        }
      ).then(
        key => {
          count.meta.mounts = [newMount, ...count.meta.mounts??[]]
          setCount({
            meta: count.meta
          })
          setList([newMount, ...list])
        }
      ).catch(error => {          
          sherr(error)
      }).finally(() => {
        setIsLoading(submittedButtonText)
        setTimeout(() => {
          setIsLoading(submitButtonText)
        }, submitButtonDelay);          
      })
    }

      return (
        <div className="">
          <XferAccountNav page="xferAccountPlugRef"/>    
          

        <form ref={formRef} autoComplete="off" className="w-full" id="xferAcountPlugForm" onSubmit={onSubmit}>
        <div className="mb-6">
          <label htmlFor="host" className="block mb-2 text-sm font-medium text-gray-900 ">Host</label>
          <input 
          ref={hostRef}
          onChange={(e)=>{
            try{
            const url = new URL(e.currentTarget.value)
             if (url) {
              xferAddrRef.current.value = url.hostname + (url.port? ':' + (Number(url.port)+1).toString() : '');
              aliasRef.current.value = usernameRef.current?.value + "@" + url.hostname + (url.port?  ':' + url.port : '');
            }
          } catch(e){

          }
          }}
          type="text" id="host" name="host" maxLength={256} defaultValue={mount? mount.host : "https://localhost:55000"} placeholder="Host"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="xfer_addr" className="block mb-2 text-sm font-medium text-gray-900 ">Transfer address</label>
          <input ref={xferAddrRef} type="text" id="xfer_addr" name="xfer_addr" maxLength={256} defaultValue={mount ? mount.xfer_addr: "localhost:55001"} placeholder="Transfer Host"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 ">
            <span className="mr-6">User name</span>
            <input 
            onChange={() => {
              usernameRef.current.value = 'super';
              const url = new URL(hostRef.current?.value)
              aliasRef.current.value = usernameRef.current?.value + "@" + url.hostname + (url.port?  ':' + url.port : '');
              passwordRef.current?.classList.toggle('hidden')
            }}
            ref={pylonRef} type="checkbox" id="pylon" className="mr-2"/>
            <label htmlFor="pylon">Pylon</label>
            </label>
          <input ref={usernameRef}           
          onChange={(e)=>{
            try{
            const url = new URL(hostRef.current?.value)
             if (url) {
              aliasRef.current.value = usernameRef.current?.value + "@" + url.hostname + (url.port?  ':' + url.port : '');
            }
          } catch(e){

          }
          }}
          autoComplete="new-password"
          type="text" id="username" name="username" maxLength={64} defaultValue={currentUser?.id?? ''} placeholder="User name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div ref={passwordRef} className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
          <input 
          autoComplete="new-password"
          type="password" id="password" name="password" maxLength={64} defaultValue="" placeholder="Password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900 ">Alias</label>
          <input ref={aliasRef} 
          autoComplete="new-password"
          type="text" id="alias" name="alias" maxLength={256} defaultValue="" placeholder="Alias"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        
        <button disabled={isLoading != submitButtonText} type="submit" form="xferAcountPlugForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">{isLoading}</button>
        <button type="reset" form="xferAcountPlugForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
      </form>
      
      </div>
      
      );

}