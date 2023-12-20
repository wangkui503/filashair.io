'use client';
var pathlib = require('path');
import { tabSwitch } from "@/lib/tab";
import { useCounter } from "@/components/context/context";
import { useRef, useContext, useEffect, useState, useDeferredValue } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"
import FilesCard from "./filesCard";
import NextPage from "../nextPage";
import FilesNav from "./filesNav";
import {  uploadSpecData, downloadSpecData } from "@/lib/getToken";
import { createFolder, newSearchJob, deleteJob } from "@/lib/getXferAccount";
import { getFilesResource } from "@/lib/getXferAccount";
import FilterBar from "@/components/filterbar";
import { sherr } from "@/lib/errors";
import { toastPromise } from "@/lib/errors";


export default function Files({currentPath, setCurrentPath, title, showOff, funcs, back}) {  
  const searchKeywordRef = useRef<HTMLInputElement | null>(null);  
  const filterPatternRef = useRef<HTMLInputElement | null>(null);  
  const newFolderFormRef = useRef<HTMLFormElement | null>(null);  
  const newFolderNameRef = useRef<HTMLInputElement | null>(null);  
  const funcsRef = useRef<HTMLDivElement | null>(null);  
  const refFiles = useRef<HTMLDivElement | null>(null);
  const { data: session, status } = useSession()
  const [list, setList] = useState([]);  

  const [paging, setPaging] = useState({meta:0});
  const newLimit = () => setPaging({meta: paging.meta+1})

  const [count, setCount] = useCounter();
  const curmount = count.meta[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
  const mount = curmount?.mount
  const token = curmount?.token

  const [slotMeta, setSlotMeta] = useState({meta:null});  
  
  const [filterPattern, setFilterPattern] = useState();  

  async function getFiles(cache, refresh, path) {
    currentPath.meta = path
    getFilesResource(cache, refresh, path, 50, mount, token, curmount?.curshareid, null, null, (slot) => {
      slotMeta.meta = slot
      setList(slot?.all)
      currentPath.share = curmount?.curshareid        
    })    
  }

  async function refreshList() {
    if (!mount || !token) return
    getFiles(false, true, currentPath.meta)
  }


  
  useEffect(() => {
    clearFilterPattern()
    if (currentPath.share && currentPath.share != curmount?.curshareid) {
      currentPath.meta = '/' 
      setList([])   
    }
    console.log("files observing---", refFiles?.current)
    //if (!count.meta?.[count.meta?.curmountid]?.curshareid) return;
    
    if (!refFiles?.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
        
      if (entry.isIntersecting) {
        console.log("files isIntersecting-- ", entry)
        getFiles(true, false, currentPath.meta)
        observer.disconnect();
      }
    },
    {
        threshold: 1,
    }
    );
    
  
    observer.observe(refFiles.current);
    return () => {
          observer.disconnect();
      };
    
  }, [curmount?.curshareid, currentPath.meta])


  
  useEffect(() => {
    if (paging.meta < 1) return
      getFiles(false, false, currentPath.meta)
  }, [paging]); 

  


  

  function goSub(file) {
      clearFilterPattern()
      let path = currentPath.meta + file.name;
      if (file?.type =='folder') {
        path += '/'
      }
      currentPath.meta = path
      setCurrentPath({meta: currentPath.meta})
      
  }

  async function newFolder(path) {
    createFolder(path, mount, token, curmount?.curshareid, null, null, () => {
      getFiles(false, true, currentPath.meta)
      newFolderNameRef.current.value = ''
    })    
  }

  function filter() {
    if (!filterPattern) return list
    
    const patterns = filterPattern.split(' ')
    let filtered = list
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      if (pattern.toLowerCase().startsWith("$size")) {
        filtered = filtered.filter(file => {
          try {
            if (eval(file.size+pattern.substring(5))) return file
          } catch(e) {}
        })
      } else {
        filtered = filtered.filter(file => file.type === pattern || file.size == pattern || file.name?.includes(pattern) || file.mtime?.includes(pattern))
      }      
    }
    
    return filtered
  }

  function clearFilterPattern() {
    if (!filterPatternRef.current) return
    setFilterPattern(undefined)
    filterPatternRef.current.value = ''
  }

  async function newJob(keyword) {
    newSearchJob(keyword, currentPath.meta, mount, token, curmount?.curshareid, null, null).then(job => {
      tabSwitch(title+'xferJobListRef', 'auto')
    }).catch(error => {
      sherr(error)
    })    
  }

  async function newDeleteJob(file) {
    deleteJob(currentPath.meta, file, mount, token, curmount?.curshareid, null, null).then(job => {
      tabSwitch(title+'xferJobListRef', 'auto')
    }).catch(error => {
      sherr(error)
    })    
  }


  async function doCopy(file, mv) {
    let newName = prompt((mv ? "Move: " : "Copy: ") +  "new file name", file.name + (mv ? "_move" : "_copy"));
    if (newName == null) {
      return
    }
    const source = {
      mount_id: curmount?.mount?.id,
      mount_alias: curmount?.mount?.alias,
      host: curmount?.mount?.host,
      xfer_addr: curmount?.mount?.xfer_addr,
      username: curmount?.mount?.username,
      token: "bearer ",
      share: curshare?.id,
      share_alias: curshare?.alias,
      path_pairs: [
        {
          src: pathlib.join(currentPath.meta, file.name),
          dst: pathlib.join(currentPath.meta, newName),
        }
      ]
    }    
    const dest = {
      mount_id: curmount?.mount?.id,
      mount_alias: curmount?.mount?.alias,
      host: curmount?.mount?.host,
      xfer_addr: curmount?.mount?.xfer_addr,
      username: curmount?.mount?.username,
      token: "bearer ",
      share: curshare?.id,
      share_alias: curshare?.alias,
    }    

    const data = uploadSpecData(source, dest)
    if (mv) {
      data.spec.source.remove_after = true
    }
    console.log("copy file---", source, dest, data, JSON.stringify(data))

    
    await messaging(data).then(transfer => {    
      console.log("docopy ---", transfer)
      const xfer = transfer.datas[0]
      fetch(xfer.host + "/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': xfer.spec.source.token,
        },      
        body: JSON.stringify(xfer),
      }).then(async (res) => {
        if (res.status != 200) {   
          const result = await res.json()
          tabSwitch('transferListRef', 'auto')
          return result    
        } 
        throw res
      })
    }).catch(error => {
      sherr(error)
    })
  }

  async function messaging(spec) {
    const data = {
      kind: 'xfer',
      email: session?.user?.email,
      direction: 'upload',
      message: 'copy ' + spec.spec.source.path_pairs[0].src,
      specs: [spec],
    }
    
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },      
      body: JSON.stringify(data),
    })

      if (res.status === 200) {
        const transfer = await res.json()
        console.log("copy file messaging data----", transfer)                
        return transfer
      }
      throw res
    
  }

  async function copyFile(file) {
    toastPromise(doCopy(file, false))
  }

  async function mvFile(file) {
    toastPromise(doCopy(file, true))
  }

  
  


  if (!curmount || !curmount?.curshareid) {
    return (    
      <div className="">
<FilesNav title={title} page={"filesListRef"} back={back}/>

  </div>
    )
  }

  
  return (
<div className="">
<FilesNav title={title} page={"filesListRef"} back={back}/>


<div className="w-full flex flex-col md:flex-row justify-start md:justify-between bg-white " ref={refFiles}>
    <div className="w-full py-2">
    { 
    slotMeta.meta?.parents?     
      (slotMeta.meta?.parents?.map((parent, i)=>{        
        return (
        <button
        key={i}
              onClick={()=>{
                if (i+1 == slotMeta.meta?.parents?.length) {
                  getFiles(false, true, parent)
                } else {
                  getFiles(true, false, parent)
                }                
              }}
              className="w-auto pr-8"
              >
                {(i+1 == slotMeta.meta?.parents?.length) ? 
                  pathlib.basename(parent)? (<span>{pathlib.basename(parent)}{slotMeta.meta?.type == 'folder' ? '/' : ''}</span>) : (<span>/</span>) :
                  pathlib.basename(parent)? (<span>{pathlib.basename(parent)}/</span>) : (<span>/</span>)
                }
              
          </button>
        )
      })) : (
        <button
              onClick={()=>{
                  getFiles(false, true, '/')
              }}
              className="w-auto pr-8"
              >                
                  <span>/</span>                              
          </button>
      )
    }          
    </div>
    <div className="relative py-1 flex flex-col md:flex-row gap-2 justify-start leading-normal">
    
          <div ref={funcsRef} className={`${showOff ? '' : 'hidden'} overflow-auto flex flex-row gap-2 justify-start leading-normal`}>
          <button
                  onClick={()=>{newFolderFormRef.current?.classList.toggle('hidden');funcsRef.current?.classList.toggle('hidden')}}
            className="w-full h-8 whitespace-nowrap block px-2 rounded shadow-lg bg-blue-300 md:hover:bg-gray-200 "
          >
          New Folder
          </button>  
          {
            funcs?.map((func, i) => {
              return (
                <button
                key={i}
                  onClick={()=>{func.action(session, curmount, slotMeta.meta.path, {
                    name: '',
                    type: 'folder'
                  });funcsRef.current?.classList.add('hidden')}}
                  className="w-full h-8 whitespace-nowrap block px-2 rounded shadow-lg bg-blue-300 md:hover:bg-gray-200 "
                >
                {func.name}
                </button>                
                

              )
            })
          }
          </div>

          <div>
          <button
          className="text-xl text-blue-700"
          onClick={() => {funcsRef.current?.classList.toggle('hidden')}}
          >...</button>
          </div>          
          </div>
  </div>

  <form ref={newFolderFormRef} onSubmit={(e) => {
        e.preventDefault();
        if (e.currentTarget.newFolderName.value == '') {
          toast.error('new folder name is required');
          return
        }
        newFolder(currentPath.meta + "/" + e.currentTarget.newFolderName.value)
  }}
  className="hidden relative z-0 w-full mb-4 group border-b border-neutral-300">
        <input
          className="block pr-10 py-2 w-full bg-transparent appearance-none peer"
          placeholder=" "
          id="newFolderName"
          name="newFolderName"
          type="text"
          ref={newFolderNameRef}
        />
        <label
          htmlFor="newFolderName"
          className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          New folder name
        </label>
        <button 
        type="submit"
        className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 md:hover:text-gray-900 transition-colors">
          
        <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 6C3 4.34315 4.34315 3 6 3H8.92157C9.45201 3 9.96071 3.21071 10.3358 3.58579L11.4142 4.66421C11.7893 5.03929 12.298 5.25 12.8284 5.25H18C19.6569 5.25 21 6.59315 21 8.25V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z" stroke="#137ED9" stroke-width="2"></path> <path d="M9 13H15M12 10L12 16" stroke="#137ED9" stroke-width="2" stroke-linecap="round"></path> </g></svg>

        </button>
    </form>

<div className="w-full flex flex-col md:flex-row ">


<FilterBar setFilterPattern={setFilterPattern}/>
  <form onSubmit={(e) => {
        e.preventDefault();
        if (e.currentTarget.searchKeyword.value == '') {
          toast.error('search keyword is required');
          return
        }
        newJob(e.currentTarget.searchKeyword.value)
  }}
  className="w-full md:w-1/4 pb-2 bg-white ">

    <div className="relative py-2 z-0 w-full mb-4 group border-b border-neutral-300">
        <input
          className="block pr-16 py-1 w-full bg-transparent appearance-none peer"
          placeholder=" "
          id="searchKeyword"
          name="searchKeyword"
          type="text"
          required
          ref={searchKeywordRef}
        />
        <label
          htmlFor="email"
          className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Search
        </label>


    
        <button 
        type="submit"
        className="block w-7 h-7 text-center text-xl leading-0 absolute top-4 right-0 text-gray-400 md:hover:text-gray-900 transition-colors">
         <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="#1C274C"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg> 
        
        </button>        
        
      </div>
  </form>
</div>
  


<div className="w-full">

  <div className="w-full grid md:grid-cols-5 justify-start border-b">

  <div className="flex flex-row justify-start gap-4 p-3 leading-normal">  
    <h5 className="font-semibold tracking-tight text-gray-900 ">
      Name    
    </h5>    
    <div>
      <button
      onClick={()=>refreshList()}
      >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0789 2.25C7.2854 2.25 3.34478 5.913 2.96055 10.5833H2.00002C1.69614 10.5833 1.42229 10.7667 1.30655 11.0477C1.19081 11.3287 1.25606 11.6517 1.47178 11.8657L3.15159 13.5324C3.444 13.8225 3.91567 13.8225 4.20808 13.5324L5.88789 11.8657C6.10361 11.6517 6.16886 11.3287 6.05312 11.0477C5.93738 10.7667 5.66353 10.5833 5.35965 10.5833H4.4668C4.84652 6.75167 8.10479 3.75 12.0789 3.75C14.8484 3.75 17.2727 5.20845 18.6156 7.39279C18.8325 7.74565 19.2944 7.85585 19.6473 7.63892C20.0002 7.42199 20.1104 6.96007 19.8934 6.60721C18.2871 3.99427 15.3873 2.25 12.0789 2.25Z" fill="#1C274C"></path> <path d="M20.8411 10.4666C20.549 10.1778 20.0789 10.1778 19.7867 10.4666L18.1005 12.1333C17.8841 12.3471 17.8184 12.6703 17.9339 12.9517C18.0495 13.233 18.3235 13.4167 18.6277 13.4167H19.5268C19.1455 17.2462 15.8759 20.25 11.8828 20.25C9.10026 20.25 6.66586 18.7903 5.31796 16.6061C5.10042 16.2536 4.63833 16.1442 4.28583 16.3618C3.93334 16.5793 3.82393 17.0414 4.04146 17.3939C5.65407 20.007 8.56406 21.75 11.8828 21.75C16.6906 21.75 20.6475 18.0892 21.0331 13.4167H22.0002C22.3043 13.4167 22.5783 13.233 22.6939 12.9517C22.8095 12.6703 22.7437 12.3471 22.5274 12.1333L20.8411 10.4666Z" fill="#1C274C"></path> </g></svg>
      </button>
    </div> 
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Kind
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Size
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Last Modified Date
    </p>
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
  
    </p>
  </div>
  
</div>
{
  (currentPath.share != curmount?.curshareid) ? (
<>
Loading...
</>
  ) : (
    <>
    {
  filter()?.map((file, i) => (
    <FilesCard 
    key={i}
    i={i}
    parentPath={slotMeta.meta.path}
    parentType={slotMeta.meta.type}
    file={file}
    goSub={goSub} 
    showOff={showOff}
    funcs={funcs}
    deleteFunc={newDeleteJob}
    copyFunc={copyFile}
    mvFunc={mvFile}
    />
  ))
}

    </>
  )
}

</div>
{
  <div>
    {list.length} entries

  </div>
}



<NextPage more={slotMeta.meta?.more} newLimit={newLimit}/>

  <div className="h-24"></div>
</div>
    );

}