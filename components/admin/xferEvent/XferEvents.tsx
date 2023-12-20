'use client'

import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import XferEventList from "./xferEventList";
import { useCounter } from "@/components/context/context";
import { uniqueByKey } from "@/lib/unique";



export default function XferEvents() {
  
  

      return (
        <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
          <div id='xferStorageListRef' className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferEventList/>
          </div>          
      </div>
      
      );

}