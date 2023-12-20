'use client'
import React, { useRef, useEffect, useState, FormEvent } from 'react'

export default function FilterBar({setFilterPattern}) {    
    const filterPatternRef = useRef<HTMLInputElement | null>(null);  
    const clearFilterPattern = () => {
    if (!filterPatternRef.current) return
    setFilterPattern(undefined)
    filterPatternRef.current.value = ''
  }

    return (
        <div className="w-full pb-2 pr-2 flex flex-col md:flex-row ">    
      <div className="relative py-2 z-0 w-full mb-4 group border-b border-neutral-300">
          <input
            className="block pr-8 py-1 w-full bg-transparent appearance-none peer"
            placeholder=" "
            id="searchPattern"
            name="searchPattern"
            type="text"        
            ref={filterPatternRef}
            onChange={(e) => setFilterPattern(e.currentTarget?.value)}
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Filter
          </label>
          <button 
          type="reset"
          onClick={()=>clearFilterPattern()}
          className="block w-5 h-5 text-center text-xl leading-0 absolute top-5 right-2 text-gray-400 md:hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 15L21 21M21 15L15 21M10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L17 11" stroke="#1C274C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>
        </div>          
  </div>
    )

}