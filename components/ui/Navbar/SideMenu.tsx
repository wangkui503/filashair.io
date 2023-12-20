'use client';
import { useState, useEffect, useRef } from "react";
import SignOut from "@/components/sign-out";
export default async function SideMenu() {

  
  return (
    <>
        <input type="checkbox" id="nav-Checkbox" className="hidden" />
        <label htmlFor="nav-Checkbox" className="nav-menu-background slideInRight animated">
          <div id="drawer-navigation" className="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto bg-slate-800 text-sky-500 w-64">
          <SignOut/>
            
            <div className="py-4 overflow-y-auto">
              <ul id="nav-ul" className="space-y-2 font-medium">
                <li>
                  <a href="/#services" className="flex items-center p-2 rounded md:hover:bg-slate-300 ">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 -hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#0285c7" viewBox="0 0 18 21">
                      <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">Products</span>
                  </a>
                </li>
                <li>
                  <a href="/#feature" className="flex items-center p-2 rounded md:hover:bg-slate-300 ">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 -hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#0285c7" viewBox="0 0 18 18">
                      <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">Features</span>                    
                  </a>
                </li>
                <li>
                  <a href="/#pricing" className="flex items-center p-2 rounded md:hover:bg-slate-300 ">
                    <img className="w-5 h-5 text-sky-600" src="/assets/img/icon/tag-price-svgrepo-com.svg" alt="Logo" />                    
                    <span className="flex-1 ml-3 whitespace-nowrap">Pricing</span>
                  </a>
                </li>
                <li>
                  <a href="/#lydiksen" className="flex items-center p-2 rounded md:hover:bg-slate-300 ">
                    <img className="w-6 h-6 text-sky-600" src="/assets/img/icon/hand-shake-handshake-svgrepo-com.svg" alt="Logo" />                    
                    <span className="flex-1 ml-3 whitespace-nowrap">Partnership</span>
                  </a>
                </li>
                <li>
                  <a href="/#Benchmarks" className="flex items-center p-2 rounded md:hover:bg-slate-300 ">
                    <img className="w-5 h-5 text-sky-600" src="/assets/img/icon/speedometer-sharp-svgrepo-com.svg" alt="Logo" />                    
                    <span className="ml-3">Benchmarks</span>
                  </a>
                </li>
                <li>
                  <a href="/#quickstart" className="flex items-center p-2 rounded md:hover:bg-slate-300 ">
                    <img className="w-5 h-5 text-sky-600" src="/assets/img/icon/gear-svgrepo-com.svg" alt="Logo" />                    
                    <span className="ml-3">Quick Start</span>
                  </a>
                </li>
                <li>
                  <a href="/openapi" className="flex items-center p-2 rounded md:hover:bg-slate-300 ">
                    <img className="w-5 h-5 text-sky-600" src="/assets/img/icon/gear-svgrepo-com-2.svg" alt="Logo" />                    
                    <span className="ml-3">OpenAPI</span>
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="flex items-center p-2 rounded md:hover:bg-slate-300 ">
                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 -hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#0285c7" viewBox="0 0 20 20">
                      <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">Contact</span>
                  </a>
                </li>                
              </ul>
            </div>
          </div>
        </label>
        </>            
  );
}
