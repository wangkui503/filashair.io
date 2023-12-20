import copy from 'copy-to-clipboard';
export function clip(id) {
  // Get the text field
  var copyText = document.getElementById(id);
  var value = copyText.getAttribute("clipboard-target-text")  
  copy(value);
  alert(value);
}

export function clipText(id) {
  // Get the text field
  var copyText = document.getElementById(id);
  copyText.select();
  copy(copyText.value);
  alert(copyText.value);
}

