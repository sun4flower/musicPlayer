// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//既可以访问node 又可以访问node
const { ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded',()=>{
 ipcRenderer.send('message','hello from renderer')
 ipcRenderer.on('reply',(event,arg)=>{
     console.log(arg)
     document.getElementById('message').innerHTML=arg
 })
})