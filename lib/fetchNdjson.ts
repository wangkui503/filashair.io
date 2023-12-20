export function fetchNdjson(resource, init, resultfn) {
    // note that the server must flush
    // periodically to actually stream
  
    const decoder = new TextDecoder();
    let buf = ''; 
  
    return fetch(resource, init).then(resp => {
        const reader = resp.body.getReader()
        let running = true
        return reader.read().then(function process({ value, done }) {            
            if (done || !running) {
                resultfn(JSON.parse(buf), true, resp);
                return;
            }
  
            buf += decoder.decode(value, { stream: true }); 
            const lines = buf.split(/[\r\n](?=.)/);
            buf = lines.pop();
            lines.map(JSON.parse).forEach((ele) => {running = resultfn(ele, false, resp)});
            return reader.read().then(process);
        });
    });
  }