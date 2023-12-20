'use client'
import { useCounter } from "@/components/context/context";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { uniqueByKey } from "@/lib/unique";
import XferXfer from "./XferXfer";
import XferDetail from "./xferDetail";



export default function XferPage() {
  const { data: session, status } = useSession()

  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token

  
  const [detailTransfer, setDetailTransfer] = useState()

      return (
        <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
          <div id={'xferListRef'} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferXfer setDetailTransfer={setDetailTransfer}/>
          </div>
          <div id={'xferDetailRef'} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferDetail detailTransfer={detailTransfer} back='xferListRef'/>
          </div>          
      </div>
      
      );

}