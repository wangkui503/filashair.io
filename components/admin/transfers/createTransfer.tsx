'use client';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Chart } from "react-google-charts";
import { fetchNdjson } from '@/lib/fetchNdjson';
const xid = require('xid-js');
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useCounter } from "@/components/context/context";
import { tabSwitch } from "@/lib/tab";
import {  uploadSpecData, downloadSpecData } from "@/lib/getToken";
import SpeedChart from '../speedChart';
import CreateTransferNav from './createTransferNav';

export default function CreateTransfer({addNewTransfer, runningTransfers, setRunningTransfers, xferDrawer, setXferDrawer, back}) {    
  const removeAfterRef = useRef<HTMLInputElement | null>(null);
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const subjectRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const [resumeLevel, setResumeLevel] = useState('')

  const [count, setCount] = useCounter();

  const [datas, setDatas] = useState([]);

  const { data: session, status } = useSession()

  const [runningTransfer, setRunningTransfer] = useState({meta:null});
  

  function removeSourcePath(key, path) {
    const source = xferDrawer.meta.messageDrawer?.sources?.filter((source)=>source.key===key)[0]
    if (!source) return
    source.paths = source.paths.filter(function(item) {
      return item.path !== path
    })
    if (source.paths.length < 1) {
      const transferDrawer = xferDrawer.meta.messageDrawer
      transferDrawer.sources = transferDrawer?.sources?.filter(function(item) {
        return item.key !== key
      })
    }
    setCount({
      meta: count.meta
    })
  }

  function removeDestPath(key) {
    const transferDrawer = xferDrawer.meta.messageDrawer
    transferDrawer.dests = transferDrawer?.dests?.filter(function(dest) {
      return dest.key !== key
    })
    setCount({
      meta: count.meta
    })
  }


  

  
  async function messaging(direction, message, specs) {
    const data = {
      kind: 'xfer',
      email: session?.user?.email,
      direction: direction,
      message: message,
      specs: specs,
    }
    
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },      
      body: JSON.stringify(data),
    })
    
    
      if (res.status === 200) {
        const transfer = await res.json()
        addNewTransfer(transfer)
        runningTransfer.meta = transfer
        setRunningTransfer({meta:runningTransfer.meta})     
        console.log("messaging data----", transfer)        
        
      } else {
        const specs  = await res.json();
        toast.error('failed to create transfer: ' + res.status);
        console.log("messaging data error----", specs)
      }      
  }

  
