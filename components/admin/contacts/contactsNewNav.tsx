'use client';
import { tabSwitch } from "@/lib/tab";

export default function ContactsNewNav({title, session, page, back}) {   
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">        
    
            <li className="mr-2">
            <button
              className={`flex flex-row gap-2 inline-block p-4 rounded-t-lg `}
              onClick={()=>tabSwitch(title+'contactsListRef', 'auto')}
              >
            <span>Contacts</span>
            </button>
            </li>    
            
      <li className="mr-2">
      <button 
      onClick={()=>tabSwitch(title+'contactsNewRef', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 text-blue-600 border-b-2 border-blue-600 active rounded-t-lg `}
          
        >
          Invite new member
        </button>
      </li>
       
      
      
    </ul>
  </div>
    )
}