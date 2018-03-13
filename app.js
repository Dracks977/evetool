const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron')
const url = require('url')
const path = require('path')
const request = require('request');
const fs = require('fs');
var pathtofile = null;

let win;

function getApi(id, event, items) {
  event.sender.send('load');
  request('https://esi.tech.ccp.is/latest/characters/names/?datasource=tranquility&character_ids=' + id, function (error, response, body) {
    if (error || response.statusCode == 400)
      return null
    event.sender.send('info', {img : "https://imageserver.eveonline.com/Character/" + id + "_128.jpg", name: JSON.parse(body)[0].character_name, id: id, filename: items}); 
  });
}

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
      for (var o in data){
        fs.writeFileSync(pathtofile + "/" +data[o] + ".backup", fs.readFileSync(pathtofile + "/" +data[o]));
      }
    });

    ipcMain.on('Rvalid', () => {
      console.log('Restor');
    });

    ipcMain.on('Avalid', (event, data) => {
      for (var o in data){
        fs.rename(pathtofile + "/" +data[o], pathtofile + "/" +data[o] + ".backupAuto", function(err) {
          if ( err ) console.log('ERROR: ' + err);
        });
      }
      //ici on fait le reste
      console.log('Aplly');
    }); 

    ipcMain.on('ready', (event, status) => {
      const regex = /core_char_([0-9]+).dat$/;
      var path = process.argv[2];
      var letter = ["c", "d", "e", "f", "g", "h", "i", "g"]
      for (var i in letter){
        if (fs.existsSync(process.env['USERPROFILE']+"/AppData/Local/CCP/EVE/"+letter[i]+"_program_files_eve_sharedcache_tq_tranquility/settings_Default")) {
          pathtofile = process.env['USERPROFILE']+"/AppData/Local/CCP/EVE/"+letter[i]+"_program_files_eve_sharedcache_tq_tranquility/settings_Default";
          fs.readdir(process.env['USERPROFILE']+"/AppData/Local/CCP/EVE/"+letter[i]+"_program_files_eve_sharedcache_tq_tranquility/settings_Default", function(err, items) {

            for (var i=0; i<items.length; i++) {

              var m = regex.exec(items[i])
              console.log(items[i])
              
              if(m){
                m[1]
                getApi(m[1], event, items[i])
              }

            }

          });

        }
      }
    });


  }
  
  app.on('ready', createWindow)