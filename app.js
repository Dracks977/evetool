const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron')
const url = require('url')
const path = require('path')
const char = require('./src/char.js')
const {autoUpdater} = require("electron-updater");


let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 1100, height: 800})

    // et charge le index.html de l'application.
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    //Menu.setApplicationMenu(null);
    win.on('closed', function(){
      app.quit();
    })

    ipcMain.on('Bvalid', (event, data) => {
      char.backup(data);
    });

    ipcMain.on('Rvalid', () => {
      console.log('Restor');
    });

    ipcMain.on('Avalid', (event, data) => {
     char.valide(data);
   }); 

    ipcMain.on('ready', (event, status ) => {
      char.setting(event, status);
    });

    ipcMain.on('sendChar', (event, data) => {
      char.sendChar(event, data);
    });


  }

  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
    win.webContents.send('updateReady')
  });

  autoUpdater.on('update-available', (info) =>{
    console.log('update dispo je dl')
    win.webContents.send('dl');
  })

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(progressObj)
    win.setProgressBar(progressObj.percent/100)
  })

  ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall();
  })
  
  app.on('ready', function(){
    createWindow();
    autoUpdater.checkForUpdates();
  })