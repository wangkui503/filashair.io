'use client';
import SignOut from "@/components/sign-out";
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import prisma from "@/lib/prisma";

import NavMenu from "../menu";

export default function Mountsnav() {
  const [count, setCount] = useCounter();

  const curmount = count.meta?.[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
  
  const { data: session, status } = useSession()

  

  if (session?.user) {  
  return (
    <div className="h-full overflow-y-scroll">
      {/* <div className="flex justify-center">
        <img className="w-20 h-20" src="/air.svg"/>      
      </div> */}
    {session && (
      <p className="w-full text-stone-800 mb-4 text-center">
        Signed in as <span className="text-lg font-semibold">{session.user?.email}</span> ({session.user?.role})
      </p>
    )}
    
    {
      (!curmount || curmount?.foreign) ? '' : (
        <div className={`flex flex-col space-y-4 rounded bg-stone-50 px-4 py-4 mb-4 sm:px-16`}>
        <p>{curmount?.mount?.alias}</p>

          <div className="md:grid md:grid-cols-6 gap-3">
        <div className="">
          <label htmlFor="host" className="block mb-2 text-sm font-medium text-gray-900 ">Host</label>
          <p>{curmount?.mount?.host}</p>
        </div>
        <div className="">
          <label htmlFor="xfer_addr" className="block mb-2 text-sm font-medium text-gray-900 ">Transfer address</label>
          <p>{curmount?.mount?.xfer_addr}</p>
        </div>
        <div className="">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
          <p>{curmount?.mount?.username}</p>
        </div>
        <div className="">
          <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 ">Role</label>
          <p>{curmount?.self?.role}</p>
        </div>
        <div className="">
          <label htmlFor="domain" className="block mb-2 text-sm font-medium text-gray-900 ">Domain</label>
          <p>{curmount?.self?.domain}</p>
        </div>        
        <div className="">
          <label htmlFor="updatedat" className="block mb-2 text-sm font-medium text-gray-900 ">Last updated at</label>
          <p>{curmount?.mount?.updatedat}</p>
        </div>
        </div>
      </div>
      )
    }
      
{
  curshare? (
    <div className={`flex flex-col space-y-4 rounded bg-stone-50 px-4 py-4 sm:px-16`}>
        <p>{curshare?.id}</p>

          <div className="md:grid md:grid-cols-4 gap-3">
        <div className="">
          <label htmlFor="path" className="block mb-2 text-sm font-medium text-gray-900 ">Path</label>
          <p>{curshare?.path}</p>
        </div>
        <div className="">
          <label htmlFor="created_by" className="block mb-2 text-sm font-medium text-gray-900 ">Created by</label>
          <p>{curshare?.created_by}</p>
        </div>
        <div className="">
          <label htmlFor="last_updated_at" className="block mb-2 text-sm font-medium text-gray-900 ">Last updated at</label>
          <p>{curshare?.last_updated_at}</p>
        </div>
                        
        </div>
      </div>
  ) : ''
}
      

    
  
  <div className="z-0 px-2 grid grid-cols-3 gap-20 fadeInUp animated w-full opacity-90 bg-white  ">
        <NavMenu/>
        </div>
      </div>
  

  );
  }
}
