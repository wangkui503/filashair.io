import toast from "react-hot-toast";

export async function getMyDownloads(list, setList, setMore) {
    fetch("/api/mydownloads?take=50&skip=" + list.length, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 200) {
        toast.success("Search..."); 
        const result = await res.json()
        if (result.length < 1) {
          setMore(false)
          return
        }
        setList([...list, ...result])        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    });
  }