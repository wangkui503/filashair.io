'use client';
import { tabSwitch } from "@/lib/tab";

export default function NewShareNav({title}) {   
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">        
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('shareMenuRef', 'auto')}
            className={`flex flex-row gap-2 inline-block p-4 rounded-t-lg `}
          
            >
            Shares
        </button>
      </li>    
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('shareNewRef', 'auto')}
        className={`flex flex-row gap-2 inline-block p-4 text-blue-600 border-b-2 border-blue-600 active rounded-t-lg `}
          
            >
            <svg className="w-6 h-6 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="currentColor"></path> </g></svg>
        </button>
      </li> 
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('storages', 'auto')}
        className={`flex flex-row gap-2 inline-block p-4 rounded-t-lg `}
          
            >
            Storage & Path
        </button>
      </li> 
      
      
    </ul>
  </div>
    )
}