const fs = require('fs');
const api = require('./api.js');
let pathtofile = null;
let setting;
let dir;
module.exports =  {
	setting: (event, status) => {
		const regex2 = /[\w]{1,}(eve_sharedcache_tq_tranquility)/;
		let path = process.argv[2];
		if (process.platform !== 'darwin') {
			let path = process.env['USERPROFILE']+"/AppData/Local/CCP/EVE/"
			if (fs.existsSync(path)){
				fs.readdir(path, (err, files) => {
					files.forEach(file => {
						let m2 = regex2.exec(file)
						if(m2){
							// peut etre save le path dans un fichier pour la prochaine ouverture et donc fait une meilleur fonction ici si path pas tout refaire
							pathtofile = process.env['USERPROFILE']+"/AppData/Local/CCP/EVE/"+m2[0];
							console.log(pathtofile);
							dir = fs.readdirSync(pathtofile);
							event.sender.send('setting', dir); 
						}
					});
				})
			} else {
				console.log('opps');
			}
		} else {
			console.log("on mac")
			pathtofile = "/Users/"+process.env['USER']+"/Library/Application Support/EVE Online/p_drive/Local Settings/Application Data/CCP/EVE/SharedCache/wineenv/drive_c/users/"+process.env['USER']+"/Local Settings/Application Data/CCP/EVE/c_tq_tranquility/"
			console.log(pathtofile);
			dir = fs.readdirSync(pathtofile);
			event.sender.send('setting', dir);
		}
	},
	sendChar : (event, data) => {
		console.log(data);
		if(data)
			pathtofile += "/" + data
		const regex = /core_char_([0-9]+).dat$/;
		if (fs.existsSync(pathtofile)){
			fs.readdir(pathtofile, function(err, items) {
				for (let i=0; i<items.length; i++) {
					let m = regex.exec(items[i])
					console.log(items[i])
					if(m){
						api.info(m[1], event, items[i])
					}
				}
			});
		}
	},
	backup : (data) => {
		console.log(data);
		console.log(pathtofile);
		for (let o in data){
			fs.writeFileSync(pathtofile + "/" +data[o] + ".backup", fs.readFileSync(pathtofile + "/" +data[o]));
		}
	},
	valide : (data) => {
		console.log(data);
		for (let o in data.profiles){
			fs.rename(pathtofile + "/" +data.profiles[o], pathtofile + "/" +data.profiles[o] + ".backupAuto", function(err) {
				if ( err ) console.log('ERROR: ' + err);
				fs.createReadStream(pathtofile + "/" +data.main).pipe(fs.createWriteStream(pathtofile + "/" +data.profiles[o]));
			});

		}
	}
}