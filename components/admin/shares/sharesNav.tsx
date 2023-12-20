'use client';
import { tabSwitch } from "@/lib/tab";

export default function SharesNav({page, currentShared}) {   
    return (
        <div className="mb-4 text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">        
      <li className="mr-2">
      <button 
      onClick={()=>tabSwitch('sharedToMeRef', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 ${page==='sharedToMeRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
        >
          Shared to me
        </button>
      </li>
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('sharedByMeRef', 'auto')}
            className={`flex flex-row gap-2 inline-block p-4 ${page==='sharedByMeRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
            >
            Shared by me
        </button>
      </li>    
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('shareMenuRef', 'auto')}
            className={`flex flex-row gap-2 inline-block p-4 ${page==='shareMenuRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
            >
            Shares
        </button>
      </li>    
      <li className="mr-2">
        <button 
        onClick={()=>tabSwitch('shareNewRef', 'auto')}
        className={`flex flex-row gap-2 inline-block p-4 ${page==='shareNewRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
          
            >
            <svg className="w-6 h-6 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="currentColor"></path> </g></svg>
        </button>
      </li> 
      
      {
        currentShared ? (
        <li className="mr-2">
          <button 
          onClick={()=>tabSwitch('shareNetworkRef', 'auto')}
          className={`flex flex-row gap-2 inline-block p-4 ${page==='shareNetworkRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} rounded-t-lg `}
            
              >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z" fill="currentColor"></path> </g></svg>
              <span>{currentShared.alias??currentShared.share}</span>
          </button>
        </li> 
      
        ) : ''
      }
      
      
    </ul>
  </div>
    )
}