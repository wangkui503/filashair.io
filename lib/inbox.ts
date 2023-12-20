import toast from "react-hot-toast";
export async function setInbox(session, curmount, parentPath, file) {
    const path = parentPath + file.name + '/';      
    fetch("/api/inbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user?.email,
        mount_id: curmount?.mount?.id,
        share: curmount?.curshareid,
        path: path,
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        toast.success("Inbox set!");
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
    });
  }