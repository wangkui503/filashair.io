import toast from "react-hot-toast";

export async function sherr(res) {
    const ContentLength = Number(res.headers?.get("Content-Length"))
    if (ContentLength > 0) {
    const error = await res.json();        
    toast.error(error.message?? error);
    } else {
    toast.error(res.message?? res.statusText?? res);
    }
    console.log(res)
}

export async function toastPromise(thePromise) {
  toast.promise(
    thePromise,
     {
       loading: 'Loading...',
       success: 'Done',
       error: (err) => `${err.toString()}`,
     }
   );
}