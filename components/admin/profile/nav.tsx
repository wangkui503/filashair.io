'use client';
import { tabSwitch } from "@/lib/tab";

export default function ProfileNav({page}) {   
    return (
      <div className="mb-4 text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
    <ul className="flex flex-wrap -mb-px">        
    <li className={`mr-2 flex flex-row ${page==='UpdateProfileRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} `}>
        <button 
        onClick={()=>tabSwitch('UpdateProfileRef', 'auto')}        
            className={`flex flex-row gap-2 inline-block p-4 rounded-t-lg md:hover:text-blue-600 `}
          
            >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M610.5 373.3c2.6-14.1 2.6-28.5 0-42.6l25.8-14.9c3-1.7 4.3-5.2 3.3-8.5-6.7-21.6-18.2-41.2-33.2-57.4-2.3-2.5-6-3.1-9-1.4l-25.8 14.9c-10.9-9.3-23.4-16.5-36.9-21.3v-29.8c0-3.4-2.4-6.4-5.7-7.1-22.3-5-45-4.8-66.2 0-3.3.7-5.7 3.7-5.7 7.1v29.8c-13.5 4.8-26 12-36.9 21.3l-25.8-14.9c-2.9-1.7-6.7-1.1-9 1.4-15 16.2-26.5 35.8-33.2 57.4-1 3.3.4 6.8 3.3 8.5l25.8 14.9c-2.6 14.1-2.6 28.5 0 42.6l-25.8 14.9c-3 1.7-4.3 5.2-3.3 8.5 6.7 21.6 18.2 41.1 33.2 57.4 2.3 2.5 6 3.1 9 1.4l25.8-14.9c10.9 9.3 23.4 16.5 36.9 21.3v29.8c0 3.4 2.4 6.4 5.7 7.1 22.3 5 45 4.8 66.2 0 3.3-.7 5.7-3.7 5.7-7.1v-29.8c13.5-4.8 26-12 36.9-21.3l25.8 14.9c2.9 1.7 6.7 1.1 9-1.4 15-16.2 26.5-35.8 33.2-57.4 1-3.3-.4-6.8-3.3-8.5l-25.8-14.9zM496 400.5c-26.8 0-48.5-21.8-48.5-48.5s21.8-48.5 48.5-48.5 48.5 21.8 48.5 48.5-21.7 48.5-48.5 48.5zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm201.2 226.5c-2.3-1.2-4.6-2.6-6.8-3.9l-7.9 4.6c-6 3.4-12.8 5.3-19.6 5.3-10.9 0-21.4-4.6-28.9-12.6-18.3-19.8-32.3-43.9-40.2-69.6-5.5-17.7 1.9-36.4 17.9-45.7l7.9-4.6c-.1-2.6-.1-5.2 0-7.8l-7.9-4.6c-16-9.2-23.4-28-17.9-45.7.9-2.9 2.2-5.8 3.2-8.7-3.8-.3-7.5-1.2-11.4-1.2h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c10.1 0 19.5-3.2 27.2-8.5-1.2-3.8-2-7.7-2-11.8v-9.2z"></path></g></svg>
            <span>Profile</span>
        </button>
      </li>    
      <li className={`mr-2 flex flex-row ${page==='MyDownloadsNewRef' ? 'text-blue-600 border-b-2 border-blue-600 active' : ''} `}>
      <button 
      onClick={()=>tabSwitch('MyDownloadsNewRef', 'auto')}
      className={`flex flex-row gap-2 inline-block p-4 rounded-t-lg md:hover:text-blue-600 `}
        >
          <svg className="w-5 h-5" fill="currentColor" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.483 511.483"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M443.667,242.939L273,8.272c-8.043-11.029-26.475-11.029-34.517,0L67.816,242.939c-5.419,7.488-5.419,17.6,0,25.088 l170.667,234.667c4.032,5.525,10.432,8.789,17.259,8.789s13.227-3.264,17.259-8.789l170.667-234.667 C449.085,260.539,449.085,250.427,443.667,242.939z"></path> </g> </g> </g></svg>          
          <span>Pylon</span>          
        </button>                
      </li>
      
      
      
    </ul>
  </div>
    )
}