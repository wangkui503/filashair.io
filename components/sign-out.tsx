"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <button
      className="whitespace-nowrap text-sm text-slate-500 group-hover:text-sky-600 -hover:text-sky-500 z-[9999]"
      onClick={() => signOut()}
    >
      Sign out
      
    </button>
  );
}
