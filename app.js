const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron')
const url = require('url')
const path = require('path')
const char = require('./src/char.js')

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

    ipcMain.on('ready', (event, status) => {
      char.sendChar(event, status);
    });


  }
  
  app.on('ready', createWindow)