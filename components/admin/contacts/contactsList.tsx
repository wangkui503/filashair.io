'use client';
import { tabSwitch } from "@/lib/tab";
import { useCounter } from "@/components/context/context";
import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, FormEvent } from 'react'
import { useSession } from "next-auth/react"
import { checkSourceDuplicate, checkDestDuplicate, checkSourceFriends, checkDestFriends, checkSourceNonFriends, checkDestNonFriends } from "@/lib/duplicate";
import NextPage from "../nextPage";
import { getNetwork } from "@/lib/network";
import ContactsNav from "./contactsNav";
import ContactCard from "./contactCard";
import FilterBar from "@/components/filterbar";
import { sherr } from "@/lib/errors";
import { toastPromise } from "@/lib/errors";

export default function ContactsList({session, list, setList, searchResultList, setSearchResultList, title, showOff, funcs, back, omitDel}) {   
  const emailsRef = useRef<HTMLDivElement | null>(null);
  const filterPatternRef = useRef<HTMLInputElement | null>(null);  
  const searchKeywordRef = useRef<HTMLInputElement | null>(null);  
  const funcsRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState([]);
  const [count, setCount] = useCounter();

  const [paging, setPaging] = useState({meta:0});
  const newLimit = () => setPaging({meta: paging.meta+1})
  
  const [more, setMore] = useState(true);
  useEffect(() => {
    if (paging.meta < 1) return
    console.log("ContactsList paging-- ", paging)
    getNetwork(list, setList, setMore)
  }, [paging]); 

  async function refreshList() {
    list = []
    getNetwork(list, setList, setMore)    
  }



  const [filterPattern, setFilterPattern] = useState();  
  
  function filter() {
    if (!filterPattern) return list
    
    const patterns = filterPattern.split(' ')
    let filtered = list
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      filtered = filtered.filter(item=> item.email?.includes(pattern) || item.name?.includes(pattern) || item.createdat?.includes(pattern))
    }
    
    return filtered
  }

  function clearFilterPattern() {
    if (!filterPatternRef.current) return
    setFilterPattern(undefined)
    filterPatternRef.current.value = ''
  }
  
  

  async function search(keyword) {
    await fetch("/api/network", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({keyword: keyword}),
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json()
        return result
      }
      throw res
    }).then(result => {
      setSearchResultList(result)
      console.log("contacts search---", result)        
      tabSwitch(title+'contactsSearchResultListRef', 'auto')
    }).catch(error => {
      sherr(error)
    })
  }

  

  
    return (
<>

  
  <div className="pb-4 bg-white ">
  <ContactsNav title={title} session={session} page={title+'contactsListRef'} back={back}/>
  </div>


  <div className="w-full flex flex-col md:flex-row ">
  <FilterBar setFilterPattern={setFilterPattern}/>
    
    <form onSubmit={(e) => {
        e.preventDefault();
        toastPromise(search(e.currentTarget.searchKeyword.value))
  }}
  className="w-full md:w-1/4 pb-2 bg-white ">

    <div className="relative py-2 z-0 w-full mb-4 group border-b border-neutral-300">
        <input
          className="block pr-16 py-1 w-full bg-transparent appearance-none peer"
          placeholder=" "
          id="searchKeyword"
          name="searchKeyword"
          type="text"
          required
          ref={searchKeywordRef}
        />
        <label
          htmlFor="email"
          className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Search
        </label>


    
        <button 
        type="submit"
        className="block w-7 h-7 text-center text-xl leading-0 absolute top-4 right-0 text-gray-400 md:hover:text-gray-900 transition-colors">
         <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="#1C274C"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg> 
        
        </button>        
        
      </div>
  </form>
  </div>









  <div className="w-full">

<div className="w-full grid md:grid-cols-5 justify-start border-b">

  <div className="flex flex-row md:col-span-2 justify-start gap-4 p-3 leading-normal">  
    <h5 className="font-semibold tracking-tight text-gray-900 ">
      Email    
    </h5>    
    <div>
      <button
      onClick={()=>refreshList()}
      >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.0789 2.25C7.2854 2.25 3.34478 5.913 2.96055 10.5833H2.00002C1.69614 10.5833 1.42229 10.7667 1.30655 11.0477C1.19081 11.3287 1.25606 11.6517 1.47178 11.8657L3.15159 13.5324C3.444 13.8225 3.91567 13.8225 4.20808 13.5324L5.88789 11.8657C6.10361 11.6517 6.16886 11.3287 6.05312 11.0477C5.93738 10.7667 5.66353 10.5833 5.35965 10.5833H4.4668C4.84652 6.75167 8.10479 3.75 12.0789 3.75C14.8484 3.75 17.2727 5.20845 18.6156 7.39279C18.8325 7.74565 19.2944 7.85585 19.6473 7.63892C20.0002 7.42199 20.1104 6.96007 19.8934 6.60721C18.2871 3.99427 15.3873 2.25 12.0789 2.25Z" fill="#1C274C"></path> <path d="M20.8411 10.4666C20.549 10.1778 20.0789 10.1778 19.7867 10.4666L18.1005 12.1333C17.8841 12.3471 17.8184 12.6703 17.9339 12.9517C18.0495 13.233 18.3235 13.4167 18.6277 13.4167H19.5268C19.1455 17.2462 15.8759 20.25 11.8828 20.25C9.10026 20.25 6.66586 18.7903 5.31796 16.6061C5.10042 16.2536 4.63833 16.1442 4.28583 16.3618C3.93334 16.5793 3.82393 17.0414 4.04146 17.3939C5.65407 20.007 8.56406 21.75 11.8828 21.75C16.6906 21.75 20.6475 18.0892 21.0331 13.4167H22.0002C22.3043 13.4167 22.5783 13.233 22.6939 12.9517C22.8095 12.6703 22.7437 12.3471 22.5274 12.1333L20.8411 10.4666Z" fill="#1C274C"></path> </g></svg>
      </button>
    </div> 
  </div>
  <div className="flex flex-col justify-between p-3 leading-normal">  
    <h5 className="font-semibold tracking-tight text-gray-900 ">
      Name    
    </h5>    
  </div>
  <div className="flex flex-col justify-start p-3 leading-normal">
    <p className="font-normal text-gray-700">
      Inbox
    </p>
  </div>
  
</div>


{
  filter().map((user, i) => (
      <ContactCard 
      key={i}
    i={i}
    contact={user}
    showOff={showOff}
    funcs={funcs}    
    omitDel={omitDel}
    />
      
    ))
}

  


</div>

<NextPage more={more} newLimit={newLimit}/>





</>
    );

}