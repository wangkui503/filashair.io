'use client';
import { tabSwitch } from "@/lib/tab";

export default function FilesNav({title, page, back}) {  
  console.log("FilesNav---", title, page) 
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">      
    <ul className="flex flex-wrap -mb-px">  
      {
          back ? (
            <li className="mr-2">
            <button
              className={`flex flex-row gap-2 inline-block p-4 rounded-t-lg `}
              onClick={()=>tabSwitch(back, 'auto')}
              >
            <span>New {title}</span>
            </button>
            </li>    
            
            ) : ''
        }
    <li className="mr-2">
      <button 
      
      onClick={()=>tabSwitch(title+'filesListRef', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 ${page==='filesListRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
        >
          Files
        </button>
      </li>      
      <li className="mr-2">
      <button 
      
      onClick={()=>tabSwitch(title+'xferJobListRef', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 ${page==='xferJobListRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
        >
          Jobs
        </button>
      </li>
      <li className="mr-2">
      <button 
      
      onClick={()=>tabSwitch(title+'xferJobResultListRef', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 ${page==='xferJobResultListRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
        >
          Job Result
        </button>
      </li>
      
    </ul>
  </div>
    )
}