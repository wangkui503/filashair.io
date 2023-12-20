'use client';
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"
import React, { useEffect, useState, FormEvent } from 'react'
import { useCounter } from "@/components/context/context";
import ContactsList from "./contactsList";
import ContactsNew from "./contactsNew";
import ContactsSearchResultList from "./contactsSearchResultList";
import XferStorages from "../xferStorage/XferStorages";
import { uniqueByKey } from "@/lib/unique";
import { tabSwitch } from "@/lib/tab";

export default function Contacts({title, showOff, funcs, back, omitDel}) {
  const [count, setCount] = useCounter();
  const { data: session, status } = useSession()
  
  const [list, setList] = useState([]);

  const [searchResultList, setSearchResultList] = useState([]);


  const [selectedStorage, setSelectedStorage] = useState();


  async function selectCurrentStorage(storage) {
    setSelectedStorage(storage)
    tabSwitch(title+"contactsNewRef", 'auto') 
  }
  

  
  return (
    <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
  
  <div id={title+"contactsListRef"} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <ContactsList session={session} list={list} setList={setList} searchResultList={searchResultList} setSearchResultList={setSearchResultList} title={title} showOff={showOff} funcs={funcs} back={back} omitDel={omitDel}/>
  </div>
{
  session?.user?.role === 'admin' ? (
    <>
  <div id={title+"contactsNewRef"} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <ContactsNew selectedStorage={selectedStorage} title={title} session={session} list={list} setList={setList} back="contactsListRef"/>
  </div>

  <div id={title+"contactsStorageListRef"} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <XferStorages showOff={true} funcs={[{name: 'Select', action: selectCurrentStorage}]} title="Invite new member" back={title+"contactsNewRef"}/>
  </div>
  </>
  ) : ''
}

  <div id={title+"contactsSearchResultListRef"} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <ContactsSearchResultList session={session} list={searchResultList} title={title} showOff={showOff} funcs={funcs} back={back}/>
  </div>

  

</div>
        
        
  
  );
  }

