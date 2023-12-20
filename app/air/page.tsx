'use client';
import { tabSwitch } from "@/lib/tab";
import toast from "react-hot-toast";
import Sidebar from '@/components/admin/Sidebar'
import Bottomnav from '@/components/Bottomnav'
import Mountsnav from '@/components/Mountsnav'
import Sharenav from '@/components/Sharenav'
import HomeTab from '@/components/admin/hometab'
import Create from '@/components/admin/create'
import Contacts from "@/components/admin/contacts/contacts";
//import prisma from "@/lib/prisma";
import XferAccount from '@/components/admin/xferAccount/XferAccount'
import { useEffect, useState, useRef } from "react";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
//import GetServerSession from '@/lib/session'
import { useSearchParams } from 'next/navigation'
import Transfers from "@/components/admin/transfers/transfers";
import Messages from "@/components/admin/messages/messages";
import SharesTab from "@/components/admin/shares/sharesTab";
import XferStorages from "@/components/admin/xferStorage/XferStorages";
import XferEvents from "@/components/admin/xferEvent/XferEvents";
import XferKey from "@/components/admin/xferKey/XferKey";
import XferPolicy from "@/components/admin/xferPolicy/XferPolicy";
import Profile from "@/components/admin/profile/profile";
import FilesPage from "@/components/admin/files/page";
import XferPage from "@/components/admin/xferXfer/page";

import { setInbox } from "@/lib/inbox";

import { getPylonToken } from "@/lib/getXferAccount";
import { getPylonSelf } from "@/lib/getXferAccount";



export default function AdminHome() {
  const { data: session, status } = useSession()
  const [count, setCount] = useCounter();
  const curmount = count.meta?.[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]

  if (curmount) {
    curmount.foreign = curmount?.mount?.email != session?.user?.email 
  }

  const [currentPath, setCurrentPath] = useState({meta:'/'});  

  const [currentPage, setCurrentPage] = useState('home');
  
  const searchParams = useSearchParams()
  const invite = searchParams.get('invite')
  console.log("invite param--------", invite)


  

  
  const [loaded, setLoaded] = useState(false);
  
  /* const session = await GetServerSession()
  const mounts = await prisma.mount.findMany({
    select: {
      id:true,
      email:true,
      host:true,
      xfer_addr:true,
      kid:true,
      username:true,
      createdby:true,
      createdat:true,
      updatedat:true,      
    },
    where: {
        email: session?.user?.email,
    },
  });

  console.log("mounts-----------------",mounts)
   */

  function setInvite() {
    count.meta.invite = invite
    console.log("setInvite meta--------", count.meta)
    setCount({
      meta: count.meta
    })
  }

  async function getLoginDetails(email) {
    fetch("/api/users/" + email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },    
    }).then(async (res) => {
      if (res.status === 200) {
        const user = await res.json()
        count.meta.curuser = user
        setCount({
          meta: count.meta
        })
        console.log("getLoginDetails--------------",user)             
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }


  useEffect(() => {
    
    const email = session?.user?.email
    if (!email) return

    
    if (!loaded && email) {
    
      console.log("email..........", email)


      /* getPylonToken('super', (token) => {
        console.log("pylon token----", token)
        getPylonSelf(token, (self) => {
          console.log("pylon self----", self)
        })
      })
       */

      getLoginDetails(email)
    
      

    console.log("session.user---", session?.user)

    setInvite()
    setLoaded(true)
    }
  });


  const HomeTabRef = useRef<HTMLDivElement | null>(null);
  const FilesPageRef = useRef<HTMLDivElement | null>(null);
  const MessagesRef = useRef<HTMLDivElement | null>(null);
  const TransfersRef = useRef<HTMLDivElement | null>(null);
  const ContactsRef = useRef<HTMLDivElement | null>(null);
  const XferAccountRef = useRef<HTMLDivElement | null>(null);
  const SharesTabRef = useRef<HTMLDivElement | null>(null);
  const XferStoragesRef = useRef<HTMLDivElement | null>(null);
  const XferPageRef = useRef<HTMLDivElement | null>(null);
  const XferEventsRef = useRef<HTMLDivElement | null>(null);
  const ProfileRef = useRef<HTMLDivElement | null>(null);
  

  function runObserver(ref) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (target === ref.current && isIntersecting) {
            setCurrentPage(target.id)     
            tabSwitch('nav_'+target.id,'smooth')
            console.log("intersect target.......", 'nav_'+target.id, target)
            
          }
        });
      },
      {
        threshold: 0.7,
      }
    );
  
    if (ref.current) {
      observer.observe(ref.current);
    }
    return observer
  }


  useEffect(() => {
    const observers = [HomeTabRef, 
      FilesPageRef, 
      MessagesRef, 
      TransfersRef,
      ContactsRef,
      XferAccountRef,
      SharesTabRef,
      XferStoragesRef,
      XferPageRef,
      XferEventsRef,
      ProfileRef
    ].map((ref) => {
      return runObserver(ref)
    })
    
    return () => {
      observers.map((observer) => {
        observer.disconnect();  
      })    
    };
  }, [,curmount]);

  async function deleteStorage(storage) {
    toast.error('delete storage not implemented')
  }


  return (
    <div className="flex h-[calc(100dvh)] flex-col">
      <Mountsnav/>
      <Sharenav/>
      

    <div className="flex-1 overflow-y-hidden w-screen h-full flex snap-x snap-mandatory snap-always overflow-x-scroll scrollbar-hide">
      <div className="snap-center w-full h-full shrink-0" ref={HomeTabRef} id="home" >
        <HomeTab/>
      </div>
      <div className="snap-center w-full h-full shrink-0" ref={FilesPageRef} id="files">
        <FilesPage currentPath={currentPath} setCurrentPath={setCurrentPath} title={''} funcs={[{name: 'Set as inbox', action: setInbox}]}/>
      </div>


      <div className="snap-center w-full h-full shrink-0" ref={MessagesRef} id="messages">
        <Messages currentPath={currentPath} setCurrentPath={setCurrentPath} />
      </div>

      <div className="snap-center w-full h-full shrink-0" ref={TransfersRef} id="transfers">
      <Transfers/>
      </div>

      <div className="snap-center w-full h-full shrink-0" ref={ContactsRef} id="network">
      <Contacts funcs={[]}/>
      </div>

      <div className="snap-center w-full h-full shrink-0" ref={XferAccountRef} id="account">
      <XferAccount/>
      </div>

      <div className="snap-center w-full h-full shrink-0" ref={SharesTabRef} id="shares">
        <SharesTab/>
      </div>

      {
          (!curmount || curmount.foreign) ? '' : (
            <>
        <div className="snap-center w-full h-full shrink-0" ref={XferStoragesRef} id="storages">
        <XferStorages title="Storages" funcs={[]}/>
        </div>
        <div className="snap-center w-full h-full shrink-0" ref={XferPageRef} id="xfers">
          <XferPage/>
        </div>
        <div className="snap-center w-full h-full shrink-0" ref={XferEventsRef} id="events">
          <XferEvents/>
        </div>
        </>
              )
            }
        <div className="snap-center w-full h-full shrink-0" ref={ProfileRef} id="profile">
          <Profile/>
        </div>
        {/* 
        <div className="snap-center w-full h-full shrink-0" ref={refs[11]} id="policies">
          <XferPolicy/>
        </div>
        <div className="snap-center w-full h-full shrink-0" ref={refs[12]} id="keys">
          <XferKey/>
        </div>
        */}
    
    
    </div>


      
      
  

        <Bottomnav currentPage={currentPage}/>

</div>

  )
}
