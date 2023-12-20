
async function messaging(direction, message, specs) {
    const data = {
      kind: 'xfer',
      email: session?.user?.email,
      direction: direction,
      message: message,
      specs: specs,
    }
    
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },      
      body: JSON.stringify(data),
    })
    
    
      if (res.status === 200) {
        const transfer = await res.json()
        addNewTransfer(transfer)
        runningTransfer.meta = transfer
        setRunningTransfer({meta:runningTransfer.meta})     
        console.log("messaging data----", transfer)        
        
      } else {
        const error  = await res.json();
        toast.error(error.message?? error);
        console.log(error.message?? error)
      }
      


  }