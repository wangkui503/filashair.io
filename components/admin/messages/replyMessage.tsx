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
import SpeedChart from '../speedChart';
import {  uploadSpecData, downloadSpecData } from '@/lib/getToken';
import ReplyMessagesNav from './replyMessageNav';
import { sherr } from '@/lib/errors';

export default function ReplyMessage({addNewMessage, sendingMessages, setSendingMessages, msgDrawer, setMsgDrawer, back}) {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const selfRef = useRef<HTMLDivElement | null>(null);
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const expireRef = useRef<HTMLInputElement | null>(null);

  const [resumeLevel, setResumeLevel] = useState('')

  const [progresses, setProgresses] = useState({meta: []});
  const [runningTransfer, setRunningTransfer] = useState({meta:null});

  const curmount = msgDrawer.meta?.[msgDrawer.meta?.curmountid]
  const mount = curmount?.mount
  const shareid = curmount?.curshareid
  const filesPanelKey = mount?.id+shareid+'/'

  console.log("filesPanelKey------", filesPanelKey)

  const [progTime, setProgTime] = useState();
  const [title, setTitle] = useState([]);
  const [row, setRow] = useState([]);
  const [xferProgresses, setXferProgresses] = useState({meta:{done: 0, progresses: []}});
  
  
  const { data: session, status } = useSession()


  

  function removeSourcePath(key, path) {
    if (msgDrawer.meta.replyDrawer.original?.direction == 'download') {
      return
    }

    const source = msgDrawer.meta.replyDrawer?.sources.filter((source)=>source.key===key)[0]
    if (!source) return
    source.paths = source.paths.filter(function(item) {
      return item.path !== path
    })
    if (source.paths.length < 1) {
      const replyDrawer = msgDrawer.meta.replyDrawer
      replyDrawer.sources = replyDrawer?.sources?.filter(function(item) {
        return item.key !== key
      })
    }
    setMsgDrawer({
      meta: msgDrawer.meta
    })
  }

  function removeDestPath(key) {
    if (msgDrawer.meta.replyDrawer.original?.direction == 'upload') {
      return
    }
    const replyDrawer = msgDrawer.meta.replyDrawer
    replyDrawer.dests = replyDrawer?.dests?.filter(function(dest) {
      return dest.key !== key
    })
    setMsgDrawer({
      meta: msgDrawer.meta
    })
  }


  
  async function postTransfer(data) {
    console.log("postTransfer-----", data)
    const host = data.spec.action === 'upload' ? data.spec.source.host : data.spec.dest.host;
    const token = data.spec.action === 'upload' ? data.spec.source.token : data.spec.dest.token;
    
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
        return
      } 
      const result = await res.json()
      console.log("postTransfer result--", result)
    })
  }

  async function messaging(direction, subject, content, specs) {
    if(isNaN(Number(expireRef.current?.value))) {
      toast.error('Number only for the token expire');
      return
    }
    const nextXID = xid.next()
    const tos = msgDrawer.meta.replyDrawer.friends.map(friend => friend.email)
    const data = {
      id: "msg_"+nextXID,
      email: session?.user?.email,
      kind: 'xfer',
      status: 'posted',
      subject: subject,
      message: content,
      direction: direction,
      tos: tos.join(','),
      specs: JSON.stringify(specs),
      threadID: msgDrawer.meta.replyDrawer?.orignal?.threadID,
      expire: expireRef.current?.value
    }
    const recipients = []
    msgDrawer.meta.replyDrawer?.friends.map((to)=>{
      const data = {
        kind: 'xfer',
        status: 'posted',
        email: to.email,
        specs: JSON.stringify(specs),
      }
      recipients.push(data)
    })
    data.recipients = {
      create: recipients,
    }
    
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },      
      body: JSON.stringify(data),
    })
    
    
      if (res.status === 200) {
        const message = await res.json()
        addNewMessage(message)
        runningTransfer.meta = message
        setRunningTransfer({meta:runningTransfer.meta})     
        setSendingMessages([message, ...sendingMessages])
        console.log("messagingReply data----", message)        
        return message
      }
      sherr(res)
      const message = await res.json()
      console.log("reply messaging error --- ", message)
  }
  


