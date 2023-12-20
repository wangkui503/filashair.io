'use client'
var pathlib = require('path');
import { useCounter } from "@/components/context/context";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { Chart } from "react-google-charts";
import { useRouter } from "next/navigation";
import XferJobList from "./xferJob/xferJobList";
import XferJobResultList from "./xferJob/xferJobResultList";
import Files from "./files";
import { uniqueByKey } from "@/lib/unique";
import { getFilesResource } from "@/lib/getXferAccount";



export default function FilesPage({currentPath, setCurrentPath, title, showOff, funcs, back}) {
  const { data: session, status } = useSession()

  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const mount = curmount?.mount
  const token = curmount?.token

  
  const [currentJob, setCurrentJob] = useState()


  
      
  
  

  const [allFiles, setAllFiles] = useState();  

  

  

      return (
        <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
          <div id={title+'filesListRef'} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <Files currentPath={currentPath} setCurrentPath={setCurrentPath} title={title} showOff={showOff} funcs={funcs} back={back}/>
          </div>
          <div id={title+'xferJobListRef'} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
            <XferJobList title={title} setCurrentJob={setCurrentJob} back={back}/>
          </div>
          <div id={title+'xferJobResultListRef'} className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
          <XferJobResultList currentPath={currentPath} setCurrentPath={setCurrentPath} title={title} currentJob={currentJob} showOff={showOff} funcs={funcs} back={back}/>
          </div>          
      </div>
      
      );

}