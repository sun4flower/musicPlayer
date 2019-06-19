//负责创建窗口 也就是renderer
const { app, BrowserWindow, ipcMain ,dialog } = require('electron')
const DataStore = require('./MuiscDataStore')
const myStore = new DataStore({'name':'music data'})
const Store = require("electron-store");
const store = new Store()
//console.log(app.getPath('userData'))
// store.set('unicorn','333')
// console.log(store.get('unicorn'))

// store.set('foo.bar',true)
// console.log(store.get('foo'))

// store.delete('unicorn')
//创建窗口

  class appWindow extends BrowserWindow{
    constructor(config,fileLocation) {
      const basicConfig = {
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true//在应用中可以使用nodejs api
        }
      }
      //const finalConfig = Object.assign(basicConfig, config)
      const finalConfig = { ...basicConfig, ...config}
      super(finalConfig)
      this.loadFile(fileLocation)
      this.once('ready-to-show',()=>{
        this.show()
      })
    }
   
  }
  app.on('ready',()=>{
    const mainWindow=new appWindow({},"./renderer/index.html");
    mainWindow.webContents.on('did-finish-load',()=>{
      mainWindow.send("getTracks",myStore.getTracks())
      
    })
    ipcMain.on('addMusic',(event,arg)=>{
      const addWindow = new appWindow({  
        width: 400,
        height: 300,
        parent:mainWindow
      },"./renderer/add.html")

    })
    ipcMain.on('add-tracks',(event,tracks)=>{
      const updateTracks=myStore.addTracks(tracks).getTracks();
      mainWindow.send("getTracks",updateTracks)
    })
    ipcMain.on('open-music-file',(event,arg)=>{
        dialog.showOpenDialog({
          properties:['openFile','multiSelections'],
          filters:[{name:'Music',extensions:['mp3']}]
        },(files)=>{
          if(files){
            event.sender.send('selected-file',files)
          }
        })
    })
    ipcMain.on('deleteTrack',(event,id)=>{
      const updateTracks=myStore.deleteTrack(id).getTracks()
      mainWindow.send("getTracks",updateTracks)
    })
  
})