async function xfer(upload) {
  if (subjectRef?.current?.value=='') {
    toast.error('subject is required');
    return
  }
  if (upload && !msgDrawer.meta.replyDrawer?.sources) {
    toast.error('Please select source files');
    return
  }
  if (!upload && !msgDrawer.meta.replyDrawer?.dests) {
    toast.error('Please select destination');
    return
  }
  console.log("subject content....", subjectRef.current?.value, contentRef.current.value)
  console.log("count.meta--------", msgDrawer.meta)
  if (upload && (!msgDrawer.meta.replyDrawer?.sources || msgDrawer.meta.replyDrawer?.sources?.length < 1)) {
    toast.error('please add sources');
    return
  }
  let direction
  const datas = []
  msgDrawer.meta.replyDrawer?.sources?.map((source) => {
    msgDrawer.meta.replyDrawer?.dests?.map((dest) => {
      if (upload) {
        direction = 'upload'
        const data = uploadSpecData(source, dest)
        if (resumeLevel != '') {
          data.spec['resume'] = resumeLevel
        }
        datas.push(data)
        console.log("upload data spec---------", data);      
      } else {
        direction = 'download'
        const data = downloadSpecData(source, dest)
        if (resumeLevel != '') {
          data.spec['resume'] = resumeLevel
        }
        datas.push(data)
        console.log("download data spec---------", data);      
      }
      
    })
  })
  await messaging(direction, subjectRef.current.value, contentRef.current.value, datas);
  doXfer(runningTransfer.meta.datas);

  }

  async function doXfer(datas) {
    datas.map((data)=>{
      postTransfer(data)
    })
    

console.log("datas--------------", datas)
runningTransfer.meta.xfers = datas
setRunningTransfer({meta: runningTransfer.meta})
  
  }


  async function reset() {
    runningTransfer.meta = null
    setRunningTransfer({meta: runningTransfer.meta})
    delete msgDrawer.meta.replyDrawer
    //setXferDrawer({meta:{}})
    console.log("reset---")
  }


  
  if (session?.user) {  
  return (
    <div id="replyMessage" className="w-full bg-white  ">
      <div ref={listRef} className="relative pb-4 bg-white ">
      <ReplyMessagesNav page="replyMessage" message={msgDrawer.meta.replyDrawer?.message}/>
      </div>

      
      <div className="flex flex-row w-full py-2">
          <div className="relative z-0 w-full mb-2 group">
            <input
              maxLength={1024}
              ref={subjectRef}              
              type="text"
              name="subject"
              id="subject"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              defaultValue={msgDrawer.meta.replyDrawer?.friends[0].email}
              disabled
            />
            <label
              htmlFor="subject"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>
        </div>
      
      <div className="flex flex-row w-full py-2">
          <div className="relative z-0 w-full mb-2 group">
            <input
              maxLength={1024}
              ref={subjectRef}              
              type="text"
              name="subject"
              id="subject"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              defaultValue={msgDrawer.meta.replyDrawer?.subject}
            />
            <label
              htmlFor="subject"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Subject
            </label>
          </div>
        </div>
        <div className="flex flex-row w-full">
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
              defaultValue={msgDrawer.meta.replyDrawer?.message}
            />
            <label
              htmlFor="msgtxt"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Comments
            </label>
          </div>
        </div>

        
        
  
    <ul className="w-full bg-white text-gray-900   ">




        {
          msgDrawer.meta.replyDrawer?.sources?.map((source, i) =>{
            return (
              <li key={i} className="w-full px-4 py-2 font-bold rounded border-y-2 border-slate-100 ">
                <div className="w-full py-2 border-b">
              {source.host} - {source.username} - {source.share}
              </div>
              

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


              <div>
                {
                source.paths.map((item, i)=>{
                  return (
                  







<div key={i} className="font-semibold w-full grid md:grid-cols-8 justify-start rounded-lg md:hover:shadow md:hover:bg-blue-300">
<div className="flex flex-row md:col-span-3 justify-start py-1 leading-normal overflow-x-auto">
        <div 
        className="px-1 w-full tracking-tight text-gray-900 ">
        {item.path}
        
    </div>        
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="text-gray-700">
    {item.file?.type}
    </p>
  </div>
  
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="text-gray-700">
    {item.file?.size}
    </p>
  </div>
  <div className="flex flex-col md:col-span-2 justify-start p-3 leading-normal">
    <p className="text-gray-700">
    {item.file?.mtime}
    </p>
  </div>
  {
    (msgDrawer.meta.replyDrawer.original?.direction == 'download') ?'' :(

    
  <div className="flex flex-col justify-start p-3 leading-normal">
    <button 
    onClick={() => removeSourcePath(source.key, item.path)}
    className="text-gray-700">
    Remove
    </button>
  </div>
  )
  }
  
</div>   





















                  )
                })
                }
              </div>
              </li>
              
              
              
              
            )
          })
        }

        {
          msgDrawer.meta.replyDrawer?.dests?.map((dest, i) => {
            return (
        <li key={i} className="w-full px-4 mt-8 py-2 bg-sky-100 border-b border-gray-200 rounded-t-lg ">
Dest: {dest.host} - {dest.username} - {dest.share}



        <div className="w-full grid md:grid-cols-8 justify-start border-b rounded md:hover:shadow-lg md:hover:bg-slate-200">

<div className="flex flex-row md:col-span-3 justify-start p-3 leading-normal overflow-x-auto">
        <div 
        
        className="w-full font-semibold tracking-tight text-gray-900 ">
        <input
    type="text"
    id="max_rate"
    className="p-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full   "
    placeholder={dest.path}
    required
    value={dest.path}
  />
        
    </div>        
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file?.type}
    </p>
  </div>
  
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file?.size}
    </p>
  </div>
  <div className="flex flex-col md:col-span-2 justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file?.mtime}
    </p>
  </div>
  {
    (msgDrawer.meta.replyDrawer.original?.direction == 'upload') ? '' : (

    
  <div className="flex flex-col justify-start p-3 leading-normal">
    <button 
    onClick={() => removeDestPath(dest.key)}
    className="font-normal text-gray-700">
    Remove
    </button>
  </div>
    )
  }
  
</div>   




        </li>
          )})
}
        </ul>


      

