'use client';
import SignOut from "@/components/sign-out";
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import SharesXfer from "./sharesXfer";
import SharesNetwork from "./sharesNetwork";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import SharesSharedToMe from "./sharesSharedToMe";
import SharesSharedByMe from "./sharesSharedByMe";
import SharesNew from "./sharesNew";

export default function SharesTab() {
  const [currentShare, setCurrentShare] = useState();
  const [currentSharedMeta, setCurrentSharedMeta] = useState({meta:{}});
  const [currentShared, setCurrentShared] = useState();
  const [sharedUsers, setSharedUsers] = useState();
  const [userList, setUserList] = useState([]);
  
  const { data: session, status } = useSession()

  const [shareds, setShareds] = useState([]);
  const [sharedsToMe, setSharedsToMe] = useState([]);
  const [xferShareslist, setXferSharesList] = useState([]);  

  if (session?.user) {  
  return (

    
  
    
    


    <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
    {/* <div className="w-full flex flex-wrap">
    home - {curmount?.mount?.host} - {curmount?.mount?.username} 
  </div> */}

  
  <div id='sharedToMeRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
  <SharesSharedToMe sharedsToMe={sharedsToMe} setSharedsToMe={setSharedsToMe} currentSharedMeta={currentSharedMeta}/>
  </div>

  <div id='sharedByMeRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
<SharesSharedByMe sharedsToMe={sharedsToMe} setSharedsToMe={setSharedsToMe} shareds={shareds} setShareds={setShareds} currentSharedMeta={currentSharedMeta} setCurrentSharedMeta={setCurrentSharedMeta}/>
</div>

    <div id='shareMenuRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
        <SharesXfer xferShareslist={xferShareslist} setXferSharesList={setXferSharesList} sharedsToMe={sharedsToMe} setSharedsToMe={setSharedsToMe} shareds={shareds} setShareds={setShareds} currentSharedMeta={currentSharedMeta} setCurrentSharedMeta={setCurrentSharedMeta}/>
        </div>

        

  <div id='shareNetworkRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
  <SharesNetwork sharedsToMe={sharedsToMe} setSharedsToMe={setSharedsToMe} shareds={shareds} setShareds={setShareds} currentSharedMeta={currentSharedMeta} setCurrentSharedMeta={setCurrentSharedMeta} back={"shareMenuRef"}/>
  </div>

  
  <div id='shareNewRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
  <SharesNew xferShareslist={xferShareslist} setXferSharesList={setXferSharesList} currentSharedMeta={currentSharedMeta} setCurrentSharedMeta={setCurrentSharedMeta} userList={userList} setUserList={setUserList} title="Shares" back={"shareMenuRef"} forward={"shareMembershipRef"}/>
  </div>

  
  </div>
  );
  }
}
