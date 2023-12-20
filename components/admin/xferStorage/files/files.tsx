'use client';
var pathlib = require('path');
import { tabSwitch } from "@/lib/tab";
import { useCounter } from "@/components/context/context";
import { useRef, useContext, useEffect, useState, useDeferredValue } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"
import FilesCard from "./filesCard";
import NextPage from "../../nextPage";
import FilesNav from "./filesNav";
import { createFolder, newSearchJob, deleteJob } from "@/lib/getXferAccount";
import { getFilesResource } from "@/lib/getXferAccount";

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
  const mount = curmount?.mount
  const token = curmount?.token
  const key = "storage_" + curmount?.curstorageid

  const [filterPattern, setFilterPattern] = useState();  

  const [slotMeta, setSlotMeta] = useState({meta:null});  
  
  const cursharefiles = curmount?.files?.[key]?? {}

  async function getFiles(cache, refresh, path) {
    if (!curmount?.curstorageid) {
      return
    }
    currentPath.meta = path
    getFilesResource(cache, refresh, path, 50, mount, token, null, curmount?.curstorageid, curmount?.curdomainid, (slot) => {
      slotMeta.meta = slot
      setList(slot?.all)
      currentPath.domain = curmount?.curdomainid
      currentPath.storage = curmount?.curstorageid        
    })        
  }

  async function refreshList() {
    if (!mount || !token) return
    getFiles(false, true, currentPath.meta)
  }


  
  useEffect(() => {
    clearFilterPattern()
    if ((currentPath.storage && currentPath.storage != curmount?.curstorageid) || 
      (currentPath.domain && currentPath.domain != curmount?.curdomainid)) {
      currentPath.meta = '/'    
      setList([])   
    }
    console.log("files observing---", refFiles?.current)
    //if (!count.meta?.[count.meta?.curmountid]?.curstorageid) return;
    
    if (!refFiles?.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
        
      if (entry.isIntersecting) {
        console.log("files isIntersecting-- ", cursharefiles)
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
    
  }, [curmount?.curstorageid, curmount?.curdomainid, currentPath.meta])


  
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
    createFolder(path, mount, token, null, curmount?.curstorageid, curmount?.curdomainid, () => {
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
    newSearchJob(keyword, currentPath.meta, mount, token, null, curmount?.curstorageid, curmount?.curdomainid, (job) => {
      tabSwitch(title+'xferJobListRef', 'auto')
    })        
  }

  async function newDeleteJob(file) {
    deleteJob(currentPath.meta, file, mount, token, null, curmount?.curstorageid, curmount?.curdomainid, (job) => {
      tabSwitch(title+'xferJobListRef', 'auto')
    })    
  }

  if (!curmount || !curmount?.curstorageid) {
    return (    
      <div className="">
<FilesNav title={title} page={"filesListRef"} back={back}/>

  </div>
    )
  }

  
  return (
<div className="">
<FilesNav title={title} page={title+"filesListRef"} back={back}/>


<div className="w-full overflow-auto scrollbar-hide flex flex-col md:flex-row justify-start md:justify-between bg-white " ref={refFiles}>
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


  <form onSubmit={(e) => {
        e.preventDefault();
        if (e.currentTarget.searchPattern.value == '') {
          clearFilterPattern()
          return
        }
        setFilterPattern(e.currentTarget.searchPattern.value)
  }}
  className="w-full mr-2 md:w-3/4 pb-2 bg-white ">
    <div className="relative py-2 z-0 w-full mb-4 group border-b border-neutral-300">
        <input
          className="block pr-16 py-1 w-full bg-transparent appearance-none peer"
          placeholder=" "
          id="searchPattern"
          name="searchPattern"
          type="text"
          ref={filterPatternRef}
        />
        <label
          htmlFor="email"
          className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Filter
        </label>
        <button 
        type="submit"
        className="block w-7 h-7 text-center text-xl leading-0 absolute top-4 right-8 text-gray-400 md:hover:text-gray-900 transition-colors">
        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke="#1C274C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </button>

        <button 
        type="reset"
        onClick={()=>clearFilterPattern()}
        className="block w-5 h-5 text-center text-xl leading-0 absolute top-5 right-2 text-gray-400 md:hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 15L21 21M21 15L15 21M10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L17 11" stroke="#1C274C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </button>
      </div>          
  </form>
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

  <div className="w-full grid md:grid-cols-12 justify-start border-b">

  <div className="flex flex-row md:col-span-5 justify-start gap-4 p-3 leading-normal">
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
  <div className="flex flex-col md:col-span-2 justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Size
    </p>
  </div>
  <div className="flex flex-col md:col-span-3 justify-start p-3 leading-normal">
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
  (currentPath.storage != curmount?.curstorageid) ? (
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