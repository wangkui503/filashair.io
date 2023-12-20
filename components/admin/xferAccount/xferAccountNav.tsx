'use client';
import { tabSwitch } from "@/lib/tab";

export default function XferAccountNav({page}) {   
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">        
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('xferAccountPluggedListRef', 'auto')}
            className={`flex flex-row gap-2 inline-block p-4 ${page==='xferAccountPluggedListRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
            >
            Plugged
        </button>
      </li>    
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('xferAccountPlugRef', 'auto')}
        className={`flex flex-row gap-2 inline-block p-4 ${page==='xferAccountPlugRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
            >
            <svg className="w-6 h-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#137ED9"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="horoscope"> <g> <path d="M25.6,25.6,22.2,29,19,25.8l3.4-3.4a2,2,0,0,0-2.8-2.8L16.2,23l-1.3-1.3a1.9,1.9,0,0,0-2.8,0l-3,3a9.8,9.8,0,0,0-3,7,9.1,9.1,0,0,0,1.8,5.6L4.6,40.6a1.9,1.9,0,0,0,0,2.8,1.9,1.9,0,0,0,2.8,0l3.2-3.2a10.1,10.1,0,0,0,5.9,1.9,10.2,10.2,0,0,0,7.1-2.9l3-3a2,2,0,0,0,.6-1.4,1.7,1.7,0,0,0-.6-1.4L25,31.8l3.4-3.4a2,2,0,0,0-2.8-2.8Z"></path> <path d="M43.4,4.6a1.9,1.9,0,0,0-2.8,0L37.2,8a10,10,0,0,0-13,.9l-3,3a2,2,0,0,0-.6,1.4,1.7,1.7,0,0,0,.6,1.4L32.9,26.4a1.9,1.9,0,0,0,2.8,0l3-2.9a9.9,9.9,0,0,0,2.9-7.1A10.4,10.4,0,0,0,40,10.9l3.4-3.5A1.9,1.9,0,0,0,43.4,4.6Z"></path> </g> </g> </g> </g></svg>
            {/* <svg className="w-6 h-6 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="currentColor"></path> </g></svg>             */}
        </button>
      </li>    
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('xferAccountUnpluggedListRef', 'auto')}
            className={`flex flex-row gap-2 inline-block p-4 ${page==='xferAccountUnpluggedListRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
            >
            All
        </button>
      </li>    
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('xferAccountNewRef', 'auto')}
        className={`flex flex-row gap-2 inline-block p-4 ${page==='xferAccountNewRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
            >
            <svg className="w-6 h-6 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="currentColor"></path> </g></svg>
        </button>
      </li>    
      
      
    </ul>
  </div>
    )
}