'use client';
var pathlib = require('path');
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useCounter } from "@/components/context/context";
import ReplyMessage from "./replyMessage";
import SentMessages from "./sentMessages";
import { checkSourceDuplicate, checkDestDuplicate } from "@/lib/duplicate";
import CreateMessage from "./createMessage";
import ReceivedMessages from "./receivedMessages";
import ReceiveMessageDetail from "./receiveMessageDetail";
import SendMessageDetail from "./sendMessageDetail";
import { uniqueByKey } from "@/lib/unique";
import FilesPage from "../files/page";
import Contacts from "../contacts/contacts";


export default function Messages({currentPath, setCurrentPath}) {    
  const messagesPageRef = useRef<HTMLDivElement | null>(null);
  const filesPanelRef = useRef<HTMLDivElement | null>(null);
  const createMessageRef = useRef<HTMLDivElement | null>(null);
  const replyMessage = useRef<HTMLDivElement | null>(null);

  const [count, setCount] = useCounter();

  const { data: session, status } = useSession()
  const [loaded, setLoaded] = useState(false);

  const [pathStore, setPathStore] = useState({paths:{}});

  const [msgDrawer, setMsgDrawer] = useState({meta:{}});

  const [sendList, setSendList] = useState([]);  

  const [detailReceiveMessage, setDetailReceiveMessage] = useState();
  const [detailSendMessage, setDetailSendMessage] = useState();

  
  const [sendingMessages, setSendingMessages] = useState([]);
  
  
  const [pollingXfers, setPollingXfers] = useState({meta:{}});

  
  function addCreateMessageSource(session, curmount, parentPath, file) {
    msgDrawer.meta.messageDrawer = msgDrawer.meta.messageDrawer?? {}
    addSource(msgDrawer.meta.messageDrawer, session, curmount, parentPath, file)
  }
  function addReplyMessageSource(session, curmount, parentPath, file) {
    msgDrawer.meta.replyDrawer = msgDrawer.meta.replyDrawer?? {}
    if (msgDrawer.meta.replyDrawer.original.direction === 'download') {
      toast.error('It is download invite.')
      return
    }
    addSource(msgDrawer.meta.replyDrawer, session, curmount, parentPath, file)
  }

  function addSource(messageDrawer, session, curmount, parentPath, file) {
    const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
    const key = curmount?.mount?.id+curshare?.id
    const path = parentPath + file.name + '/';      

    messageDrawer.dests = messageDrawer?.dests?? []
    messageDrawer.sources = messageDrawer?.sources?? []

    const sources = messageDrawer.sources 
    
    const dests = messageDrawer.dests
    
    if (checkSourceDuplicate(sources,key,path)) {
      toast.error("already in source");
      return
    }
    
    if (checkDestDuplicate(dests,key+path)) {
      toast.error("already in dest");
      return
    }

    
    const source = sources.filter((source)=>source.key == key)[0]?? {}
    source.paths = source.paths?? []
    source.paths.push({file: file, path:path})
    if (!sources.filter((source)=>source.key == key)[0]) {
      source.key = key
      source.mount_id =  curmount?.mount?.id
      source.host = curmount?.mount?.host
      source.xfer_addr = curmount?.mount?.xfer_addr
      source.username = curmount?.mount?.username
      source.share = curshare?.id
      sources.push(source)
    }

    setMsgDrawer({
      meta: msgDrawer.meta
    })
    toast.success('added ' + file.name)
  }


  function addCreateMessageDest(session, curmount, parentPath, file) {
    const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
    const key = curmount?.mount?.id + curshare?.id    
    const path = parentPath + file.name + '/';
    msgDrawer.meta.messageDrawer = msgDrawer.meta.messageDrawer?? {}

    const sources = msgDrawer.meta.messageDrawer.sources     
    const dests = msgDrawer.meta.messageDrawer.dests    
    
    if (checkSourceDuplicate(sources,key,path)) {
      toast.error("already in source");
      return
    }

    if (checkDestDuplicate(dests,key+path)) {
      toast.error("already in dest");
      return
    }

    if (sources?.length > 0) {    
      toast.error("friend and source exist");
      return
    }

    addDest(msgDrawer.meta.messageDrawer, session, curmount, parentPath, file)
  }
  function addReplyMessageDest(session, curmount, parentPath, file) {
    if (msgDrawer.meta.replyDrawer.original.direction === 'upload') {
      toast.error('It is upload invite.')
      return
    }

    const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
    const key = curmount?.mount?.id + curshare?.id    
    const path = parentPath + file.name + '/';      
    msgDrawer.meta.replyDrawer = msgDrawer.meta.replyDrawer?? {}

    const sources = msgDrawer.meta.replyDrawer.sources     
    const dests = msgDrawer.meta.replyDrawer.dests    
    
    if (checkSourceDuplicate(sources,key,path)) {
      toast.error("already in source");
      return
    }

    if (checkDestDuplicate(dests,key+path)) {
      toast.error("already in dest");
      return
    }

    
    addDest(msgDrawer.meta.replyDrawer, session, curmount, parentPath, file)
  }

  
  function addDest(messageDrawer, session, curmount, parentPath, file) {
    const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
    const path = parentPath + file.name + '/';      
    const key = curmount?.mount?.id + curshare?.id    
    
    messageDrawer.dests = messageDrawer?.dests?? []
    messageDrawer.sources = messageDrawer?.sources?? []

    const sources = messageDrawer.sources 
    
    const dests = messageDrawer.dests
    


    dests.push({
      key: key + path,
      mount_id: curmount?.mount?.id,
      host: curmount?.mount?.host,
      xfer_addr: curmount?.mount?.xfer_addr,
      username: curmount?.mount?.username,
      share: curshare?.id,
      path: path,
      file: file
    })

    setMsgDrawer({
      meta: msgDrawer.meta
    })
    toast.success('added ' + file.name)
  }

  async function getUserWithMount(email) {
    const res = await fetch("/api/network/" + email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },      
    });

      if (res.status === 200) {
        //toast.success("Retrieving user...");            
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
        return
      }

      const user = await res.json()
      console.log("full user-----", user)
      return user
  }

  async function addFriend(user) {
    if (!user.inbox?.share) {
      toast.error("Inbox is not set")
      return
    }
    user = await getUserWithMount(user.email)
    console.log("full user-----", user)

    if (!user) {
      toast.error("no such user: " + user.email);
      return
    }

    /* if (!user.inbox) {
      toast.error(user.email + " hasn't setup inbox.");
      return
    }
 */

    msgDrawer.meta.messageDrawer = msgDrawer.meta.messageDrawer?? {}
    msgDrawer.meta.messageDrawer.friends = msgDrawer.meta.messageDrawer?.friends?? []

    const exist = msgDrawer.meta.messageDrawer.friends.filter((friend) => friend.email === user.email)[0]
    if (exist) {
      toast.success(user.email + " is already in");
      return
    }
    msgDrawer.meta.messageDrawer.friends.push(user);
    toast.success(user.email + " is added");
    console.log("friend user----", user)
    setCount({
      meta: count.meta
    })
  }


  const [createMessageCurrentPath, setCreateMessageCurrentPath] = useState({meta:'/'});  
  const [replyMessageCurrentPath, setReplyMessageCurrentPath] = useState({meta:'/'});  

  
  
  return (
    
    <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
 <div id="receivedMessages" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <ReceivedMessages currentPath={currentPath} setCurrentPath={setCurrentPath} msgDrawer={msgDrawer} setMsgDrawer={setMsgDrawer} setDetailReceiveMessage={setDetailReceiveMessage}/>
  </div> 


  <div id="sentMessages" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
  <SentMessages sendList={sendList} setSendList={setSendList} msgDrawer={msgDrawer} setMsgDrawer={setMsgDrawer} setDetailSendMessage={setDetailSendMessage}/>
  </div> 

  


<div ref={replyMessage} id="replyMessage" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
<ReplyMessage addNewMessage={(message)=> setSendList([message, ...sendList])} sendingMessages={sendingMessages} setSendingMessages={setSendingMessages} msgDrawer={msgDrawer} setMsgDrawer={setMsgDrawer} back={'receivedMessages'}/>
</div>

<div id="replyFilesMessage" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
<FilesPage currentPath={replyMessageCurrentPath} setCurrentPath={setReplyMessageCurrentPath} title="Comm" showOff={true} funcs={[{name: 'Source', action: addReplyMessageSource}, {name: 'Dest', action: addReplyMessageDest}]} back={'replyMessage'}/>
</div>


<div ref={createMessageRef} id="createMessageRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
<CreateMessage addNewMessage={(message)=> setSendList([message, ...sendList])} sendingMessages={sendingMessages} setSendingMessages={setSendingMessages} msgDrawer={msgDrawer} setMsgDrawer={setMsgDrawer} back={'receivedMessages'}/>
</div>

<div id="messageNetworkRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
<Contacts title="Comm" showOff={true} funcs={[{name: 'Add', action: addFriend}]} back={'createMessageRef'}/>
</div>

<div id="createMessageFilesRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
  <FilesPage currentPath={createMessageCurrentPath} setCurrentPath={setCreateMessageCurrentPath} title="Comm" showOff={true} funcs={[{name: 'Source', action: addCreateMessageSource}, {name: 'Dest', action: addCreateMessageDest}]} back={'createMessageRef'}/>
</div>

<div id="receveMessageDetailRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
<ReceiveMessageDetail detailReceiveMessage={detailReceiveMessage} back={'receivedMessages'}/>
</div>

<div id="sendMessageDetailRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
<SendMessageDetail detailSendMessage={detailSendMessage} back={'sentMessages'}/>
</div>


  
</div>

  
  );
  }

