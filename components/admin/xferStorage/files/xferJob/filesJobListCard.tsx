var pathlib = require('path');
import { useRef, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useCounter } from "@/components/context/context";
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";

const final_statuses = ['completed', 'aborted']

export default function FilesJobListCard({job, i, title, setCurrentJob}) {    
  const funcsRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token

  const [jobCard, setJobCard] = useState({meta:job});


  useEffect(() => {    
    
    if (!job) return
    jobCard.meta = job
    setJobCard({meta:jobCard.meta})
    if (jobCard.meta.status === 'completed') return
    doPollJobStatus()
    const pollingStatusThread = setInterval(() => {   
      console.log("transfer status polling--------------", job, jobCard)
        if (jobCard.meta.status === 'completed')
          clearInterval(pollingStatusThread); 
        else 
          doPollJobStatus()
    }, 1000)
    return () => clearInterval(pollingStatusThread);
  }, [job])

  async function doPollJobStatus() {
    if (jobCard.meta.status == 'completed') return
    getJobDetail()    
  }

  async function getJobDetail() {    
    if (!mount) return
    const res = await fetch(mount.host + "/jobs/"+jobCard.meta.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "bearer " + token,
        'filash-domain': curmount?.curdomainid,
      },    
    })
    if (res.status === 200) {
      const result = await res.json()
      jobCard.meta.status = result.status
      jobCard.meta.progress = result.progress
      setJobCard({meta: jobCard.meta})
      console.log("getXferLoc--------------",jobCard.meta.progress?.progress, jobCard)
    } else if (res.status === 404) {
      const result = await res.json()
    } else {
      toast.error("Get transfer error: " + res.status);
    } 
    return false   
  }

  async function abortJob() {
    if (!mount) return
    if (final_statuses.includes(jobCard.meta.status)) return
    const res = await fetch(mount.host + "/jobs/"+jobCard.meta.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "bearer " + token,
        'filash-domain': curmount?.curdomainid,
      },    
      body: JSON.stringify({"status":"aborted"})
    })
    if (res.status === 200) {
      console.log("abortJob--------------",jobCard.meta.progress?.progress, jobCard)
    } else if (res.status === 404) {
      const result = await res.json()
    } else {
      toast.error("abort job error: " + res.status);
    } 
    return false   
  }
 
  

    return (
        
      <div className="w-full grid md:grid-cols-11 justify-start border-b md:hover:shadow-lg md:hover:bg-stone-200">

      <div className="overflow-auto scrollbar-hide flex flex-row justify-start p-3 leading-normal overflow-x-auto">
      <h5 className="font-semibold tracking-tight text-gray-400 ">    
              {jobCard.meta.id}
          </h5>        
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {jobCard.meta.spec?.action}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {jobCard.meta.status}
          </p>
        </div>
        <div className="overflow-auto scrollbar-hide flex flex-col justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {jobCard.meta.spec.storage}
          </p>
        </div>
        <div className="overflow-auto scrollbar-hide flex flex-col md:col-span-2 justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {jobCard.meta.spec.path}
          </p>
        </div>
        <div className="overflow-auto scrollbar-hide flex flex-col md:col-span-2 justify-start p-3 leading-normal">
          <p className="font-normal text-gray-700">
          {jobCard.meta.spec.name}
          </p>
        </div>
        
        <div className="overflow-auto scrollbar-hide flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap font-normal text-gray-700">
          {job?.progress.found??0}
          </p>
        </div>
        <div className="overflow-auto scrollbar-hide flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap font-normal text-gray-700">
          {jobCard.meta.last_updated_at}
          </p>
        </div>

        <div className="overflow-auto scrollbar-hide flex flex-row gap-6 justify-start p-3 leading-normal">
          <button
          onClick={()=>{setCurrentJob(job); tabSwitch(title+'xferJobResultListRef', 'auto')}}
          >
          <svg className="w-6 h-6" fill="#137ED9" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8h9a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"></path></g></svg>
          </button>
          {final_statuses.includes(jobCard.meta.status) ? '' : (                  
            <button
            onClick={abortJob}
            >
            <svg className="w-6 h-6" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128z m0 85.333333c66.133333 0 128 23.466667 179.2 59.733334L273.066667 691.2C236.8 640 213.333333 578.133333 213.333333 512c0-164.266667 134.4-298.666667 298.666667-298.666667z m0 597.333334c-66.133333 0-128-23.466667-179.2-59.733334l418.133333-418.133333C787.2 384 810.666667 445.866667 810.666667 512c0 164.266667-134.4 298.666667-298.666667 298.666667z" fill="#D50000"></path></g></svg>
            </button>          
          )}
        
        </div>
        
      </div>              
 
      )
}