<div className="flex flex-wrap w-full gap-4 py-4">
  <div className="border-b p-2">
    <div className="py-2">
      Resume level
    </div>
    <div className="flex fle-wrap gap-4">
    <input 
    checked={resumeLevel==''}
    onChange={(e)=>setResumeLevel('')}
    className="w-5 h-5 my-1" type="radio" id="reply_overwrite" name="reply_resume" defaultChecked/>
    <label htmlFor="reply_overwrite">Overwrite</label>
    <input 
    checked={resumeLevel=='size'}
    onChange={(e)=>setResumeLevel('size')}
    className="w-5 h-5 my-1" type="radio" id="reply_size" name="reply_resume"/>
    <label htmlFor="reply_size">Size</label>
    <input 
    checked={resumeLevel=='attr'}
    onChange={(e)=>setResumeLevel('attr')}
    className="w-5 h-5 my-1" type="radio" id="reply_attr" name="reply_resume"/>
    <label className="whitespace-nowrap" htmlFor="reply_attr">Size & Time</label>
    <input 
    checked={resumeLevel=='partial'}
    onChange={(e)=>setResumeLevel('partial')}
    className="w-5 h-5 my-1" type="radio" id="reply_partial" name="reply_resume"/>
    <label htmlFor="reply_partial">Partial</label>
    </div>
  </div>

  <div className="border-b p-2">
      <div className="py-2">
        Token expire
      </div>
      <div className="flex fle-wrap gap-4">
        <input 
        ref={expireRef}
        defaultValue="240"
        className="w-10" type="text" id="expire"/>
        <label htmlFor="expire">hours</label>
      </div>
    </div>
</div>


  {
    (msgDrawer.meta.replyDrawer?.original?.direction == 'upload') ? 
    (
      <div className="flex flex-row">
      <div className="flex items-center">
      <button 
      onClick={() => xfer(true)}
      className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">
        upload
        </button>
      </div>      
  </div>
    ) : 
    (msgDrawer.meta.replyDrawer?.original?.direction == 'download') ? (
      <div className="flex items-center">
      <button 
      onClick={() => xfer(false)}
      className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">
        download
        </button>
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
