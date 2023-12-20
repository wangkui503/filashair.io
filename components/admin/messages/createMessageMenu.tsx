'use client';
import { tabSwitch } from "@/lib/tab";

export default function CreateMessagesMenu({page, message}) {   
    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">        
      <li className="mr-2">
      <button 
      onClick={()=>tabSwitch('receivedMessages', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 ${page==='receivedMessages' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          aria-current="page"
        >
          Inbox
        </button>
      </li>
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('sentMessages', 'auto')}
            className={`flex flex-row gap-2 inline-block p-4 ${page==='sentMessages' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
            aria-current="page"
            >
            Outbox
        </button>
      </li>    
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('createMessageRef', 'auto')}
            className={`flex flex-row gap-2 inline-block p-4 ${page==='createMessageRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
            aria-current="page"
            >
            <svg className="w-6 h-6 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="currentColor"></path> </g></svg>
        </button>
      </li>    
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('messageNetworkRef', 'auto')}
            className={`flex flex-row gap-2 inline-block p-4 ${page==='messageNetworkRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
            aria-current="page"
            >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            <span>Contacts</span>
        </button>
      </li>   
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('createMessageFilesRef', 'auto')}
        className={`flex flex-row gap-2 inline-block p-4 ${page==='createMessageFilesRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
            >
            <svg className="w-5 h-5 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="currentColor" d="M14.847 4v12c0 2.2-1.8 4-4 4s-4-1.8-4-4V9c0-.55.45-1 1-1s1 .45 1 1v7c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2-.55 0-1-.45-1-1s.45-1 1-1c2.2 0 4 1.8 4 4z"></path> <path fill="currentColor" d="M20.847 4v18c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c.55 0 1 .45 1 1s-.45 1-1 1h-3.5c-.28 0-.5.22-.5.5v17c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-17c0-.28-.22-.5-.5-.5h-.5c-.55 0-1-.45-1-1s.45-1 1-1h1c1.1 0 2 .9 2 2z"></path> </g></svg>
            <span>Files</span>
        </button>
      </li>    
       
      
    </ul>
  </div>
    )
}