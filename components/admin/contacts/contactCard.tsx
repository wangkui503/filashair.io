var pathlib = require('path');
import { useRef, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useCounter } from "@/components/context/context";

export default function ContactCard({i, contact, showOff, funcs, omitDel}) {    
  const funcsRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]

  useEffect(() => {
    !showOff && funcsRef.current?.classList.add('hidden')
  }, [contact])

  
    return (
      <div className={`${i%2 === 0 ? 'bg-stone-100':''} w-full grid md:grid-cols-5 justify-start border-b md:hover:shadow-xl md:hover:bg-slate-200`}>

      <div className="flex flex-row md:col-span-2 justify-start p-3 leading-normal">
              <div 
              
              className="whitespace-nowrap overflow-x-auto scrollbar-hide font-semibold tracking-tight text-gray-900 ">
              
              {contact.email}
          </div>        
        </div>
        <div className="flex flex-row justify-start p-3 leading-normal">
              <div 
              
              className="whitespace-nowrap overflow-x-auto scrollbar-hide font-semibold tracking-tight text-gray-900 ">
              
              {contact.name}
          </div>        
        </div>
        <div className="flex flex-col justify-start p-3 leading-normal">
          <p className="whitespace-nowrap overflow-x-auto scrollbar-hide font-normal text-gray-700">
          {session?.user?.role === 'admin' ? contact.inbox?.share : (contact.inbox?.share? 'yes': 'no')}
          </p>
        </div>

        <div className="relative flex flex-row gap-2 justify-start p-3 leading-normal">
            
          <button
          className="text-xl text-blue-700"
          onClick={() => {funcsRef.current?.classList.toggle('hidden')}}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z" fill="#1C274C"></path> <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#1C274C"></path> <path d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z" fill="#1C274C"></path> </g></svg>
          </button>
          
          </div>

        
        <div ref={funcsRef} className={`${showOff ? '' : 'hidden'} whitespace-nowrap overflow-x-auto scrollbar-hide w-full flex flex-row gap-2 md:col-span-${funcs?.length+1} justify-start p-3 leading-normal`}>
          {
            funcs?.map((func, i) => {
              return (
                <div key={'func'+i}>
                <button
                  onClick={()=>{func.action(contact);funcsRef.current?.classList.add('hidden')}}
                  className="w-full whitespace-nowrap block p-1 rounded shadow-lg bg-blue-300 md:hover:bg-gray-100 "
                >
                {func.name}
                </button>                
                </div>

              )
            })
          }
          { 
            !omitDel && session?.user?.role === 'admin' ? (
              <div>
            <button
              onClick={()=>{delFunc(storage)}}
              className="flex flex-row gap-2 w-full whitespace-nowrap block p-1 rounded shadow-lg bg-blue-300 md:hover:bg-gray-100 "
            >
            <svg className="w-5 h-5" fill="#137ED9" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-e</title><path d="M296,64H216a7.91,7.91,0,0,0-8,8V96h96V72A7.91,7.91,0,0,0,296,64Z"></path><path d="M432,96H336V72a40,40,0,0,0-40-40H216a40,40,0,0,0-40,40V96H80a16,16,0,0,0,0,32H97L116,432.92c1.42,26.85,22,47.08,48,47.08H348c26.13,0,46.3-19.78,48-47L415,128h17a16,16,0,0,0,0-32ZM192.57,416H192a16,16,0,0,1-16-15.43l-8-224a16,16,0,1,1,32-1.14l8,224A16,16,0,0,1,192.57,416ZM272,400a16,16,0,0,1-32,0V176a16,16,0,0,1,32,0ZM304,96H208V72a7.91,7.91,0,0,1,8-8h80a7.91,7.91,0,0,1,8,8Zm32,304.57A16,16,0,0,1,320,416h-.58A16,16,0,0,1,304,399.43l8-224a16,16,0,1,1,32,1.14Z"></path></g></svg>
            <span>Delete</span>
            </button>                
            </div>
            ) : ''
          }
          
          </div>
        
      </div>  
      )
}