async function xfer(upload) {
  console.log("subject content....", subjectRef.current?.value, contentRef.current.value)
  console.log("count.meta--------", count.meta)
  let direction
  
  xferDrawer.meta.messageDrawer?.sources?.map((source) => {
    xferDrawer.meta.messageDrawer?.dests?.map((dest) => {
      if (upload) {
        direction = 'upload'
        const data = uploadSpecData(source, dest)        
        if (xferDrawer.meta.messageDrawer?.dests.length === 1 && removeAfterRef.current?.checked) {
          data.spec.source['remove_after'] = true
        }        
        if (resumeLevel != '') {
          data.spec['resume'] = resumeLevel
        }
        datas.push(data)
        console.log("upload data spec---------", data);      
      } else {
        direction = 'download'
        const data = downloadSpecData(source, dest)
        if (xferDrawer.meta.messageDrawer?.dests.length === 1 && removeAfterRef.current?.checked) {
          data.spec.source['remove_after'] = true
        }
        if (resumeLevel != '') {
          data.spec['resume'] = resumeLevel
        }
        datas.push(data)
        console.log("download data spec---------", data);      
      }
      
    })
  })
  setDatas([...datas])
  await messaging(direction, contentRef.current.value, datas);
  doXfer(runningTransfer.meta.datas);

  }

  async function postTransfer(data) {
    const host = data.spec.action === 'upload' ? data.spec.source.host : data.spec.dest.host;
    const token = data.spec.action === 'upload' ? data.spec.source.token : data.spec.dest.token;
    console.log("postTransfer-----", host, token, data)
    
    fetch(host + "/transfers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': token,
      },      
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status != 200) {  
        data.status = 'completed'
        toast.error('POST transfers error: ' + res.status)
        return
      } 
      const result = await res.json()
      console.log("postTransfer result--", result)
    })
  }

  async function doXfer(datas) {

    datas.map((data)=>{
      postTransfer(data)
    })
  
    
    console.log("datas--------------", datas)
  
    runningTransfer.meta.xfers = datas
    setRunningTransfer({meta: runningTransfer.meta})
    console.log("runningTransfer.meta.xfers--", runningTransfer.meta.xfers)
    
  
  }

  async function reset() {
    runningTransfer.meta = null
    setRunningTransfer({meta: runningTransfer.meta})
    delete xferDrawer.meta.messageDrawer
    //setXferDrawer({meta:{}})
    setDatas([])
    console.log("reset---")
  }


  

  if (session?.user) {  
  return (
    <div className="px-3 w-full bg-white  ">
        <div className="relative pb-4 bg-white ">
<CreateTransferNav page="createTransferRef"/>
    
  </div>

          <div className="relative z-0 w-full mb-4 group">
            <textarea
              maxLength={4096}
              rows={4}
              cols={50}
              ref={contentRef}         
              name="msgtxt"
              id="msgtxt"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              disabled={datas?.length > 0}
            />
            <label
              htmlFor="msgtxt"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Comments
            </label>
          </div>
          
        
  
        {runningTransfer.meta?.xfers?.length > 0 ? '' : (
    <ul className="w-full bg-white text-gray-900   ">

    <div className="font-semibold w-full px-4 grid md:grid-cols-8 justify-start rounded-lg">
                <div className="flex flex-row md:col-span-3 justify-start py-1 leading-normal overflow-x-auto">
                      <div 
                      className="px-1 w-full tracking-tight text-gray-900 ">
                      Path
                      
                  </div>        
                </div>
                <div className="flex flex-col justify-start p-3 leading-normal">
                  <p className="text-gray-700">
                  Kind
                  </p>
                </div>
                
                <div className="flex flex-col justify-start p-3 leading-normal">
                  <p className="text-gray-700">
                  Size
                  </p>
                </div>
                <div className="flex flex-col md:col-span-2 justify-start p-3 leading-normal">
                  <p className="text-gray-700">
                  Lasst Modified Time
                  </p>
                </div>
                <div className="flex flex-col justify-start p-3 leading-normal">
                  <button 
                  className="text-gray-700">
                  Action
                  </button>
                </div>  
              </div>  


        { 
          xferDrawer.meta.messageDrawer?.sources?.map((source, i) =>{
            return (
              <li key={i} className="w-full px-4 py-2 font-bold rounded border-y-2 border-slate-100 ">
                <div className="w-full py-2">
                {source.share_alias?? source.share + '@@' + source.mount_alias }
              </div>
              

               


              <div>
                {
                source.paths.map((item, i)=>{
                  return (
                  







<div key={i} className="font-semibold w-full grid md:grid-cols-8 justify-start rounded md:hover:shadow md:hover:bg-blue-100">


  <div className="overflow-x-auto scrollbar-hide whitespace-nowrap flex flex-row text-medium md:col-span-3 justify-start leading-normal">
    <p className="py-2 font-normal text-gray-700">
    {item.path}
      </p>                    
  </div>

  <div className="flex flex-col justify-start p-2 leading-normal">
    <p className="text-gray-700">
    {item.file?.type}
    </p>
  </div>
  
  <div className="flex flex-col justify-start p-2 leading-normal">
    <p className="text-gray-700">
    {item.file?.size}
    </p>
  </div>
  <div className="flex flex-col md:col-span-2 justify-start p-2 leading-normal">
    <p className="text-gray-700">
    {item.file?.mtime}
    </p>
  </div>
  <div className="flex flex-col justify-start p-2 leading-normal">
    <button 
    onClick={() => removeSourcePath(source.key, item.path)}
    className="text-gray-700">
    Remove
    </button>
  </div>

  
</div>   




                  )
                })
                }
              </div>
              </li>
              
              
              
              
            )
          })
        }
<br className="w-full border-2"/>
        { 
          xferDrawer.meta.messageDrawer?.dests?.map((dest, i) => {
            return (
        <li key={i} className="w-full px-4 mt-8 py-2 bg-sky-200 border-gray-200 rounded ">
          {dest.share_alias?? dest.share + '@@' + dest.mount_alias }



        <div className="w-full grid md:grid-cols-8 justify-start rounded md:hover:shadow md:hover:bg-slate-100">

  <div className="overflow-x-auto scrollbar-hide whitespace-nowrap flex flex-row text-medium md:col-span-3 justify-start leading-normal">
    <p className="py-2 font-normal text-gray-700">
      {dest.path}
      </p>    
  </div>
  <div className="flex flex-col justify-start p-2 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file?.type}
    </p>
  </div>
  
  <div className="flex flex-col justify-start p-2 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file?.size}
    </p>
  </div>
  <div className="flex flex-col md:col-span-2 justify-start p-2 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file?.mtime}
    </p>
  </div>
  <div className="flex flex-col justify-start p-2 leading-normal">
    <button 
    onClick={() => removeDestPath(dest.key)}
    className="font-normal text-gray-700">
    Remove
    </button>
  </div>
  
</div>   




        </li>
          )})
}
        </ul>
        )
}

<div className="flex flex-wrap w-full gap-4 py-4">
  <div className="border-b p-2">
    <div className="py-2">
      Resume level
    </div>
    <div className="flex fle-wrap gap-4">
    <input 
    checked={resumeLevel==''}
    onChange={(e)=>setResumeLevel('')}
    className="w-5 h-5 my-1" type="radio" id="transfer_overwrite" name="transfer_resume" defaultChecked/>
    <label htmlFor="transfer_overwrite">Overwrite</label>
    <input 
    checked={resumeLevel=='size'}
    onChange={(e)=>setResumeLevel('size')}
    className="w-5 h-5 my-1" type="radio" id="transfer_size" name="transfer_resume"/>
    <label htmlFor="transfer_size">Size</label>
    <input 
    checked={resumeLevel=='attr'}
    onChange={(e)=>setResumeLevel('attr')}
    className="w-5 h-5 my-1" type="radio" id="transfer_attr" name="transfer_resume"/>
    <label className="whitespace-nowrap" htmlFor="transfer_attr">Size & Time</label>
    <input 
    checked={resumeLevel=='partial'}
    onChange={(e)=>setResumeLevel('partial')}
    className="w-5 h-5 my-1" type="radio" id="transfer_partial" name="transfer_resume"/>
    <label htmlFor="transfer_partial">Partial</label>
    </div>
  </div>

{/* {
  xferDrawer.meta.messageDrawer?.dests?.length === 1 ? (
    <div className="border-b p-2">
    <div className="py-2">
        &nbsp;
      </div>
      <div className="flex fle-row gap-4">
        <input ref={removeAfterRef} className="w-10 h-10" type="checkbox" id="remove_after" name="remove_after"/>
        <label htmlFor="remove_after">Remove source after transfer</label>
      </div>
    </div>
  ) : ''
} */}  

</div>


       
  {
    
    (xferDrawer.meta.messageDrawer?.sources?.length > 0 && xferDrawer.meta.messageDrawer?.dests?.length > 0) ? 
    (
      <div className="flex flex-row gap-4">
      <div className="flex items-center">
      <button 
      onClick={() => xfer(true)}
      className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">
        upload
        </button>
      </div>
      <div className="flex items-center">
      <button 
      onClick={() => xfer(false)}
      className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">
        download
        </button>
      </div>
  </div>
    ) : ''
    
  }

<div className="flex items-center">
      <button 
      onClick={() => reset()}
      className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">
        reset
        </button>
      </div>
 

      

  
<div className="w-full">      
<SpeedChart xfers={runningTransfer?.meta?.xfers}/>
</div>
 














    







    










        </div>

        
        
  
  );
  }
}
