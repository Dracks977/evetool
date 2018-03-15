const fs = require('fs');
const api = require('./api.js');
var pathtofile = null;
module.exports =  {
	sendChar: (event, status) => {
		const regex = /core_char_([0-9]+).dat$/;
		var path = process.argv[2];
		if (process.platform !== 'darwin') {
			var letter = ["c", "d", "e", "f", "g", "h", "i", "g"]
			for (var i in letter){
				if (fs.existsSync(process.env['USERPROFILE']+"/AppData/Local/CCP/EVE/"+letter[i]+"_program_files_eve_sharedcache_tq_tranquility/settings_Default")) {
					pathtofile = process.env['USERPROFILE']+"/AppData/Local/CCP/EVE/"+letter[i]+"_program_files_eve_sharedcache_tq_tranquility/settings_Default";
					fs.readdir(pathtofile, function(err, items) {
						for (var i=0; i<items.length; i++) {
							var m = regex.exec(items[i])
							console.log(items[i])
							if(m){
								m[1]
								api.info(m[1], event, items[i])
							}
						}
					});
				}
			}
		} else {
			console.log("on mac")
			pathtofile = "/Users/"+process.env['USER']+"/Library/Application Support/EVE Online/p_drive/Local Settings/Application Data/CCP/EVE/SharedCache/wineenv/drive_c/users/"+process.env['USER']+"/Local Settings/Application Data/CCP/EVE/c_tq_tranquility/settings_Default"
			console.log(pathtofile);
			fs.readdir(pathtofile, function(err, items) {
				for (var i=0; i<items.length; i++) {
					var m = regex.exec(items[i])
					console.log(items[i])
					if(m){
						m[1]
						api.info(m[1], event, items[i])
					}

				}
			});
		}
	},
	backup : (data) => {
		console.log(data);
		console.log(pathtofile);
		for (var o in data){
			fs.writeFileSync(pathtofile + "/" +data[o] + ".backup", fs.readFileSync(pathtofile + "/" +data[o]));
		}
	},
	valide : (data) => {
		console.log(data);
		for (var o in data){
			fs.rename(pathtofile + "/" +data[o], pathtofile + "/" +data[o] + ".backupAuto", function(err) {
				if ( err ) console.log('ERROR: ' + err);
			});
		}
	}
}
