'use client'

import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import XferKeyList from "./xferKeyList";
import XferKeyPlug from "./XferKeyPlug";
import XferKeyNew from "./XferKeyNew";
import { useCounter } from "@/components/context/context";
import { uniqueByKey } from "@/lib/unique";



export default function XferKey() {

  
  
      

      return (
        <div className="w-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
          <div id='xferKeyListRef' className="snap-center w-full shrink-0">
            <XferKeyList/>
          </div>
          <div id='xferKeyPlugRef' className="snap-center w-full shrink-0">
            <XferKeyPlug back={'xferKeyListRef'}/>
          </div>
          <div id='xferKeyNewRef' className="snap-center w-full shrink-0">
            <XferKeyNew  back={'xferKeyListRef'}/>
          </div>
      </div>
      
      );

}