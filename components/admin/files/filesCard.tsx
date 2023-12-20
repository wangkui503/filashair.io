var pathlib = require('path');
import { useRef, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { useCounter } from "@/components/context/context";

export default function FilesCard({i, parentPath, parentType, file, goSub, showOff, funcs, deleteFunc, copyFunc, mvFunc}) {    
  const funcsRef = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]

  useEffect(() => {
    !showOff && funcsRef.current?.classList.add('hidden')
  }, [file])

  console.log("parentType---", parentType)

    return (
        <div className={`${i%2 === 0 ? 'bg-stone-100':''} ${file.type === 'folder' ? 'font-semibold':'font-normal'} w-full grid md:grid-cols-5 justify-start border-b md:hover:shadow-lg md:hover:bg-stone-200`}>
  
        <div className="flex flex-row justify-start p-3 leading-normal whitespace-nowrap overflow-x-auto scrollbar-hide">
                <button 
                disabled={parentType != 'folder'}
                onClick={()=>goSub(file)} 
                className="flex flex-row font-semibold tracking-tight text-gray-900 ">
                  {
                    file.type === 'folder' ? (
                      <svg className="w-4 h-4 mx-2 mt-1" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>folder 2</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Icon-Set-Filled" transform="translate(-362.000000, -153.000000)" fill="#137ED9"> <path d="M390,157 L376,157 C376,154.791 374.209,153 372,153 L366,153 C363.791,153 362,154.791 362,157 L362,163 L394,163 L394,161 C394,158.791 392.209,157 390,157 L390,157 Z M362,181 C362,183.209 363.791,185 366,185 L390,185 C392.209,185 394,183.209 394,181 L394,165 L362,165 L362,181 L362,181 Z" id="folder-2"> </path> </g> </g> </g></svg>
                    ) : 
                    file.type === 'link' ? (
                      <svg className="w-4 h-4 mx-2 mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 18C5.17157 18 3.75736 18 2.87868 17.1213C2 16.2426 2 14.8284 2 12C2 9.17157 2 7.75736 2.87868 6.87868C3.75736 6 5.17157 6 8 6C10.8284 6 12.2426 6 13.1213 6.87868C14 7.75736 14 9.17157 14 12" stroke="#137ED9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10 12C10 14.8284 10 16.2426 10.8787 17.1213C11.7574 18 13.1716 18 16 18C18.8284 18 20.2426 18 21.1213 17.1213C21.4211 16.8215 21.6186 16.4594 21.7487 16M22 12C22 9.17157 22 7.75736 21.1213 6.87868C20.2426 6 18.8284 6 16 6" stroke="#137ED9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    ) :
                    (
                      <svg className="w-4 h-4 mx-2 mt-1" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>text-document</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Icon-Set" transform="translate(-103.000000, -99.000000)" fill="#137ED9"> <path d="M122,115 L110,115 C109.448,115 109,115.448 109,116 C109,116.553 109.448,117 110,117 L122,117 C122.552,117 123,116.553 123,116 C123,115.448 122.552,115 122,115 L122,115 Z M122,121 L110,121 C109.448,121 109,121.447 109,122 C109,122.553 109.448,123 110,123 L122,123 C122.552,123 123,122.553 123,122 C123,121.447 122.552,121 122,121 L122,121 Z M123,107 C121.896,107 121,106.104 121,105 L121,101 L127,107 L123,107 L123,107 Z M127,127 C127,128.104 126.104,129 125,129 L107,129 C105.896,129 105,128.104 105,127 L105,103 C105,101.896 105.896,101 107,101 L118.972,101 C118.954,103.395 119,105 119,105 C119,107.209 120.791,109 123,109 L127,109 L127,127 L127,127 Z M121,99 L121,99.028 C120.872,99.028 120.338,98.979 119,99 L107,99 C104.791,99 103,100.791 103,103 L103,127 C103,129.209 104.791,131 107,131 L125,131 C127.209,131 129,129.209 129,127 L129,107 L121,99 L121,99 Z" id="text-document"> </path> </g> </g> </g></svg>
                    )
                  }
                
                <p className="text-left">{file.name}</p>
            </button>
          </div>
          <div className="flex flex-col justify-start p-3 leading-normal">
            <p className="text-gray-700">
            {file.type === 'folder' ? file.type : pathlib.extname(file.name)}
            </p>
          </div>
          
          <div className="flex flex-col justify-start p-3 leading-normal whitespace-nowrap overflow-x-auto scrollbar-hide">
            <p className="text-gray-700">
            {file.size}
            </p>
          </div>
          <div className="flex flex-col justify-start p-3 leading-normal whitespace-nowrap overflow-x-auto scrollbar-hide">
            <p className="text-gray-700">
            {file.mtime}
            </p>
          </div>

          

          <div className="relative flex flex-row gap-2 justify-start p-3 leading-normal">
            
          <button
          className="text-xl text-blue-700"
          onClick={() => {funcsRef.current?.classList.toggle('hidden')}}
          >...</button>
          
          </div>

          <div ref={funcsRef} className={`${showOff ? '' : 'hidden'} whitespace-nowrap overflow-x-auto scrollbar-hide w-full flex flex-row gap-2 md:col-span-5 justify-start p-3 leading-normal`}>
          {
            funcs?.map((func, i) => {
              return (
                <div key={i}>
                <button
                  onClick={()=>{func.action(session, curmount, (parentType === 'folder' ? parentPath : pathlib.dirname(parentPath)+'/'), file)}}
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
              onClick={() => copyFunc(file)}
              className="flex flex-row gap-2 w-full whitespace-nowrap block p-1 rounded shadow-lg bg-blue-300 md:hover:bg-gray-100 "
            >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z" fill="#137ED9"></path> <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z" fill="#137ED9"></path> </g></svg>
            <span>Duplicate</span>
            </button>                
            </div>
          
            <div>
            <button
              onClick={() => mvFunc(file)}
              className="flex flex-row gap-2 w-full whitespace-nowrap block p-1 rounded shadow-lg bg-blue-300 md:hover:bg-gray-100 "
            >
            <svg className="w-5 h-5" fill="#137ED9" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.005 5.995h-1v2h1v8h-1v2h1c1.103 0 2-.897 2-2v-8c0-1.102-.898-2-2-2zm-14 4H15v4H6.005z"></path><path d="M17.005 17.995V4H20V2h-8v2h3.005v1.995h-11c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h11V20H12v2h8v-2h-2.995v-2.005zm-13-2v-8h11v8h-11z"></path></g></svg>
            <span>Move</span>
            </button>                
            </div>


          <div>
            <button
              onClick={() => deleteFunc(file)}
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