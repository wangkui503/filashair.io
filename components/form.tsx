"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import LoadingDots from "@/components/loading-dots";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Form({has}) {
  const [type, setType] = useState('login');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  

  return (
    <>
    <h1 className="text-xl font-semibold leading-tight tracking-tight text-stone-800 md:text-2xl">
    {type === "login" ? "Sign In" : type === "register" ? "Sign Up" : type === "reset" ? "Reset Password" : type === "change" ? "Change Password" : ''}
    </h1>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        if (type === "login") {
          signIn("credentials", {
            redirect: false,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
            // @ts-ignore
          }).then(({ error }) => {
            if (error) {
              setLoading(false);
              toast.error(error.message?? error);
            } else {
              router.refresh();
              router.push("/air");
            }
          });
        } else if (type === "register") {
          if (e.currentTarget.password.value != e.currentTarget.confirmPassword.value) {
            toast.error("Password not match!");
            setLoading(false);
            return
          }
          fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: e.currentTarget.email.value,
              password: e.currentTarget.password.value,
            }),
          }).then(async (res) => {
            setLoading(false);
            if (res.status === 200) {
              toast.success("Account created! Redirecting to login...");
              setTimeout(() => {
                setType('login')                
              }, 1500);
            } else {
              const { error } = await res.json();
              toast.error(error.message?? error);
            }
          });
        } else if (type === "reset") {
          fetch("/api/auth/reset", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: e.currentTarget.email.value,
            }),
          }).then(async (res) => {
            setLoading(false);
            if (res.status === 200) {
              toast.success("Password reset email sent, please check your email inbox! Redirecting to login...");
              setTimeout(() => {
                setType('login')                
              }, 1500);
            } else {
              const { error } = await res.json();
              toast.error(error.message?? error);
            }
          });
        } else if (type === "change") {
          if (e.currentTarget.password.value != e.currentTarget.confirmPassword.value) {
            toast.error("Password not match!");
            setLoading(false);
            return
          }
          fetch("/api/auth/register", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: e.currentTarget.email.value,
              old: e.currentTarget.oldPassword.value,
              password: e.currentTarget.password.value,
            }),
          }).then(async (res) => {
            setLoading(false);
            if (res.status === 200) {
              toast.success("Password changed! Redirecting to login...");
              setTimeout(() => {
                setType('login')                
              }, 1500);
            } else {
              const { error } = await res.json();
              toast.error(error.message?? error);
            }
          });
        }
      }}
      className={`flex flex-col space-y-4 rounded-lg ${type === "login" ? "bg-stone-50" : "bg-blue-50"} px-4 py-4 sm:px-16`}
    >

      

      <div className="relative z-0 w-full mb-4 group border-b border-neutral-300">
        <input
          className="block py-2 w-full bg-transparent appearance-none peer"
          placeholder=" "
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <label
          htmlFor="email"
          className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Email address
        </label>
      </div>
      {
        type === "change" ? (
          <div className="relative z-0 w-full mb-4 group border-b border-neutral-300">        
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              required
              className="block py-2 w-full bg-transparent appearance-none peer"
              placeholder=" "
            />
            <label
              htmlFor="oldPassword"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Old Password
            </label>
          </div>
        ) : ''
      }
      {
        type != "reset" ? (
          <div className="relative z-0 w-full mb-4 group border-b border-neutral-300">        
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block py-2 w-full bg-transparent appearance-none peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>
        ) : ''
      }
      {
        type === "register" || type === "change" ? (
          <div className="relative z-0 w-full mb-4 group border-b border-neutral-300">        
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="block py-2 w-full bg-transparent appearance-none peer"
              placeholder=" "
            />
            <label
              htmlFor="confirmPassword"
              className="peer-focus:font-medium absolute text-sm text-slate-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm Password
            </label>
          </div>
        ) : ''
      }
      
      <button
        disabled={loading}
        className={`${
          loading
            ? "cursor-not-allowed border-gray-200 bg-gray-100"
            : "border-black bg-black text-white md:hover:bg-white md:hover:text-black"
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all `}
      >
        {loading ? (
          <LoadingDots color="#808080" />
        ) : (
          <p>{type === "login" ? "Sign In" : type === "register" ? "Sign Up" : type === "reset" ? "Reset Password" : type === "change" ? "Change Password" : 'Submit'}</p>
        )}
      </button>
      

      {
        !has && type != "register" ? (
          <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button onClick={()=>setType('register')} className="font-semibold text-gray-800">
            Sign up
          </button>{" "}
          for free.
        </p>
        ) : ''
      }

      {
        type != "login" ? (
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={()=>setType('login')} className="font-semibold text-gray-800">
              Sign in
            </button>{" "}
            instead.
          </p>
        ) : ''
      }
      
      {
        type != "reset" ? (
        <p className="text-center text-sm text-gray-600">
          Forgot the password?{" "}
          <button onClick={()=>setType('reset')} className="font-semibold text-gray-800">
            Reset
          </button>{" "}          
        </p>
        ) : ''
      }
      {
        type != "change" ? (
        <p className="text-center text-sm text-gray-600">
          <button onClick={()=>setType('change')} className="font-semibold text-gray-800">
          Change The Password
          </button>{" "}          
        </p>
        ) : ''
      }
      
    </form>
    </>
  );
}
