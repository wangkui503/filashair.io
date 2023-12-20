'use client';
import { tabSwitch } from "@/lib/tab";

export default function XferXferNav({page}) {   
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">        
      <li className="mr-2">
      <button 
      onClick={()=>tabSwitch('xferTransferListRef', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 ${page==='xferTransferListRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
        >
          All
        </button>
      </li>
       
      
    </ul>
  </div>
    )
}