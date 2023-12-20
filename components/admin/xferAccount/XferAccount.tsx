'use client'

import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import XferAccountPluggedList from "./xferAccountPluggedList";
import XferAccountUnpluggedList from "./xferAccountUnpluggedList";
import XferAccountPlug from "./XferAccountPlug";
import XferAccountNew from "./XferAccountNew";



export default function XferAccount() {
  const xferAddrRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  
  const { data: session, status } = useSession()
  const submitButtonText = 'Submit'
  const submittedButtonText = 'Submitted'
  const submittingButtonText = 'Submitting...'
  const submitButtonDelay = 1000
  
  
  const [list, setList] = useState([]);  
  const [pluggedList, setPluggedList] = useState([]);
  const [currentUser, setCurrentUser] = useState();  
      

      return (
        <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
          <div id='xferAccountPluggedListRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferAccountPluggedList list={pluggedList} setList={setPluggedList}/>
          </div>
          <div id='xferAccountUnpluggedListRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferAccountUnpluggedList setCurrentUser={setCurrentUser} list={list} setList={setList}/>
          </div>
          <div id='xferAccountPlugRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferAccountPlug list={pluggedList} setList={setPluggedList} currentUser={currentUser} setCurrentUser={setCurrentUser} back={'xferAccountPluggedListRef'}/>
          </div>
          <div id='xferAccountNewRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferAccountNew list={list} setList={setList} back={'xferAccountUnpluggedListRef'}/>
          </div>
      </div>
      
      );

}