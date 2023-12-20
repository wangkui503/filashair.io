'use client';
import SignOut from "@/components/sign-out";
import { useEffect, useState } from "react";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import { tabSwitch, gototop } from "@/lib/tab";
import { signOut } from "next-auth/react";

export default function Bottomnav({currentPage}) {    
  const [count, setCount] = useCounter();
  const { data: session, status } = useSession()

  const curmount = count.meta?.[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]

  if (curmount) {
    curmount.foreign = curmount?.mount?.email != session?.user?.email 
  }

  if (session?.user) {  
  return (
    <div id='bottomnavbar' className="fadeInUp animated w-full backdrop-blur-sm">
        <div className="relative w-full gap-4 flex whitespace-nowrap overflow-x-auto scrollbar-hide h-full font-medium lg:justify-center">
        <button 
        id="nav_home"
        onClick={()=>tabSwitch('home','auto')}
         className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group " + (currentPage==='home' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill={currentPage==='home' ?"#137ED9":"currentColor"} viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            <span className="py-1 py-1 text-sm text-slate-500 ">
              Home
              </span>
          </button>
          <button 
        id="nav_files"
        onClick={()=>{
          currentPage === 'files'? gototop('files'): tabSwitch('files','auto')          
        }}
         className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group " + (currentPage==='files' ? 'text-blue-600 border-blue-600':'')}>
          <svg className="w-7 h-7 text-slate-500 " viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill={currentPage==='home' ?"#137ED9":"currentColor"} ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>multiple-documents-files</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Icon-Set-Filled" transform="translate(-208.000000, -101.000000)" fill={currentPage==='files' ?"#137ED9":"currentColor"} > <path d="M231,109 C229.935,109 229,108.039 229,107 L229,103.031 L229,103.029 L234,109 L231,109 L231,109 Z M229,117.016 L220,117.016 C219.448,117.016 219,116.568 219,116.017 C219,115.465 219.448,115.018 220,115.018 L229,115.018 C229.552,115.018 230,115.465 230,116.017 C230,116.568 229.552,117.016 229,117.016 L229,117.016 Z M229,122.011 L220,122.011 C219.448,122.011 219,121.563 219,121.012 C219,120.46 219.448,120.013 220,120.013 L229,120.013 C229.552,120.013 230,120.46 230,121.012 C230,121.563 229.552,122.011 229,122.011 L229,122.011 Z M227,131 L212,131 C210.95,131 210,130.019 210,129 L210,109 C210,107.513 211.224,107 213,107 L213,125 C213,127.059 214.884,129 217,129 C217,129 227.842,128.989 229.009,128.989 C229.009,130.202 228.213,131 227,131 L227,131 Z M229,101.031 C228.876,101.031 217,101 217,101 C214.884,101 213,102.941 213,105 L211.845,105.027 C209.729,105.027 208,106.941 208,109 L208,129 C208,131.059 209.884,133 212,133 L227,133 C229.116,133 231,131.059 231,129 L232,129 C234.116,129 236,127.059 236,125 L236,109.023 L229,101.031 L229,101.031 Z" id="multiple-documents-files"> </path> </g> </g> </g></svg>            
            <span className="py-1 text-sm text-slate-500 ">
              Files
              </span>
          </button>

        <div className="relative px-2">
          {
            currentPage==='messages' ? (
              <button 
          className={"absolute top-0 right-0 inline-flex flex-col items-center justify-center md:hover:text-blue-600  group " + (currentPage==='messages' ? 'text-blue-600':'')}
          onClick={()=>tabSwitch('createMessageRef', 'auto')}
          >
            <svg className="w-6 h-6 text-slate-500 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill={currentPage==='messages' ?"#137ED9":"currentColor"}></path> </g></svg>            
          </button>
            ) : ''
          }
          
          <button 
        id="nav_messages"     
        onClick={()=>tabSwitch('messages','auto')}
         className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group " + (currentPage==='messages' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>send-email</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Icon-Set-Filled" transform="translate(-570.000000, -257.000000)" fill={currentPage==='messages' ?"#137ED9":"currentColor"}> <path d="M580.407,278.75 C581.743,281.205 586,289 586,289 C586,289 601.75,258.5 602,258 L602.02,257.91 L580.407,278.75 L580.407,278.75 Z M570,272 C570,272 577.298,276.381 579.345,277.597 L601,257 C598.536,258.194 570,272 570,272 L570,272 Z" id="send-email"> </path> </g> </g> </g></svg>
            <span className="py-1 text-sm text-slate-500 ">
              Comms
              </span>
          </button>
          </div>

          <div className="relative pr-2">
            {
              currentPage==='transfers' ? (
                <button 
          className={"absolute top-0 right-0 inline-flex flex-col items-center justify-center md:hover:text-blue-600  group " + (currentPage==='transfers' ? 'text-blue-600':'')}
          onClick={()=>tabSwitch('createTransferRef', 'auto')}
          >
            <svg className="w-6 h-6 text-slate-500 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill={currentPage==='transfers' ?"#137ED9":"currentColor"}></path> </g></svg>            
          </button>
              ) : ''
            }
          
        <button 
        id="nav_transfers"
        onClick={()=>tabSwitch('transfers','auto')}
         className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group " + (currentPage==='transfers' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " fill={currentPage==='transfers' ?"#137ED9":"currentColor"} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 959.759 959.76"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M239.898,953.699l307.2-308.6c12.601-12.6,3.601-34.1-14.2-34.1h-24.5c-16.699,0-26.1-19.301-15.699-32.4l162.899-205.4 c10.4-13.1,1.101-32.4-15.7-32.4h-81.899c-16.5,0-25.9-18.8-16-32L750.098,32c9.9-13.2,0.5-32-16-32h-329.1 c-7.601,0-14.601,4.3-17.9,11.1l-160.9,325.5c-6.6,13.3,3.1,28.9,17.9,28.9h74.2c14.8,0,24.5,15.6,17.9,28.9l-110,222.6 c-6.6,13.301,3.1,28.9,17.9,28.9h69.9c14.8,0,24.399,15.4,18,28.699L207.798,930.9 C197.898,951.199,223.998,969.699,239.898,953.699z"></path> </g> </g></svg>
            <span className="py-1 text-sm text-slate-500 ">
              Transfers
              </span>
          </button>
          </div>
        
          <button
          id="nav_network"
          onClick={()=>tabSwitch('network','auto')}
          className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group " + (currentPage==='network' ? 'text-blue-600 border-blue-600':'text-slate-500')}>
            <svg className="w-7 h-7 text-slate-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={currentPage==='network' ?"#137ED9":"currentColor"} className="bi bi-people-fill"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path> <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"></path> <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"></path> </g></svg>
            </svg>
            <span className="whitespace-nowrap py-1 text-sm text-slate-500 ">
              Contacts
              </span>
          </button>

          <button 
          id="nav_account"
        onClick={()=>tabSwitch('account','auto')}
         className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group " + (currentPage==='account' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " fill={currentPage==='account' ?"#137ED9":"currentColor"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enable-background="new 0 0 52 52"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M47.6,37.6c-0.5-0.1-1.1-0.1-1.6-0.2c-0.1,0-0.2-0.1-0.2-0.2c-0.2-0.6-0.5-1.2-0.7-1.7c0-0.1,0-0.2,0-0.3 c0.3-0.4,0.7-0.9,1-1.3c0.2-0.3,0.2-0.6-0.1-0.9c-0.6-0.6-1.2-1.2-1.8-1.8c-0.1-0.1-0.3-0.2-0.4-0.2s-0.3,0.1-0.4,0.2 c-0.4,0.3-0.9,0.7-1.3,1c-0.1,0-0.1,0.1-0.1,0.1h-0.1c-0.6-0.2-1.1-0.5-1.7-0.7c-0.1,0-0.2-0.1-0.2-0.2c-0.1-0.5-0.1-1-0.2-1.5 c0-0.3-0.1-0.5-0.4-0.7c-0.1-0.1-0.2-0.1-0.2-0.1c-0.9,0-1.7,0-2.6,0c-0.2,0-0.3,0-0.4,0.1c-0.2,0.2-0.4,0.4-0.4,0.7 c0,0.5-0.1,1-0.2,1.5c0,0.1-0.1,0.2-0.2,0.2c-0.6,0.2-1.1,0.5-1.7,0.7h-0.1c-0.1,0-0.1,0-0.2-0.1c-0.4-0.3-0.8-0.7-1.3-1 C32,31.1,31.9,31,31.7,31s-0.3,0.1-0.5,0.2c-0.6,0.6-1.2,1.2-1.8,1.8c-0.3,0.3-0.3,0.6-0.1,0.9c0.3,0.4,0.7,0.8,1,1.3 c0.1,0.1,0.1,0.2,0,0.3c-0.2,0.6-0.5,1.1-0.7,1.7c0,0.1-0.1,0.2-0.2,0.2c-0.5,0.1-1,0.1-1.5,0.2c-0.3,0-0.6,0.2-0.7,0.5c0,1,0,2,0,3 c0.2,0.3,0.4,0.4,0.7,0.5c0.5,0,1,0.1,1.5,0.2c0.1,0,0.2,0.1,0.2,0.2c0.2,0.6,0.5,1.1,0.7,1.7c0,0.1,0.1,0.2,0,0.3 c-0.3,0.4-0.7,0.9-1,1.3c-0.2,0.3-0.2,0.6,0.1,0.9c0.6,0.6,1.2,1.2,1.8,1.8c0.2,0.2,0.3,0.2,0.5,0.2c0.1,0,0.3-0.1,0.4-0.2 c0.4-0.3,0.8-0.7,1.3-1c0.1,0,0.1-0.1,0.2-0.1h0.1c0.6,0.2,1.1,0.5,1.7,0.7c0.1,0,0.2,0.1,0.2,0.2c0.1,0.5,0.1,1.1,0.2,1.6 c0,0.4,0.3,0.6,0.7,0.6s0.9,0,1.3,0c0.4,0,0.8,0,1.2,0s0.6-0.2,0.7-0.6c0.1-0.5,0.1-1.1,0.2-1.6c0-0.1,0.1-0.2,0.2-0.2 c0.6-0.2,1.2-0.5,1.7-0.7h0.1c0,0,0.1,0,0.1,0.1c0.4,0.3,0.9,0.7,1.3,1c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.3-0.1,0.5-0.2 c0.6-0.6,1.2-1.2,1.8-1.8c0.3-0.3,0.3-0.6,0.1-0.9c-0.3-0.4-0.7-0.8-1-1.3c-0.1-0.1-0.1-0.2,0-0.3c0.2-0.6,0.5-1.1,0.7-1.7 c0-0.1,0.1-0.2,0.2-0.2c0.5-0.1,1.1-0.1,1.6-0.2c0.4,0,0.6-0.3,0.6-0.7c0-0.8,0-1.7,0-2.5C48.2,37.9,48,37.7,47.6,37.6z M37.8,43.6 C37.8,43.6,37.7,43.6,37.8,43.6c-2.3,0-4-1.8-4-4s1.8-4,4-4l0,0c2.2,0,4,1.8,4,4C41.7,41.8,39.9,43.6,37.8,43.6z"></path> <path d="M38.7,20.7c-0.2-0.8-0.8-1.3-1.6-1.3c-3.2,0-6.4,0-9.6,0l0,0c-1.2,0-0.6-1-0.6-1c0.2-0.4,0.4-0.7,0.5-1.1 c2.2-4.3,4.3-8.6,6.5-12.9c0.8-1.2,0-2.4-1.4-2.4c-6,0-11.9,0-17.9,0c-0.9,0-1.3,0.3-1.7,1.1c-3,7.6-6,15.1-8.9,22.7 c0,0.2-0.1,0.4-0.1,0.5c-0.1,1,0.6,1.7,1.7,1.7c3.2,0,6.5,0,9.7,0c0.7,0.1,2.1,0.4,1.4,2.2c-1.2,3.1-2.4,6.1-3.6,9.2 c-1.2,2.8-2.3,5.6-3.4,8.4c-0.4,1,0,1.9,1,2.2c0.7,0.2,1.2-0.1,1.7-0.6c4-4.2,8-8.4,12-12.7c0.5-0.5,0.9-1,1.4-1.5 c0.6-0.6,0.5-1.6,0.5-1.6l0,0c0-1,0.3-1.9,1.1-2.7c0.6-0.6,1.2-1.2,1.8-1.8c0.7-0.7,1.6-1.1,2.6-1.1c0.7,0,1.1-0.3,1.3-0.4l0.1-0.1 l0,0l0,0c1.7-1.8,3.5-3.7,5.2-5.5C38.7,21.7,38.9,21.2,38.7,20.7z"></path> </g></svg>
            <span className="whitespace-nowrap py-1 text-sm text-slate-500 ">
              Xfer Accounts
              </span>
          </button>
          <button 
          id="nav_shares"
        onClick={()=>tabSwitch('shares','auto')}
         className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group " + (currentPage==='shares' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z" fill={currentPage==='shares' ?"#137ED9":"currentColor"}></path> </g></svg>
            <span className="whitespace-nowrap py-1 text-sm text-slate-500 ">
              Shares
              </span>
          </button>
          

        {
          (!curmount || curmount.foreign) ? '' : (
            <>
          <button 
          id="nav_storages"
          onClick={()=>tabSwitch('storages','auto')}
          className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group "+ (currentPage==='storages' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " fill={currentPage==='storages' ?"#137ED9":"currentColor"} viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>storage-solid</title> <path className="clr-i-solid clr-i-solid-path-1" d="M17.91,18.28c8.08,0,14.66-1.74,15.09-3.94V8.59c-.43,2.2-7,3.94-15.09,3.94A39.4,39.4,0,0,1,6.25,11V9a39.4,39.4,0,0,0,11.66,1.51C26,10.53,32.52,8.79,33,6.61h0C32.8,3.2,23.52,2.28,18,2.28S3,3.21,3,6.71V29.29c0,3.49,9.43,4.43,15,4.43s15-.93,15-4.43V24.09C32.57,26.28,26,28,17.91,28A39.4,39.4,0,0,1,6.25,26.52v-2A39.4,39.4,0,0,0,17.91,26C26,26,32.57,24.28,33,22.09V16.34c-.43,2.2-7,3.94-15.09,3.94A39.4,39.4,0,0,1,6.25,18.77v-2A39.4,39.4,0,0,0,17.91,18.28Z"></path> <rect x="0" y="0" width="36" height="36" fill-opacity="0"></rect> </g></svg>
            
            <span className="py-1 text-sm text-blue-300 ">
              Storages
              </span>
          </button>
          
            <button 
          id="nav_xfers"
          onClick={()=>tabSwitch('xfers','auto')}
          className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group " + (currentPage==='xfers' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.25 4.00003C10.25 3.69074 10.0602 3.41317 9.77191 3.30105C9.48366 3.18892 9.15614 3.26524 8.94715 3.49324L3.44715 9.49324C3.24617 9.71248 3.19374 10.0298 3.3135 10.302C3.43327 10.5743 3.70259 10.75 4.00002 10.75H20C20.4142 10.75 20.75 10.4142 20.75 10C20.75 9.58582 20.4142 9.25003 20 9.25003L10.25 9.25003V4.00003Z" fill={currentPage==='xfers' ?"#137ED9":"currentColor"}></path> <path d="M13.75 20L13.75 14.75H4.00002C3.5858 14.75 3.25002 14.4142 3.25002 14C3.25002 13.5858 3.5858 13.25 4.00002 13.25L20 13.25C20.2974 13.25 20.5668 13.4258 20.6865 13.698C20.8063 13.9703 20.7539 14.2876 20.5529 14.5068L15.0529 20.5068C14.8439 20.7348 14.5164 20.8111 14.2281 20.699C13.9399 20.5869 13.75 20.3093 13.75 20Z" fill={currentPage==='xfers' ?"#137ED9":"currentColor"}></path> </g></svg>
            <span className="py-1 text-sm text-blue-300 ">
              Xfers
              </span>
          </button>
          <button 
          id="nav_events"
          onClick={()=>tabSwitch('events','auto')}
          className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group "+ (currentPage==='events' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>diary_fill</title> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Education" transform="translate(-288.000000, -48.000000)"> <g id="diary_fill" transform="translate(288.000000, 48.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M6,2 C4.89543,2 4,2.89543 4,4 L4,5 C3.44772,5 3,5.44772 3,6 C3,6.55228 3.44772,7 4,7 L4,9 C3.44772,9 3,9.44772 3,10 C3,10.5523 3.44772,11 4,11 L4,13 C3.44772,13 3,13.4477 3,14 C3,14.5523 3.44772,15 4,15 L4,17 C3.44772,17 3,17.4477 3,18 C3,18.5523 3.44772,19 4,19 L4,20 C4,21.1046 4.89543,22 6,22 L18,22 C19.1046,22 20,21.1046 20,20 L20,4 C20,2.89543 19.1046,2 18,2 L6,2 Z M8.5,6 C7.67157,6 7,6.67157 7,7.5 L7,8.5 C7,9.32843 7.67157,10 8.5,10 L15.5,10 C16.3284,10 17,9.32843 17,8.5 L17,7.5 C17,6.67157 16.3284,6 15.5,6 L8.5,6 Z" fill={currentPage==='events' ?"#137ED9":"currentColor"}> </path> </g> </g> </g> </g></svg>
            <span className="py-1 text-sm text-blue-300 ">
              Events
              </span>
          </button>
          {/* <button
          id="nav_policies"
          onClick={()=>tabSwitch('policies','auto')}
          className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group "+ (currentPage==='policies' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " fill={currentPage==='policies' ?"#137ED9":"currentColor"} height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_22_"> <path id="XMLID_23_" d="M308.625,70.576c-3.779-2.842-8.676-3.735-13.216-2.41c-8.328,2.43-16.824,3.662-25.251,3.662 c-24.195,0-48.153-7.088-65.733-19.445C188.902,41.471,180,27.846,180,15c0-8.284-6.717-15-15-15c-8.285,0-15,6.716-15,15 c0,12.846-8.903,26.471-24.426,37.383c-17.58,12.357-41.538,19.445-65.732,19.445c-8.428,0-16.924-1.232-25.251-3.662 c-4.54-1.324-9.436-0.432-13.216,2.41c-3.779,2.842-5.998,7.299-5.986,12.027c0.203,79.771,35.262,142.536,56.142,172.85 c14.604,21.201,30.958,39.488,47.296,52.888C130.874,318.222,148.664,330,165,330c16.334,0,34.125-11.778,46.172-21.659 c16.338-13.399,32.693-31.686,47.296-52.888c20.881-30.314,55.94-93.079,56.143-172.85 C314.623,77.875,312.404,73.418,308.625,70.576z M108.045,225.185c0-31.458,25.5-56.956,56.955-56.956 c-20.221,0-36.615-16.393-36.615-36.614C128.385,111.392,144.779,95,165,95c20.221,0,36.615,16.392,36.615,36.614 c0,20.222-16.395,36.614-36.615,36.614c31.455,0,56.955,25.498,56.955,56.956H108.045z"></path> </g> </g></svg>
            <span className="py-1 text-sm text-slate-500 ">
              Policies
              </span>
          </button>
          <button 
          id="nav_keys"
          onClick={()=>tabSwitch('keys','auto')}
          className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group "+ (currentPage==='keys' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill={currentPage==='keys' ?"#137ED9":"currentColor"} d="M354.946,238.89c25.264-25.196,41.015-60.45,40.99-98.95c0.016-38.509-15.726-73.763-40.981-98.951 C329.768,15.727,294.504-0.025,255.996,0c-38.509-0.025-73.763,15.727-98.951,40.989c-25.254,25.188-41.006,60.442-40.981,98.951 c-0.025,38.5,15.727,73.754,40.981,98.95c17.753,17.795,40.57,30.73,65.942,36.886V512h8.604h57.414h60.282v-63.15h-60.282v-34.455 h63.25v-43.058h-63.25v-95.561C314.377,269.62,337.193,256.685,354.946,238.89z M255.996,193.746 c-15.003-0.016-28.182-5.954-38.055-15.76c-9.806-9.872-15.734-23.051-15.76-38.046c0.026-15.003,5.954-28.19,15.76-38.063 c9.882-9.806,23.06-15.744,38.055-15.76c15.003,0.016,28.181,5.954,38.063,15.76c9.806,9.872,15.734,23.06,15.76,38.063 c-0.026,14.994-5.955,28.173-15.76,38.046C284.186,187.792,270.999,193.729,255.996,193.746z"></path> </g> </g></svg>
            <span className="py-1 text-sm text-slate-500 ">
              Keys
              </span>
          </button> */}
          </>
          )
        }
           <button 
          id="nav_profile"
          onClick={()=>tabSwitch('profile','auto')}
          className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group "+ (currentPage==='profile' ? 'text-blue-600 border-blue-600':'')}>
            <svg className="w-7 h-7 text-slate-500 " fill={currentPage==='profile' ?"#137ED9":"currentColor"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,13.743l-1,.579a1,1,0,0,0-.366,1.366l1.488,2.578a1,1,0,0,0,1.366.366L6.5,18.05a1.987,1.987,0,0,1,1.986,0l.02.011a1.989,1.989,0,0,1,1,1.724V21a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V19.782a1.985,1.985,0,0,1,.995-1.721l.021-.012a1.987,1.987,0,0,1,1.986,0l1.008.582a1,1,0,0,0,1.366-.366l1.488-2.578A1,1,0,0,0,21,14.322l-1-.579a1.994,1.994,0,0,1-1-1.733v-.021a1.991,1.991,0,0,1,1-1.732l1-.579a1,1,0,0,0,.366-1.366L19.876,5.734a1,1,0,0,0-1.366-.366L17.5,5.95a1.987,1.987,0,0,1-1.986,0L15.5,5.94a1.989,1.989,0,0,1-1-1.724V3a1,1,0,0,0-1-1h-3a1,1,0,0,0-1,1V4.294A1.856,1.856,0,0,1,8.57,5.9l-.153.088a1.855,1.855,0,0,1-1.853,0L5.49,5.368a1,1,0,0,0-1.366.366L2.636,8.312A1,1,0,0,0,3,9.678l1,.579A1.994,1.994,0,0,1,5,11.99v.021A1.991,1.991,0,0,1,4,13.743ZM12,9a3,3,0,1,1-3,3A3,3,0,0,1,12,9Z"></path></g></svg>
            <span className="py-1 text-sm text-slate-500 ">
              Settings
              </span>
          </button> 

          <button
          onClick={() => signOut()}
          className={"inline-flex flex-col items-center justify-center  pb-1 pt-3 px-2 border-transparent border-b-2 md:hover:text-blue-600  group "}>
          <svg className="w-7 h-7 text-slate-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12L16 12" stroke="#0285c7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
            <span className="whitespace-nowrap py-1 text-sm text-slate-500 ">
              Sign Out
              </span>
          </button>       
          
        </div>
      </div>
  
  );
  }
}
