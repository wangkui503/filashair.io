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
import SpeedChart from '../speedChart';

export default function ReceiveMessageDetail({detailReceiveMessage, back}) {    
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const sourcesRef = useRef<HTMLInputElement | null>(null);
  const destsRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  if (!detailReceiveMessage) return
  const xfers = detailReceiveMessage?.xfers?? JSON.parse(detailReceiveMessage?.message?.specs)
  

  console.log("MessageDetail---", detailReceiveMessage)

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
        Message Detail - {detailReceiveMessage?.message.subject} - {detailReceiveMessage?.status}
      </div>
      </div>
      

        <div className="flex flex-row relative">
            <div className="overflow-x-auto relative flex flex-row z-0 w-full border-b-2 my-4 group">
            
              <div
              id="email"
                className="flex flex-row block py-2 bg-transparent appearance-none peer"                
              >
              <div className="flex flex-row border-r">
              <span className="pr-2">{detailReceiveMessage?.message.email}</span>
              </div>
              </div>
                                  
            </div>
            <label
                htmlFor="email"
                className="peer-focus:font-medium absolute top-5 text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                From
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
              value={detailReceiveMessage?.message?.subject}
              disabled
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
              value={detailReceiveMessage?.message?.message}
              disabled
            />
            <label
              htmlFor="msgtxt"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Message
            </label>
          </div>
        </div>
        


        <div className="w-full">      
        <SpeedChart xfers={xfers} status={detailReceiveMessage?.status} />
        </div>

  

        </div>

        
        
  
  );
  }
