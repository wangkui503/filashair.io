'use client';

import Form from "@/components/form";


export default function AuthUI() {
  return (
    <div>
          <input type="checkbox" id="auth-modal" />
        <label htmlFor="auth-modal" className="auth-modal-background" />
        <div className="auth-modal bg-slate-800 max-w-sm p-2 h-fit rounded-lg shadow-lg">
          
        <Form type="login" />  

        </div>
        </div>    
  );
}
