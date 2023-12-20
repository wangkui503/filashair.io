'use client'
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { getSelfRaw } from "@/lib/getXferAccount";
import { getPylonToken, getPylonSelf, newXferAccount, newStorage, newShare } from "@/lib/getXferAccount";
import ProfileNav from "./nav";
import { sherr } from "@/lib/errors";
import { toastPromise } from "@/lib/errors";


export default function PylonNew() {
  const { data: session, status } = useSession()
  const hostRef = useRef<HTMLInputElement | null>(null);
  const xferAddrRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const aliasRef = useRef<HTMLInputElement | null>(null);
  const storageRef = useRef<HTMLInputElement | null>(null);
  const shareRef = useRef<HTMLInputElement | null>(null);

  const [unsubmitable, setUnsubmitable] = useState(false);

  async function putPubKey(host, token, kid, pubKey) {
    const res = await fetch(host + '/keys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
      },      
      body: JSON.stringify({id: kid, user_id:nameRef.current?.value ,key:pubKey}),
    })
      if (res.status === 200) {
        const result = await res.json()
        return result
      } else {
        throw res
      }    
    
  }

  async function postDownloadsMount() {
    const serverSpec  = {
      email: session?.user?.email,
      host: hostRef.current?.value,
      xfer_addr: xferAddrRef.current?.value,
      username: nameRef.current?.value,
      alias: aliasRef.current?.value
  }
    const res = await fetch("/api/mount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serverSpec),
    })
      if (res.status === 200) {
        const result = await res.json()
        console.log("new mount--------", result)
        return result        
      } else {
        throw res
      }
    
  }

  async function newDownloads() {
    setUnsubmitable(true)
    const host = hostRef.current?.value
    const xferAcountData = {
      id: nameRef.current?.value,
      password: '1234',
      role: 'admin',
      domain: 'admin',            
    }
    const storageData = {
      id: 'home',
      type: 'local',
      store: {
        path: storageRef.current?.value,
      },
      domain: 'admin',            
    }
    const shareData = {
      id: shareRef.current?.value,
      storage: 'home',
      path: shareRef.current?.value,
      domain: 'admin',            
    }
    let pylonToken
    getPylonToken('super').then(
      token => {
        pylonToken = token
        return getPylonSelf(hostRef.current?.value, pylonToken)
      }
    ).then(
      self => newXferAccount(host, pylonToken, xferAcountData)
    ).then(
      acc => newStorage(host, pylonToken, storageData)
    ).then(
      storage => newShare(host, pylonToken, shareData)
    ).then(
      share => postDownloadsMount()
    ).then(
      mount => putPubKey(host, pylonToken, mount.kid, mount.pubKey)    
    ).catch(error => {
      sherr(error)
    }).finally(() => {
      setUnsubmitable(false)
    })
    
  }
    

      

      return (
        <div className="p-3">
          <ProfileNav page='MyDownloadsNewRef'/>
          

        <form className="w-full" id="newDownloadsForm">
        <div className={`flex flex-col space-y-4 rounded bg-stone-50 px-4 py-4 sm:px-16`}>
          <p>New xfer account</p>

          <div className="md:grid md:grid-cols-4 gap-3">
        <div className="">
          <label htmlFor="host" className="block mb-2 text-sm font-medium text-gray-900 ">Host</label>
          <input 
          ref={hostRef}
          onChange={(e)=>{
            try{
            const url = new URL(e.currentTarget.value)
             if (url) {
              xferAddrRef.current.value = url.hostname + (url.port? ':' + (Number(url.port)+1).toString() : '');
              aliasRef.current.value = nameRef.current?.value + "@" + url.hostname + (url.port?  ':' + url.port : '');
            }
          } catch(e){

          }
          }}
          type="text" id="host" name="host" maxLength={256} defaultValue="https://localhost:55000" placeholder="Host"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="">
          <label htmlFor="xfer_addr" className="block mb-2 text-sm font-medium text-gray-900 ">Transfer address</label>
          <input ref={xferAddrRef} type="text" id="xfer_addr" name="xfer_addr" maxLength={256} defaultValue="localhost:55001" placeholder="Transfer Host"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
          <input ref={nameRef} 
          onChange={(e)=>{
            try{
            const url = new URL(hostRef.current?.value)
             if (url) {
              aliasRef.current.value = nameRef.current?.value + "@" + url.hostname + (url.port?  ':' + url.port : '');
            }
          } catch(e){

          }
          }}
          type="text" id="name" name="name" maxLength={256} defaultValue="admin" placeholder="Name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        
        
        <div className="">
          <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900 ">Alias</label>
          <input ref={aliasRef} type="text" id="alias" name="alias" maxLength={256} defaultValue="admin@localhost:55000" placeholder="Alias"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        </div>
        </div>

        <div className={`flex flex-col space-y-4 rounded bg-stone-100 px-4 py-4 sm:px-16`}>
        <p>New storage path</p>
        <div className="mb-6">
          <input ref={storageRef} type="text" id="storage" name="storage" maxLength={64} defaultValue="${HOME}" placeholder="${HOME}"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>        
        </div>

        <div className={`flex flex-col space-y-4 rounded bg-stone-200 px-4 py-4 sm:px-16`}>
        <p>New share path</p>
        <div className="mb-6">
          <input ref={shareRef} type="text" id="share" name="share" maxLength={64} defaultValue="Downloads" placeholder="Downloads"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>        
        </div>
        
        <button 
        disabled={unsubmitable}
        onClick={() => toastPromise(newDownloads())}
        type="button" form="newDownloadsForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Submit</button>
        <button type="reset" form="newDownloadsForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
      </form>
      

      
      </div>
      
      );

}