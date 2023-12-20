'use client';
var pathlib = require('path');
import 'react-circular-progressbar/dist/styles.css';
import { Chart } from "react-google-charts";
import { fetchNdjson } from '@/lib/fetchNdjson';
const xid = require('xid-js');
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useCounter } from "@/components/context/context";
import { tabSwitch } from "@/lib/tab";
import { uploadSpecData, downloadSpecData } from "@/lib/getToken";
import SpeedChart from '../speedChart';
import CreateMessagesMenu from './createMessageMenu';
import { sherr } from '@/lib/errors';

export default function CreateMessage({addNewMessage, sendingMessages, setSendingMessages, msgDrawer, setMsgDrawer, back}) {    
  const listRef = useRef<HTMLDivElement | null>(null);
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const sourcesRef = useRef<HTMLInputElement | null>(null);
  const destsRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const expireRef = useRef<HTMLInputElement | null>(null);

  const [resumeLevel, setResumeLevel] = useState('')

  
  const [progTime, setProgTime] = useState();
  const [title, setTitle] = useState([]);
  const [row, setRow] = useState([]);
  const [xferProgresses, setXferProgresses] = useState({meta:{done: 0, progresses: []}});
  
  
  const [runningTransfer, setRunningTransfer] = useState({meta:null});
  
  const { data: session, status } = useSession()

  function clearFriends() {
    const messageDrawer = msgDrawer.meta.messageDrawer
    messageDrawer.friends = []
    setMsgDrawer({
      meta: msgDrawer.meta
    })
  }

  function removeFriend(friend) {
    const messageDrawer = msgDrawer.meta.messageDrawer
    messageDrawer.friends = msgDrawer.meta.messageDrawer?.friends.filter((item)=>{
      return item.email !== friend.email
    })
    setMsgDrawer({
      meta: msgDrawer.meta
    })
  }

  

  function removeSourcePath(key, path) {
    const source = msgDrawer.meta.messageDrawer?.sources.filter((source)=>source.key===key)[0]
    if (!source) return
    source.paths = source.paths.filter(function(item) {
      return item.path !== path
    })
    if (source.paths.length < 1) {
      const messageDrawer = msgDrawer.meta.messageDrawer
      messageDrawer.sources = messageDrawer?.sources?.filter(function(item) {
        return item.key !== key
      })
    }
    setMsgDrawer({
      meta: msgDrawer.meta
    })
  }

  function removeDestPath(key) {
    const messageDrawer = msgDrawer.meta.messageDrawer
    messageDrawer.dests = messageDrawer?.dests?.filter(function(dest) {
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

  async function messagingSend(direction, subject, message, specs, recipientXfers, msgid) {
    if(isNaN(Number(expireRef.current?.value))) {
      toast.error('Number only for the token expire');
      return
    }
    const tos = msgDrawer.meta.messageDrawer?.friends?.map((friend)=>friend.email);
    const kind = 'xfer'
    const nextXID = xid.next()
    const data = {
      id: msgid,
      email: session?.user?.email,
      kind: kind,
      status: 'posted',
      subject: subject,
      message: message,
      direction: direction,
      tos: tos.join(','),
      specs: JSON.stringify(specs),
      threadID: "thrd_"+nextXID,
      expire: expireRef.current?.value
    }
    const recipients = []
    const xferemails = msgDrawer.meta.messageDrawer?.friends?.filter((friend)=>friend.inbox != null)?.map((friend)=>friend.email);
    xferemails.map((to)=>{
      const data = {
        kind: kind,
        status: 'posted',
        email: to,        
        specs: JSON.stringify(recipientXfers[to]),
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
        console.log("messagingSend data----", message)        
        return message
      } else {
        const specs  = await res.json();
        toast.error('failed to create message: ' + res.status);
        console.log("messagingSend data-error---", specs)
      }
  }

  async function messagingInvite(direction, subject, message, specs) {
    if(isNaN(Number(expireRef.current?.value))) {
      toast.error('Number only for the token expire');
      return
    }
    const tos = msgDrawer.meta.messageDrawer?.friends?.map((friend)=>friend.email);
    const kind = 'invite'
    const nextXID = xid.next()
    const data = {
      id: "msg_"+nextXID,
      email: session?.user?.email,
      kind: kind,
      status: 'completed',
      subject: subject,
      message: message,
      direction: direction,
      tos: tos.join(','),
      specs: JSON.stringify(specs),
      threadID: "thrd_"+nextXID,
      expire: expireRef.current?.value
    }
    const recipients = []
    tos.map((to)=>{
      const data = {
        kind: kind,
        status: 'completed',
        email: to,        
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
        const result = await res.json()
        console.log("messagingInvite data----", result)        
        toast.success('Invite sent')
        return result
      }
      sherr(res)
      const result = await res.json()
      console.log("messagingInvite data-error---", result)        
  }

  


  function addFriendDest(friends) {
    const friendDests = []
    friends.map((user) => {
      friendDests.push({
        friend: user.email,
        mount_id: user?.inbox?.mount?.id,
        host: user?.inbox?.mount?.host,
        xfer_addr: user?.inbox?.mount?.xfer_addr,
        username: user?.inbox?.mount?.username,
        share: user?.inbox?.share,
        share_kind: "inbox",
        path: user?.inbox?.path,      
        file: {
          name: user?.inbox?.path,
          type: '',
          size: '',
          mtime: ','
        }
      })
    })    
    return friendDests
  }

  async function packSend() {
    const msgid = "msg_"+xid.next()
    const friendDests = addFriendDest(msgDrawer.meta.messageDrawer?.friends);
    const datas = []
    const recipientXfers = {}
    msgDrawer.meta.messageDrawer?.sources?.map((source) => {
      friendDests.map((dest) => {
         if (!dest.mount_id) {
          return;
        } 
        const data = uploadSpecData(source, dest)
        data.spec.dest.path = pathlib.join(data.spec.dest.path, msgid)
        data.spec.dest.friend = dest.friend
        recipientXfers[dest.friend] = recipientXfers[dest.friend] ?? []
        recipientXfers[dest.friend].push(data)
        if (resumeLevel != '') {
          data.spec['resume'] = resumeLevel
        }
        datas.push(data)
        console.log("packSend data spec---------", data);        
      })
    })
    console.log("packSend----", recipientXfers, datas)    
    await messagingSend('upload', subjectRef.current.value, contentRef.current.value, datas, recipientXfers, msgid);
    if (datas.length > 0) {
      doXfer(runningTransfer.meta.datas);
    }
  }

  async function packInvite(upload) {
    if (subjectRef.current.value=='') {
      toast.error('subject is required');
      return
    }
    let direction
    const friendDests = addFriendDest(msgDrawer.meta.messageDrawer?.friends);
    const datas = []
    if (upload) {
      direction = 'upload'
      msgDrawer.meta.messageDrawer?.dests?.map((dest) => {
        dest.share_kind = "invite"
        const data = uploadSpecData(null, dest)
        if (resumeLevel != '') {
          data.spec['resume'] = resumeLevel
        }
        datas.push(data)
        console.log("upload data spec---------", data);              
      })
    } else {
      direction = 'download'
      msgDrawer.meta.messageDrawer?.sources?.map((source) => {
        source.share_kind = "invite"
        const data = downloadSpecData(source, null)
        if (resumeLevel != '') {
          data.spec['resume'] = resumeLevel
        }
        datas.push(data)
        console.log("download data spec---------", data);                                            
      })
    }
    console.log("packInvite----", upload, datas)
    messagingInvite(direction, subjectRef.current.value, contentRef.current.value, datas);
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
    delete msgDrawer.meta.messageDrawer
    //setXferDrawer({meta:{}})
    console.log("reset---")
  }

  
  

  if (session?.user) {  
  return (
    <div className="px-3 w-full bg-white  ">
      <div ref={listRef} className="relative pb-4 bg-white ">
      <CreateMessagesMenu page="createMessageRef" message={msgDrawer.meta.replyDrawer?.message}/>
      </div>

      

        <div className="flex flex-row relative">
            <div className="overflow-x-auto relative flex flex-row z-0 w-full border-b-2 my-4 group">
            
              <div
              id="email"
                className="flex flex-row block py-2 bg-transparent appearance-none peer"                
              >
               {
                msgDrawer.meta.messageDrawer?.friends?.length > 0 ? (
                  <button 
                  onClick={clearFriends}
                  className="block w-6 h-6 ml-4 text-center text-xl leading-0  text-gray-400 md:hover:text-gray-900 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Undo"> <path id="Vector" d="M10 8H5V3M5.29102 16.3569C6.22284 17.7918 7.59014 18.8902 9.19218 19.4907C10.7942 20.0913 12.547 20.1624 14.1925 19.6937C15.8379 19.225 17.2893 18.2413 18.3344 16.8867C19.3795 15.5321 19.963 13.878 19.9989 12.1675C20.0347 10.4569 19.5211 8.78001 18.5337 7.38281C17.5462 5.98561 16.1366 4.942 14.5122 4.40479C12.8878 3.86757 11.1341 3.86499 9.5083 4.39795C7.88252 4.93091 6.47059 5.97095 5.47949 7.36556" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                  </button>          
                ) : ''
              } 
              {
                msgDrawer.meta.messageDrawer?.friends?.map((friend, i)=>{
                  return (
                    <div key={i} className="flex flex-row px-4 border-r">
                    <span className="pr-2">{friend.name? friend.name + ' (' +friend.email + ')' : friend.email}</span>
                    <button 
                    onClick={() => removeFriend(friend)}
                    className="block w-6 h-6 text-center text-xl leading-0 text-gray-400 md:hover:text-gray-900 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 18H22M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </button>
                    </div>
                  )
                })
              }
              &nbsp;
            
              </div>
                                  
            </div>
            <label
                htmlFor="email"
                className="peer-focus:font-medium absolute top-5 text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email addresses
              </label>
            
            
        </div>
        
        <div className="flex flex-row w-full">
          <div className="relative z-0 w-full mb-4 group">
            <input
              maxLength={1024}
              ref={subjectRef}              
              type="text"
              name="subject"
              id="subject"
              className="block py-2 pr-10 w-full border-b-2 bg-transparent appearance-none peer"
              placeholder=" "
              required
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
            />
            <label
              htmlFor="msgtxt"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Message
            </label>
          </div>
        </div>

        

        
  
    <ul className="w-full bg-white text-gray-900   ">




        {
          msgDrawer.meta.messageDrawer?.sources?.map((source, i) =>{
            return (
              <li key={i} className="w-full px-4 py-2 font-bold rounded border-y-2 border-slate-100 ">
                <div className="w-full py-2 border-b">
              {source.host} - {source.username} - {source.share}
              </div>
              

              <div className="font-semibold w-full grid md:grid-cols-8 justify-start rounded-lg">
                <div className="flex flex-row md:col-span-3 justify-start py-1 leading-normal overflow-x-auto">
                      <div 
                      className="w-full tracking-tight text-gray-900 ">
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
<div className="flex flex-row md:col-span-3 justify-start py-1 leading-normal">
<p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
{item.path}
  </p>
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
  <div className="flex flex-col justify-start p-3 leading-normal">
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

        {
          msgDrawer.meta.messageDrawer?.dests?.map((dest, i) => {
            return (
        <li key={i} className="w-full px-4 mt-8 py-2 bg-sky-100 border-b border-gray-200 rounded-t-lg ">
Dest: {dest.host} - {dest.username} - {dest.share}



        <div className="w-full grid md:grid-cols-8 justify-start border-b rounded md:hover:shadow-lg md:hover:bg-slate-200">

<div className="flex flex-row md:col-span-3 justify-start p-3 leading-normal">
<p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
{dest.path}
  </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file.type}
    </p>
  </div>
  
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file.size}
    </p>
  </div>
  <div className="flex flex-col md:col-span-2 justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
    {dest.file.mtime}
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
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



  <div className="flex flex-wrap w-full gap-4 py-4">
    <div className="border-b p-2">
      <div className="py-2">
        Resume level
      </div>
      <div className="flex fle-wrap gap-4">
      <input 
      checked={resumeLevel==''}
      onChange={(e)=>setResumeLevel('')}
      className="w-5 h-5 my-1" type="radio" id="overwrite" name="message_resume" defaultChecked/>
      <label htmlFor="overwrite">Overwrite</label>
      <input 
      checked={resumeLevel=='size'}
      onChange={(e)=>setResumeLevel('size')}
      className="w-5 h-5 my-1" type="radio" id="size" name="message_resume"/>
      <label htmlFor="size">Size</label>
      <input 
      checked={resumeLevel=='attr'}
      onChange={(e)=>setResumeLevel('attr')}
      className="w-5 h-5 my-1" type="radio" id="attr" name="message_resume"/>
      <label className="whitespace-nowrap" htmlFor="attr">Size & Time</label>
      <input 
      checked={resumeLevel=='partial'}
      onChange={(e)=>setResumeLevel('partial')}
      className="w-5 h-5 my-1" type="radio" id="partial" name="message_resume"/>
      <label htmlFor="partial">Partial</label>
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
    (msgDrawer.meta.messageDrawer?.friends?.length > 0 && msgDrawer.meta.messageDrawer?.sources?.length > 0) ? 
    (
      <div className="flex flex-row">
      <div className="flex items-center">
      <button 
      onClick={packSend}
      className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">
        send
        </button>
      </div>
      <div className="flex items-center">
      <button 
      
      onClick={() => packInvite(false)}
      className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">
        invite to download
        </button>
      </div>
  </div>
    ) : ''
  }

{
    (msgDrawer.meta.messageDrawer?.friends?.length > 0 && msgDrawer.meta.messageDrawer?.dests?.length > 0) ? 
    (
      <div className="flex items-center">
  <button 
  onClick={() => packInvite(true)}
   className="text-white bg-sky-600 md:hover:bg-sky-800 font-medium rounded-lg text-sm px-4 py-2 text-center m-3 md:mr-0  ">
    invite to upload
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
