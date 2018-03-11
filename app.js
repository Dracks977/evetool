const {app, BrowserWindow, Menu} = require('electron')
const url = require('url')
const path = require('path')
  
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
  }
  
  app.on('ready', createWindow)