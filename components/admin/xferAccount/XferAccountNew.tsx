'use client'
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { useCounter } from "@/components/context/context";
import XferAccountNav from "./xferAccountNav";
import { sherr } from "@/lib/errors";
import { toastPromise } from "@/lib/errors";


export default function XferAccountNew({list, setList, back}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token

  const [role, setRole] = useState('regular')


  const domainIDRef = useRef<HTMLInputElement | null>(null);
  const userIDRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordRef1 = useRef<HTMLInputElement | null>(null);
  
  
  async function newXferAccount() {
    const data = {
      domain: domainIDRef.current?.value,
      id: userIDRef.current?.value,      
      password: passwordRef.current?.value,
      role: role
    }
    await fetch(mount.host + '/users', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,                
      },    
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        return result
      }
      throw res
    }).then(result => {
      setList([result, ...list??[]])
      console.log("new xfer account--------------",result)        
      formRef.current?.reset()
    }).catch(error => {
      sherr(error)
    })    
  }


  function onSubmit(e) {
      e.preventDefault();
      if (!domainIDRef.current?.value) {
        toast.error('Please select a xfer account.')
        return
      }
      if (passwordRef.current?.value == '') {
        toast.error('password is required')
        return
      }
      if (passwordRef.current?.value != passwordRef1.current?.value) {
        toast.error('passwords mush match')
        return
      }
      toastPromise(newXferAccount())
  }

      return (
        <div className="">
          <XferAccountNav page="xferAccountNewRef"/>    
          

        <form ref={formRef} autoComplete="off" className="w-full" id="XferAccountNewForm" onSubmit={onSubmit}>
        <div className="mb-6">
          <label htmlFor="domainid" className="block mb-2 text-sm font-medium text-gray-900 ">Domain ID</label>
          <input 
          ref={domainIDRef}
          disabled={curmount?.self?.role != 'super'}
          type="text" id="domainid" name="domainid" maxLength={64} defaultValue={curmount?.self?.domain} placeholder="Domain ID"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="domainid" className="block mb-2 text-sm font-medium text-gray-900 ">User ID</label>
          <input 
          autoComplete="new-password"
          required
          ref={userIDRef}
          type="text" id="domainid" name="domainid" maxLength={64} defaultValue="" placeholder="User ID"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
          <input 
          autoComplete="new-password"
          required
          ref={passwordRef}
          type="password" id="password" name="password" maxLength={64} defaultValue="" placeholder="Password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>
        <div className="mb-6">
          <input 
          autoComplete="new-password"
          required
          ref={passwordRef1}
          type="password" id="password1" name="password1" maxLength={64} defaultValue="" placeholder="Confirm password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5   " />
        </div>

        <div className="mb-6 flex flex-row gap-4">
        <fieldset className="">
          <legend className="py-2">Role</legend>
          <div className="flex flex-row gap-4">
              {
                curmount?.self?.role === 'super' ? (
                  <div className="flex flex-row gap-3">
                  <input 
                  checked={role === 'super'}
                  onChange={()=>setRole('super')}
                  type="radio" id="super" name="role_radio" defaultValue="super" className="mt-1"/>
                  <label htmlFor="super">SUPER</label>
                  </div>
                ) :''
              }              
              <div className="flex flex-row gap-3">
              <input 
              checked={role === 'admin'}
              onChange={()=>setRole('admin')}
              type="radio" id="admin" name="role_radio" defaultValue="admin" className="mt-1"/>
              <label htmlFor="admin">Admin</label>          
              </div>
              <div className="flex flex-row gap-3">
              <input 
              checked={role === 'regular'}
              onChange={()=>setRole('regular')}
              type="radio" id="regular" name="role_radio" defaultValue="regular" className="mt-1"/>
              <label htmlFor="regular">regular</label>          
            </div>
          </div>
          </fieldset>
        </div>

        
        <button 
        type="submit"        
        form="XferAccountNewForm"
        className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Submit</button>
        <button type="reset" form="XferAccountNewForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
      </form>
      

      </div>
      
      );

}