const { ipcRenderer } = require('electron')
const { $ } = require("./helper")


$('addMusic').addEventListener('click',()=>{
    ipcRenderer.send("addMusic")
})