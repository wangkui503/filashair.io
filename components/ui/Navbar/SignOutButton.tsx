'use client';

import SignOut from "@/components/sign-out";
export default function SignOutButton() {
  return (
    <a href="#"     
    className="flex items-center md:py-4 px-1 py-2 mr-8 rounded md:hover:bg-inherit md:hover:text-blue-700 md:md:active:text-gray-300 md:hover:bg-slate-300 ">
            <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 -hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12L16 12" stroke="#0285c7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
                    <span className="ml-3 whitespace-nowrap"
                    
                    ><SignOut /></span>
                  </a>      
  );
}


