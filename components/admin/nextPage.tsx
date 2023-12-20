'use client'
import { useCounter } from "@/components/context/context";
import { useRef, useContext, useEffect, useState } from "react";

export default function NextPage({more, newLimit, monitors}) {   
    
    const nextBtnRef = useRef<HTMLDivElement | null>(null);

    
    useEffect(() => {
        if (!nextBtnRef?.current) return;
        
        const observer = new IntersectionObserver(([entry]) => {
            
          if (more && entry.isIntersecting) {
            newLimit()
            console.log("NextPage---", more, entry.isIntersecting)
          }
        },
        {
            threshold: 1,
        }
        );
        
      
        observer.observe(nextBtnRef.current);
        return () => {
              observer.disconnect();              
          };
        
      }, [more, ...monitors??[]]);

      if (!more) return ''



    return (
        
        <div ref={nextBtnRef} className={` w-full flex justify-center py-4 shadow-md md:hover:bg-slate-200`}>
    <button 
    onClick={newLimit}
    className="w-full flex flex-row justify-center">
      <div className="w-8 h-8">
      <svg
  viewBox="0 0 20 20"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  fill="#000000"
>
  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
  <g id="SVGRepo_iconCarrier">
    {" "}
    <g id="layer1">
      {" "}
      <path
        d="M 6 5.2929688 L 5.2910156 6 L 5.6464844 6.3535156 L 10 10.708984 L 14.353516 6.3535156 L 14.708984 6 L 14 5.2929688 L 13.646484 5.6464844 L 10 9.2929688 L 6.3535156 5.6464844 L 6 5.2929688 z M 6 9.2910156 L 5.2910156 9.9980469 L 5.6464844 10.351562 L 10 14.707031 L 14.353516 10.351562 L 14.708984 9.9980469 L 14 9.2910156 L 13.646484 9.6445312 L 10 13.291016 L 6.3535156 9.6445312 L 6 9.2910156 z "
        style={{
          fill: "#222222",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 0
        }}
      />{" "}
    </g>{" "}
  </g>
</svg>

    </div>
    <div className="pt-1">More...</div>
      </button>    
  </div>

    )
}