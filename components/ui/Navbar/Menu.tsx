'use client';
import { useState, useEffect, useRef } from "react";
import SignOut from "@/components/sign-out";
import SideMenu from "./SideMenu"
import { useSession } from "next-auth/react"

export default async function Menu() {
  const { data: session, status } = useSession()
  
  useEffect(() =>{
    const sensitive = 10
    var prevScrollpos = window.scrollY;    
      const navbar = document.getElementById("navbar")
      const navCheckbox = document.getElementById('nav-Checkbox') as HTMLInputElement
      const navul = document.getElementById("nav-ul")
      
      const bottomnavbar = document.getElementById("bottomnavbar")
      const licensenavbar = document.getElementById("licensenavbar")
      const licensesearch = document.getElementById("licensesearch")
      
      const ulOnClick = async () => {
        navCheckbox.checked = false
      }

      const handleWindowResize = (e: UIEvent) => {
        navCheckbox.checked = false
      };
  
      
    function onScroll() {
      const currentScrollPos = window.scrollY;
      const limit = document.body.offsetHeight - window.innerHeight;
      
      if (window.scrollY > limit || currentScrollPos <= 0 || prevScrollpos > currentScrollPos && prevScrollpos- currentScrollPos > sensitive) {
        navbar?.classList.remove('hidden')
        bottomnavbar?.classList.remove('hidden')
        licensenavbar?.classList.replace('bottom-0', 'bottom-14')        
        licensesearch?.classList.replace('bottom-14','bottom-28') 
        prevScrollpos = currentScrollPos;
      } else if (prevScrollpos < currentScrollPos && currentScrollPos - prevScrollpos > sensitive){    
        navbar?.classList.add('hidden')
        bottomnavbar?.classList.add('hidden')
        licensenavbar?.classList.replace('bottom-14', 'bottom-0') 
        licensesearch?.classList.replace('bottom-28','bottom-14')                
        prevScrollpos = currentScrollPos;
      }      
    }

    
        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", handleWindowResize);
        navul?.addEventListener("click", ulOnClick);
        
        return () =>{
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", ulOnClick);
          navul?.addEventListener("click", ulOnClick);
        };
      }, []);
  
  return (
    <nav id="navbar" 
className="
fadeInDown animated
fixed top-0 left-0 z-30 w-full opacity-90
text-blue bg-slate-800">
        <SideMenu/>
        <label htmlFor="nav-Checkbox" id="nav-Toggle" className="select-none absolute md:hidden cursor-pointer my-2 mx-4 right-0 opaque-100">
          <svg id="svg-menu" className="w-6 fill-slate-300 mt-2" viewBox="0 0 448 512" width={100} ><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" /></svg>
          <svg id="svg-close" className="w-6 fill-slate-300 hidden mt-2" viewBox="0 0 384 512" width={100} ><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" /></svg>
        </label>
    <ul id="nav-ul" className="nav-Menu flex flex-col md:flex-row text-right text-slate-400">
          <li className="block py-2 m-auto ml-3 flex">
            <ul className="flex flex-row">
            <li><a href="/" className="m-auto no-underline" aria-label="Home page">
            <img src="/assets/img/logo.svg" className=" w-28" alt="Filash.io Logo" />            
            </a></li>
            <li className="my-auto"><span className="font-libre text-sm truncate">Distance No Long Matters</span></li>
            </ul>
          </li>
          <li className="nav-menu-item list-none hidden font-semibold md:block"><a href="/#services" className="w-full flex no-underline p-4 border-0 text-sky-600 md:hover:text-blue-700 active:text-gray-300" aria-label="About me">Products</a></li>
          <li className="nav-menu-item list-none hidden font-semibold md:block"><a href="/#feature" className="w-full flex no-underline p-4 border-0 text-sky-600 md:hover:text-blue-700 active:text-gray-300">Features</a></li>
          <li className="nav-menu-item list-none hidden font-semibold md:block"><a href="/#pricing" className="w-full flex no-underline p-4 border-0 text-sky-600 md:hover:text-blue-700 active:text-gray-300" aria-label="Posts">Pricing</a></li>
          <li className="nav-menu-item list-none hidden font-semibold md:block"><a href="/#lydiksen" className="w-full flex no-underline p-4 border-0 text-sky-600 md:hover:text-blue-700 active:text-gray-300" aria-label="Posts">Partnership</a></li>
          <li className="nav-menu-item list-none hidden font-semibold md:block"><a href="/#Benchmarks" className="w-full flex no-underline p-4 border-0 text-sky-600 md:hover:text-blue-700 active:text-gray-300" aria-label="Benchmarks">Benchmarks</a></li>
          <li className="nav-menu-item list-none hidden font-semibold md:block"><a href="/#quickstart" className="w-full truncate flex no-underline p-4 border-0 text-sky-600 md:hover:text-blue-700 active:text-gray-300" aria-label="How it works">Quick Start</a></li>
          <li className="nav-menu-item list-none hidden font-semibold md:block"><a href="/openapi" className="w-full truncate flex no-underline p-4 border-0 text-sky-600 md:hover:text-blue-700 active:text-gray-300" aria-label="How it works">OpenAPI</a></li>
          <li className="nav-menu-item list-none hidden font-semibold md:block"><a href="/#contact" className="w-full flex no-underline p-4 border-0 text-sky-600 md:hover:text-blue-700 active:text-gray-300" aria-label="Contact me">Contact</a></li>
          <li className="nav-menu-item list-none hidden font-semibold md:block">
            {
              session ? <SignOut/> : ''
            }
          
          </li>
        </ul>
        </nav>
  );
}
