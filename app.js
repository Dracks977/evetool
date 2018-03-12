const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron')
const url = require('url')
const path = require('path')
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

    ipcMain.on('Bvalid', () => {
      console.log('Backup');
    });

    ipcMain.on('Rvalid', () => {
      console.log('Restor');
    });

    ipcMain.on('Avalid', () => {
      console.log('Aplly');
    }); 

    ipcMain.on('ready', (event, status) => {
      //ici faire les request api
      event.sender.send('info', 'disable');
      console.log('ready');
    });
      

  }
  
  app.on('ready', createWindow)