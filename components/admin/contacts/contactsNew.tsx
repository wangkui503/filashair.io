'use client'
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import { useCounter } from "@/components/context/context";
import {postShares, createFile} from "@/lib/getXferAccount"
import ContactsNewNav from "./contactsNewNav";
import { sherr } from "@/lib/errors";
import { toastPromise } from "@/lib/errors";


export default function ContactsNew({selectedStorage, title, session, list, setList, back}) {
  
  
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token

  const [role, setRole] = useState('regular')

  const formRef = useRef<HTMLFormElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const xferAccountRef = useRef<HTMLInputElement | null>(null);
  const xferStorageRef = useRef<HTMLInputElement | null>(null);
  const xferRoleRef = useRef<HTMLInputElement | null>(null);


  async function setInbox(user, email, mount_id, share_id) {
    await fetch("/api/inbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        mount_id: mount_id,
        share: share_id,
        path: '/inbox',
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        const inbox = await res.json()
        user.inbox = inbox
        return inbox
      }
      throw res
    }).catch(error => {
      sherr(error)
    })
  }


  async function inviteNewContact() {
    if (emailRef.current?.value == '') {
      toast.error('email is required');
      return
    }
    if (!mount) {
      toast.error('Xfer Account is required');
      return
    }
    if (!xferStorageRef.current?.value) {
      toast.error('Xfer Storage is required');
      return
    }

    const newPath = await createFile(mount, token, xferStorageRef.current?.value, {
      type: 'folder',
      path: 'myshair_' + emailRef.current?.value + '/inbox',
    }) 
    if (!newPath) {
      return
    }
    console.log("inviteNewContact - createFile - ")

    const share_id = 'myshair_' + emailRef.current?.value
    const newShare = await postShares(mount, token, {
      id: share_id,
      storage: xferStorageRef.current?.value,
      path: share_id,
    })
    if (!newShare) {
      return
    }
    console.log("inviteNewContact - postShares - ")
    

    const data = {
      email: emailRef.current?.value,
      mount_id: mount?.id,
      share: share_id,
      role: role
    }
    await fetch('/api/contacts', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },    
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        const myShair = await res.json()
        return myShair
      }
      throw res
    }).then(myShair => {
      setList([myShair?.user, ...list])
      setInbox(myShair?.user, data.email, data.mount_id, data.share)    
      console.log("new contact--------------",myShair)        
      formRef.current?.reset()
    }).catch(error => {
      sherr(error)
    })

    
  }



  if (session?.user?.role != 'admin') {
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
        Only admin can invite.
      </div>
      </div>
      </div>
    )
  }
    

      

      return (
        <div className="">
          <div className="pb-4 bg-white ">
          <ContactsNewNav title={title} session={session} page={title+'contactsSearchResultListRef'} back={back}/>
          </div>
          

        <form ref={formRef} className="w-full" id="ContactsNewForm">
        <div className="relative z-0 w-full mb-4 group border-b border-neutral-300">
        <input
          className="block py-2 w-full bg-transparent appearance-none peer"
          placeholder=" "
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          ref={emailRef}
        />
        <label
          htmlFor="email"
          className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Email address
        </label>
      </div>

      <div className="relative z-0 w-full mb-4 group border-b border-neutral-300">
        <input
          className="block py-2 w-full bg-transparent appearance-none peer"
          placeholder=" "
          id="xferAccount"
          name="xferAccount"
          type="text"          
          required
          disabled
          ref={xferAccountRef}
          value={mount?.alias}
        />
        <label
          htmlFor="email"
          className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Xfer Account
        </label>
      </div>

      <div className="relative z-0 w-full mb-4 group border-b border-neutral-300">
        <input
          className="block py-2 w-full bg-transparent appearance-none peer"
          placeholder=" "
          id="xferStorage"
          name="xferStorage"
          type="text"          
          required
          ref={xferStorageRef}
          value={selectedStorage?.id}
        />
        <label
          htmlFor="email"
          className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Xfer Storage
        </label>
        <button 
        type="submit" form="search"
        onClick={()=>tabSwitch(title+'contactsStorageListRef', 'auto')}
        className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-0 text-gray-400 md:hover:text-gray-900 transition-colors">
        <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>

        </button>
      </div>

        

        <div className="mb-6 flex flex-row gap-4">
        <fieldset className="">
          <legend className="py-2">Role</legend>
          <div className="flex flex-row gap-4">
            <div className="flex flex-row gap-3">
            <input 
            checked={role === 'regular'}
            onChange={()=>setRole('regular')}
            type="radio" id={title+"regular"} name="role_radio" defaultValue="regular" className="mt-1 peer/regular"/>
            <label htmlFor={title+"regular"}
            className="px-1 mx-1 peer-checked/regular:text-sky-500 peer-checked/regular:border-b-2 peer-checked/regular:border-sky-500"
            >regular</label>          
            </div>
            <div className="flex flex-row gap-3">
            <input 
            checked={role === 'admin'}
            onChange={()=>setRole('admin')}
            type="radio" id={title+"admin"} name="role_radio" defaultValue="admin" className="mt-1 peer/admin"/>
            <label htmlFor={title+"admin"}
            className="px-1 mx-1 peer-checked/admin:text-sky-500 peer-checked/admin:border-b-2 peer-checked/admin:border-sky-500"
            >Admin</label>          
            </div>
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
          </div>
          </fieldset>
        </div>

        
        <button 
        type="button"
        onClick={() => toastPromise(inviteNewContact())}
        className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Submit</button>
        <button type="reset" form="ContactsNewForm" className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">Reset</button>
      </form>
      

      </div>
      
      );

}