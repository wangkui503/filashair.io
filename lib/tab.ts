export function tabSwitch(id, behavior) {
    const element = document.getElementById(id);
    const bounding = element?.getBoundingClientRect();
    if (bounding && bounding?.left < 0) {
      element?.scrollIntoView({ behavior: behavior?? "auto", block: "start", inline: "nearest" });        
    }        

    if (bounding && bounding.right > (window.innerWidth || document.documentElement.clientWidth)) {
      element?.scrollIntoView({ behavior: behavior?? "auto", block: "start", inline: "nearest" });
    }
  }

export function gototop(id) {
  document.getElementById(id)?.scroll({top:0,behavior:'auto'});
}