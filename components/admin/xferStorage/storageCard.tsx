var pathlib = require('path');
import { useRef, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useCounter } from "@/components/context/context";
import { tabSwitch } from "@/lib/tab";

export default function StorageCard({i, storage, title, showOff, funcs, delFunc}) {    
  const funcsRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]

  useEffect(() => {
    !showOff && funcsRef.current?.classList.add('hidden')
  }, [storage])


  async function switchToFiles(storage) {
    if (!curmount) return
    curmount.curstorageid = storage.id
    setCount({
      meta: count.meta
    })
    tabSwitch(title+'xferStorageFilesRef', 'auto')
  }


    return (
        <div className={`${i%2 === 0 ? 'bg-stone-100':''} ${storage.type === 's3' ? 'font-semibold':'font-normal'} w-full grid md:grid-cols-8 justify-start border-b md:hover:shadow-lg md:hover:bg-stone-200`}>
  
  <div className="flex flex-row justify-start p-3 leading-normal overflow-x-auto">
          <div className="whitespace-nowrap overflow-x-auto scrollbar-hide font-semibold tracking-tight text-gray-900 ">              
              {storage.id}
          </div>        
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {storage.type}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {storage.store?.path}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal whitespace-nowrap overflow-x-auto scrollbar-hide">
        {
          storage.type === 's3' ? (
            <>            
              <p className="font-normal text-gray-700">
              {storage.store?.access_key}              
              </p>
              <p className="font-normal text-gray-700">
              {storage.store?.bucket}
              </p>
              <p className="font-normal text-gray-700">
              {storage.store?.endpoint}
              </p>            
            </>
          ) : ''
        }
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {storage.domain}
          </p>
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {storage.created_by}
          </p>
        </div>
        
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {storage.last_updated_at}
          </p>
        </div>

          

          <div className="relative flex flex-row gap-4 justify-start p-3 leading-normal">
          <button
            onClick={()=>switchToFiles(storage)}
            className="font-normal text-gray-700"
          >
          <svg className="w-5 h-5 text-slate-500 " viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#137ED9" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>multiple-documents-files</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Icon-Set-Filled" transform="translate(-208.000000, -101.000000)" fill="#137ED9"> <path d="M231,109 C229.935,109 229,108.039 229,107 L229,103.031 L229,103.029 L234,109 L231,109 L231,109 Z M229,117.016 L220,117.016 C219.448,117.016 219,116.568 219,116.017 C219,115.465 219.448,115.018 220,115.018 L229,115.018 C229.552,115.018 230,115.465 230,116.017 C230,116.568 229.552,117.016 229,117.016 L229,117.016 Z M229,122.011 L220,122.011 C219.448,122.011 219,121.563 219,121.012 C219,120.46 219.448,120.013 220,120.013 L229,120.013 C229.552,120.013 230,120.46 230,121.012 C230,121.563 229.552,122.011 229,122.011 L229,122.011 Z M227,131 L212,131 C210.95,131 210,130.019 210,129 L210,109 C210,107.513 211.224,107 213,107 L213,125 C213,127.059 214.884,129 217,129 C217,129 227.842,128.989 229.009,128.989 C229.009,130.202 228.213,131 227,131 L227,131 Z M229,101.031 C228.876,101.031 217,101 217,101 C214.884,101 213,102.941 213,105 L211.845,105.027 C209.729,105.027 208,106.941 208,109 L208,129 C208,131.059 209.884,133 212,133 L227,133 C229.116,133 231,131.059 231,129 L232,129 C234.116,129 236,127.059 236,125 L236,109.023 L229,101.031 L229,101.031 Z" id="multiple-documents-files"> </path> </g> </g> </g></svg>            
          </button>                
          
            
          <button
          className="text-xl text-blue-700"
          onClick={() => {funcsRef.current?.classList.toggle('hidden')}}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z" fill="#1C274C"></path> <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#1C274C"></path> <path d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z" fill="#1C274C"></path> </g></svg>
          </button>
          
          </div>

          <div ref={funcsRef} className={`${showOff ? '' : 'hidden'} whitespace-nowrap overflow-x-auto scrollbar-hide w-full flex flex-row gap-2 md:col-span-${funcs?.length+2} justify-start p-3 leading-normal`}>
          {
            funcs?.map((func, i) => {
              return (
                <div key={i} >
                <button
                  onClick={()=>{func.action(storage);funcsRef.current?.classList.add('hidden')}}
                  className="w-full whitespace-nowrap block p-1 rounded shadow-lg bg-blue-300 md:hover:bg-gray-100 "
                >
                {func.name}
                </button>                
                </div>

              )
            })
          }
          <div>
            <button
              onClick={()=>{delFunc(storage)}}
              className="flex flex-row gap-2 w-full whitespace-nowrap block p-1 rounded shadow-lg bg-blue-300 md:hover:bg-gray-100 "
            >
            <svg className="w-5 h-5" fill="#137ED9" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-e</title><path d="M296,64H216a7.91,7.91,0,0,0-8,8V96h96V72A7.91,7.91,0,0,0,296,64Z"></path><path d="M432,96H336V72a40,40,0,0,0-40-40H216a40,40,0,0,0-40,40V96H80a16,16,0,0,0,0,32H97L116,432.92c1.42,26.85,22,47.08,48,47.08H348c26.13,0,46.3-19.78,48-47L415,128h17a16,16,0,0,0,0-32ZM192.57,416H192a16,16,0,0,1-16-15.43l-8-224a16,16,0,1,1,32-1.14l8,224A16,16,0,0,1,192.57,416ZM272,400a16,16,0,0,1-32,0V176a16,16,0,0,1,32,0ZM304,96H208V72a7.91,7.91,0,0,1,8-8h80a7.91,7.91,0,0,1,8,8Zm32,304.57A16,16,0,0,1,320,416h-.58A16,16,0,0,1,304,399.43l8-224a16,16,0,1,1,32,1.14Z"></path></g></svg>
            <span>Delete</span>
            </button>                
            </div>
          </div>
          
          
          
        </div>    
      )
}