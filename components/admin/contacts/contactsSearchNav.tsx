'use client';
import { tabSwitch } from "@/lib/tab";

export default function ContactsSearchNav({title, session, page, back}) {   
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">        
    
            <li className="mr-2">
            <button
              className={`flex flex-row gap-2 inline-block p-4 rounded-t-lg `}
              onClick={()=>tabSwitch(title+'contactsListRef', 'auto')}
              >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            <span>Contacts</span>
            </button>
            </li>    
            
      <li className="mr-2">
      <button 
      onClick={()=>tabSwitch(title+'contactsSearchResultListRef', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 text-blue-600 border-b-2 border-blue-600 active rounded-t-lg `}
          
        >
          Search Result
        </button>
      </li>
       
      
      
    </ul>
  </div>
    )
}