'use client';
const xid = require('xid-js');
import { tabSwitch } from "@/lib/tab";
import { useCounter } from "@/components/context/context";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import Contacts from "../contacts/contacts";
import { uniqueByKey } from "@/lib/unique";
import SharesNav from "./sharesNav";
import { sherr } from "@/lib/errors";
import { toastPromise } from "@/lib/errors";


export default function SharesNetwork({sharedsToMe, setSharedsToMe, shareds, setShareds, currentSharedMeta, setCurrentSharedMeta, back}) {   
  const formRef = useRef<HTMLFormElement | null>(null);
  const aliasRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  const deleteRef = useRef<HTMLInputElement | null>(null);

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const emailsRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState([]);
  const { data: session, status } = useSession();
  const [count, setCount] = useCounter();

  const [policies, setPolicies] = useState([]);

  const [allPermissions, setAllPermissions] = useState({meta:{read: false, write: false, delete: false, list: false}});

  const curmount = count.meta?.[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token 


  async function getExistShared(mount_id, share) {
    fetch('/api/shareds?action=search&users=true&mount_id='+mount_id + "&share=" + share, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",        
      },    
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json();
        console.log("getExistShared--", mount_id, share, result)
        if (result?.length > 0) {
          currentSharedMeta.meta.currentShared=result[0];
          setCurrentSharedMeta({meta:currentSharedMeta.meta})
          allPermissions.meta.read = currentSharedMeta.meta.currentShared?.read
          allPermissions.meta.write = currentSharedMeta.meta.currentShared?.write
          allPermissions.meta.list = currentSharedMeta.meta.currentShared?.list
          allPermissions.meta.delete = currentSharedMeta.meta.currentShared?.delete
          setAllPermissions({meta: allPermissions.meta})

          setPolicies(result[0].sharedUsers)          
        }    
        return result    
      }
      throw res
    }).catch(error => {
      sherr(error)
    })
  }
  

  useEffect(()=>{
    if (!currentSharedMeta.meta.currentShared) return
    setAllPermissions({meta:{read: false, write: false, delete: false, list: false}});
    setPolicies([])
    getExistShared((currentSharedMeta?.meta?.currentShared?.mount_id?? count.meta?.curmountid), currentSharedMeta?.meta?.currentShared?.share)
  }, [currentSharedMeta?.meta?.currentShared?.share])

  
  const handlePermissionClick = (e, per) => {
    const { id, checked } = e.target;
    allPermissions.meta[per] = checked
    setAllPermissions({meta: allPermissions.meta})
    enableSubmit()
  }

  const handleAllPermissionClick = e => {
    const { id, checked } = e.target;
    allPermissions.meta.read = checked
    allPermissions.meta.write = checked
    allPermissions.meta.list = checked
    allPermissions.meta.delete = checked
    setAllPermissions({meta: allPermissions.meta})
    enableSubmit()
  }
  
  
  async function submit() {
    const data = {
      alias: aliasRef.current?.value,
      desc: descRef.current?.value,
      mount_id: currentSharedMeta?.meta?.currentShared?.mount_id?? count.meta?.curmountid,
      share: currentSharedMeta?.meta?.currentShared?.share,
      read: allPermissions.meta.read,
      write: allPermissions.meta.write,
      list: allPermissions.meta.list,
      delete: allPermissions.meta.delete,
      updatedat: new Date(), 
    }
    console.log("sharesNetwork submit----", data)


     await fetch("/api/shareds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },    
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        currentSharedMeta.meta.currentShared.alias=result.alias;
        currentSharedMeta.meta.currentShared.desc=result.desc;
        currentSharedMeta.meta.currentShared.read=result.read;
        currentSharedMeta.meta.currentShared.write=result.write;
        currentSharedMeta.meta.currentShared.list=result.list;
        currentSharedMeta.meta.currentShared.delete=result.delete;
        setCurrentSharedMeta({meta:currentSharedMeta.meta})
        reset()
        result.mount = mount
        setShareds(uniqueByKey([result, ...shareds??[]], 'id'))
        console.log("sharesNetwork submit result--------------",result)                
        return result
      }
      throw res
    }).catch(error => {
      sherr(error)
    })
  }
  

  async function reset() {
    aliasRef.current.value = aliasRef.current?.defaultValue
    descRef.current.value = descRef.current?.defaultValue
    allPermissions.meta.read = currentSharedMeta.meta.currentShared.read ?? false
    allPermissions.meta.write = currentSharedMeta.meta.currentShared.write ?? false
    allPermissions.meta.list = currentSharedMeta.meta.currentShared.list ?? false
    allPermissions.meta.delete = currentSharedMeta.meta.currentShared.delete ?? false
    setAllPermissions({meta:allPermissions.meta}) 
    setSubmitDisabled(true)
  }

  async function deleteSharedUser(user) {
    const res = await fetch("/api/sharedUsers/" + user.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },    
    })
    if (res.status === 200) {
      const result = await res.json()
      return result
    }
    sherr(res)
  }


  async function removePolicy(policy) {    
    await deleteSharedUser(policy).then(
      sharedUser => {
        setPolicies(policies.filter((po)=>po.email != policy.email))
        if (policy.email == policy.createdby) {   
          setSharedsToMe(sharedsToMe?.filter((po)=> po.shared_id != policy.shared_id))
           count.meta.sharedToMe = count.meta.sharedToMe?.filter((po)=> po.shared_id != policy.shared_id) ?? []
          setCount({
            meta: count.meta
          }) 
        }
      }
    ).catch(error => {
      sherr(error)
    })    
  }

  async function addPolicy(contact) {
    if (policies.filter(policy => policy.email === contact.email)?.[0]) {
      toast.error('user alread added.')
      return
    }
    toastPromise(putUser(contact))
  }

  async function putUser(contact) {
    const shared = {
      alias: aliasRef.current?.value,
      desc: descRef.current?.value,
      mount_id: currentSharedMeta?.meta?.currentShared?.mount_id?? count.meta?.curmountid,
      share: currentSharedMeta?.meta?.currentShared?.share,
      read: allPermissions.meta.read,
      write: allPermissions.meta.write,
      list: allPermissions.meta.list,
      delete: allPermissions.meta.delete,
    }

    const sharedUser = {
      email: contact.email,
      shared: shared,
    }
      
    await fetch("/api/sharedUsers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },    
      body: JSON.stringify(sharedUser),
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        toast.success(contact.email + " is added.")
        policies.push(result)
        setPolicies(uniqueByKey(policies, 'id'))
        setShareds(uniqueByKey([result.share, ...shareds??[]], 'id'))
        if (result.email == result.createdby) {
          setSharedsToMe(uniqueByKey([result, ...sharedsToMe??[]], 'shared_id'))

          count.meta.sharedToMe = uniqueByKey([result, ...count.meta.sharedToMe??[]], 'shared_id')
          console.log("shared user putUser--------------",result, count.meta.sharedToMe)        
          setCount({
            meta: count.meta
          })
        }
        currentSharedMeta.meta.currentShared = result.share
        reset()
        return 
      }
      throw res
    }).catch(error => {
      sherr(error)
    })    
  }

  async function enableSubmit() {
    if (aliasRef.current?.value != aliasRef.current?.defaultValue || 
      descRef.current?.value != descRef.current?.defaultValue ||
      allPermissions.meta.read != (currentSharedMeta?.meta?.currentShared?.read??false) ||
        allPermissions.meta.write != (currentSharedMeta?.meta?.currentShared?.write??false) ||
        allPermissions.meta.list != (currentSharedMeta?.meta?.currentShared?.list??false) ||
        allPermissions.meta.delete != (currentSharedMeta?.meta?.currentShared?.delete??false)
      ) {
        setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
  }
  
  
  
    return (
<div className="relative overflow-y-auto">

<SharesNav page="shareNetworkRef" currentShared={currentSharedMeta.meta.currentShared}/>    


      <form ref={formRef} id="sharesnetworkform" className="">
<div className="flex flex-row w-full">
          <div className="relative z-0 w-full mb-4 group">
            <input
              maxLength={1024}
              type="text"
              ref={aliasRef}     
              name="subject"
              id="subject"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              required
              defaultValue={currentSharedMeta?.meta?.currentShared?.share}
              onChange={enableSubmit}
            />
            <label
              htmlFor="subject"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Alias
            </label>
          </div>
        </div>

        <div className="flex flex-row w-full">
          <div className="relative z-0 w-full mb-4 group">
            <textarea
              maxLength={4096}
              rows={4}
              cols={50}
              ref={descRef}   
              name="msgtxt"
              id="msgtxt"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              defaultValue={currentSharedMeta?.meta?.currentShared?.desc}
              onChange={enableSubmit}
            />
            <label
              htmlFor="msgtxt"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Description
            </label>
          </div>
        </div>
        

        <div className="flex flex-row gap-3 justify-start py-3 leading-normal">
        <div className="">
              <input
              onChange={(e)=>handlePermissionClick(e, 'read')}
          id="checkbox-read"
          type="checkbox"
          defaultChecked={currentSharedMeta?.meta?.currentShared?.read}
          checked={allPermissions.meta.read}
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
        /> 
        <label htmlFor="checkbox-read" className="">Read</label>                
        </div>
        <div className="">
              <input
              onChange={(e)=>handlePermissionClick(e, 'write')}
          id="checkbox-write"
          type="checkbox"
          defaultChecked={currentSharedMeta?.meta?.currentShared?.write}
          checked={allPermissions.meta.write}
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
        /> 
        <label htmlFor="checkbox-write" className="">Write</label>                
        </div>
        <div className="">
              <input
              onChange={(e)=>handlePermissionClick(e, 'list')}
          id="checkbox-list"
          type="checkbox"
          defaultChecked={currentSharedMeta?.meta?.currentShared?.list}
          checked={allPermissions.meta.list}
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
        /> 
        <label htmlFor="checkbox-list" className="">List</label>                
        </div>
        <div className="">
              <input
              ref={deleteRef}
              onChange={(e)=>handlePermissionClick(e, 'delete')}
          id="checkbox-delete"
          type="checkbox"
          defaultChecked={currentSharedMeta?.meta?.currentShared?.delete}
          checked={allPermissions.meta.delete}
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
        /> 
        <label htmlFor="checkbox-delete" className="">Delete</label>                
        </div>
        <div className="">
              <input
              onChange={handleAllPermissionClick}
          id="checkbox-all"
          type="checkbox"
          defaultChecked={currentSharedMeta?.meta?.currentShared?.read && currentSharedMeta?.meta?.currentShared?.write && currentSharedMeta?.meta?.currentShared?.list && currentSharedMeta?.meta?.currentShared?.delete}
          checked={allPermissions.meta.read && allPermissions.meta.write && allPermissions.meta.list && allPermissions.meta.delete}
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  "
        /> 
        <label htmlFor="checkbox-all" className="">all</label>                
        </div>
        </div>

<div className="flex flex-row gap-3">
  <button type="button"
  disabled={submitDisabled} 
onClick={() => toastPromise(submit())}
className="text-white bg-sky-600 font-medium rounded-lg text-sm px-4 py-2 text-center md:mr-0 disabled:bg-sky-200 disabled:opacity-75">Sbumit</button>
<button type="button" 
disabled={submitDisabled} 
onClick={reset}
className="text-white bg-sky-600 font-medium rounded-lg text-sm px-4 py-2 text-center md:mr-0 disabled:bg-sky-200 disabled:opacity-75">Reset</button>
</div>
        </form>
      

        <div className="w-full grid md:grid-cols-3 justify-start border-b">

    <div className="flex flex-col justify-between py-4 leading-normal">  
      <h5 className="font-semibold tracking-tight text-gray-900 ">
        Shared to    
      </h5>    
    </div>
    <div className="flex flex-col justify-between py-4 leading-normal">  
      <h5 className="font-semibold tracking-tight text-gray-900 ">
        Name
      </h5>    
    </div>
    </div>
      {
  policies?.map((policy, i) => {
    return (
      <div key={i} className="w-full grid md:grid-cols-3 justify-start border-b md:hover:shadow-xl md:hover:bg-slate-200">

      <div className="flex flex-row justify-start py-3 leading-normal overflow-x-auto">
        {policy.email}
        </div>

      <div className="flex flex-row justify-start py-3 leading-normal overflow-x-auto">
        {policy.name}
        </div>
        

        <div className="flex flex-col justify-start py-3 leading-normal">
          <button           
          onClick={()=>toastPromise(removePolicy(policy))}
          className="font-normal text-gray-700 flex flex-row gap-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 18H22M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          <span>Unshare</span>
          </button>
        </div>
        
      </div>    
    )
  })
}


  <div className="py-4">
  <Contacts title="Shares" showOff={true} funcs={[{name: 'Share to', action: addPolicy}]} omitDel={true}/>
  </div>

































</div>
    );

}