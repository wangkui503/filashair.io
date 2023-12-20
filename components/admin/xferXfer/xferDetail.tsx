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
import SpeedCh from '../speedCh';

export default function XferDetail({detailTransfer, back}) {    
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const sourcesRef = useRef<HTMLInputElement | null>(null);
  const destsRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);


  if (!detailTransfer) return
  
  console.log("detailTransfer---", detailTransfer)

  return (
    <div className="px-3 w-full bg-white  ">
      <div className="w-full gap-4 flex flex-row py-4">
        <button
        className="block w-6 h-6 text-center text-xl leading-0 text-gray-400 md:hover:text-gray-900 transition-colors"
        onClick={()=>tabSwitch(back, 'auto')}
        >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </button>
      <div>
        Transfer Detail - {detailTransfer?.direction} - {detailTransfer?.status}
      </div>
      </div>
      

        <div className="flex flex-row w-full">          
        </div>
        <div className="flex flex-row w-full">
        {detailTransfer?.direction}
        </div>
        <div className="flex flex-row w-full">
        {detailTransfer?.specs}
        </div>
        <div className="flex flex-row w-full">
        {detailTransfer?.statuses}
        </div>
        <div className="flex flex-row w-full">
        {detailTransfer?.avgPercentage}
        </div>
  
    
        <div className="flex flex-row w-full">
        <p>{detailTransfer.spec?.dest?.share}</p>                
        <p>{detailTransfer.spec?.dest?.path}</p>
        </div>
        
        <div className="flex flex-row w-full">
        <p>{detailTransfer.spec?.source?.share}</p>
        {
          detailTransfer.spec?.source?.paths?.map((path, i) => {
            return (
              <p key={i}> {path}</p>
            )
          })
        }
        </div>



        <div className="w-full">      
<SpeedCh xfer={detailTransfer}/>
</div>


  

        </div>

        
        
  
  );
  }
