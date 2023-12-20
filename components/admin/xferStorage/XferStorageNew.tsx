'use client'
const xid = require('xid-js');
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { useCounter } from "@/components/context/context";
import XferStorageNewNav from "./xferStorageNewNav";



export default function XferStorageNew({list, setList, title, back}) {
  const [storageType, setStorageType] = useState('local')

  const idRef = useRef<HTMLInputElement | null>(null);
  const domainRef = useRef<HTMLInputElement | null>(null);
  const localPathRef = useRef<HTMLInputElement | null>(null);
  const s3PathRef = useRef<HTMLInputElement | null>(null);
  const accessKeyRef = useRef<HTMLInputElement | null>(null);
  const accessKeySecretRef = useRef<HTMLInputElement | null>(null);
  const bucketRef = useRef<HTMLInputElement | null>(null);
  const endpointRef = useRef<HTMLInputElement | null>(null);


  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token


  async function newStorage() {
    if (storageType==='local' && curmount.self?.role != 'super') {
      toast.error("not super xfer account")
      return
    }
    const data = {
      id: idRef.current?.value,
      domain: domainRef.current?.value,
      type: storageType,
      store: {
        access_key: accessKeyRef.current?.value,
        access_key_secret: accessKeySecretRef.current?.value,
        bucket: bucketRef.current?.value,
        endpoint: endpointRef.current?.value,
        path: localPathRef.current?.value        
      }
    }
    if (storageType==='s3') {
      data.store.path = s3PathRef.current?.value
      if (data.store.bucket == "") {
        toast.error("bucket is required")
        return
      }
      if ((!data.store.access_key || !data.store.access_key_secret) && curmount.self?.role != 'super') {
        toast.error("access_key and access_key_secret are required")
        return
      }
      if (data.store.access_key && !data.store.access_key_secret) {
        toast.error("access_key_secret is required")
        return
      }
    }
    if (data.store.path == "") {
      toast.error("path is required")
      return
    }
    

    fetch(mount.host + '/storages', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,        
      },    
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {        
        const storage = await res.json()
        setList([storage, ...list])
        mount['storages'+curmount?.curdomainid].all = [storage, ...mount['storages'+curmount?.curdomainid].all]
        setCount({
          meta: count.meta
        })
        console.log("newStorage--------------",storage)        
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }
  
  
      

      return (
        <div className="">
          <div className="pb-4 bg-white ">
        <XferStorageNewNav page={title+"sharedToMeRef"} title={title} back={back}/>    
        </div>
          

        <form className="w-full" id="profileForm">
        <div className="mb-6">
          <label htmlFor="ID" className="block mb-2 text-sm font-medium text-gray-900 ">ID</label>
          <input 
          ref={idRef}
          type="text" id="ID" name="ID" maxLength={256} defaultValue={"st_"+xid.next()} placeholder="ID"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="domain" className="block mb-2 text-sm font-medium text-gray-900 ">Domain</label>
          <input 
          ref={domainRef}
          disabled={curmount?.self?.role != "super"}
          type="text" id="domain" name="domain" maxLength={256} defaultValue={curmount?.curdomainid?? curmount?.self?.domain} placeholder={curmount?.curdomainid?? curmount?.self?.domain}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>

        <div className="mb-6">
        <fieldset className="">
          <legend className="py-2">Type</legend>
          <input
            checked={storageType=='local'}
            onChange={(e)=>setStorageType('local')}
            id={title+`local`} className="hidden peer/local" type="radio" name="status" />
          <label htmlFor={title+`local`} className="px-2 mx-2 peer-checked/local:text-sky-500 peer-checked/local:border-b-2 peer-checked/local:border-sky-500">
            Local
          </label>
          <input 
          checked={storageType=='s3'}
          onChange={(e)=>setStorageType('s3')}
          id={title+`s3`} className="hidden peer/s3" type="radio" name="status" />
          <label htmlFor={title+`s3`} className="px-2 mx-2 peer-checked/s3:text-sky-500 peer-checked/s3:border-b-2 peer-checked/s3:border-sky-500">
            S3
          </label>
          <div className="py-4 hidden peer-checked/local:block">
            <label htmlFor="path" className="block mb-2 text-sm font-medium text-gray-900 ">Path</label>
              <input 
              ref={localPathRef}
              type="text" id="path" name="path" maxLength={256}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
          </div>
          <div className="py-4 hidden peer-checked/s3:block">
            <label htmlFor="access_key" className="block mb-2 text-sm font-medium text-gray-900 ">access_key</label>
            <input 
            ref={accessKeyRef}
            type="text" id="access_key" name="access_key" maxLength={256}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />

            <label htmlFor="access_key_secret" className="block mb-2 text-sm font-medium text-gray-900 ">access_key_secret</label>
            <input 
            ref={accessKeySecretRef}
            type="text" id="access_key_secret" name="access_key_secret" maxLength={256}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />

            <label htmlFor="bucket" className="block mb-2 text-sm font-medium text-gray-900 ">bucket</label>
            <input 
            ref={bucketRef}
            type="text" id="bucket" name="bucket" maxLength={256}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />

            <label htmlFor="endpoint" className="block mb-2 text-sm font-medium text-gray-900 ">endpoint</label>
            <input 
            ref={endpointRef}
            type="text" id="endpoint" name="endpoint" maxLength={256}
            defaultValue="https://s3.amazonaws.com"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
            

            <label htmlFor="path" className="block mb-2 text-sm font-medium text-gray-900 ">Path</label>
            <input 
            ref={s3PathRef}
            type="text" id="path" name="path" maxLength={256}
            defaultValue="/"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
          </div>
        </fieldset>

        </div>




        



        

        
        
        <button 
        type="button"
        onClick={newStorage}
         className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Submit</button>
        <button type="reset" form="profileForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
      </form>
      

      </div>
      
      );

}