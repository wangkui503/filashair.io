import toast from "react-hot-toast";
export async function deleteShared(id, callback) {
    fetch('/api/shareds/'+id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",        
      },    
    }).then(async (res) => {
      if (res.status === 200) {
        const result = await res.json();
        callback(result)                
      } else {
        const error = await res.json();
        toast.error(error.message?? error);
      }
    });
  }