'use client';
import SignOut from "@/components/sign-out";
import toast from "react-hot-toast";
import { useCounter } from "@/components/context/context";
import { useSession } from "next-auth/react"
import prisma from "@/lib/prisma";
import PylonNew from "./pylon";
import UpdateProfile from "./updateProfile";

export default function Profile() {
  const [count, setCount] = useCounter();

  const curmount = count.meta?.[count.meta?.curmountid]
  const curshare = curmount?.shares?.filter((share)=>share.id == curmount?.curshareid)[0]
  
  const { data: session, status } = useSession()

  

  if (session?.user) {  
  return (

    
  
    <div className="w-full h-full px-4 gap-4 flex snap-x snap-mandatory snap-always overflow-x-hidden scrollbar-hide">
  <div id="UpdateProfileRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <UpdateProfile />
  </div>

  <div id="MyDownloadsNewRef" className="snap-center w-full overflow-y-scroll scrollbar-hide shrink-0">
    <PylonNew/>
  </div>

  
  

</div>
  

  );
  }
}
