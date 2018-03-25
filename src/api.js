const request = require('request');
const dateFormat = require('dateformat');
module.exports =  {
	info: (id, event, items) => {
		request('https://esi.tech.ccp.is/latest/characters/names/?datasource=tranquility&character_ids=' + id, function (error, response, body) {
			if (error || response.statusCode != 200)
				throw body
			event.sender.send('info', {img : "https://imageserver.eveonline.com/Character/" + id + "_128.jpg", name: JSON.parse(body)[0].character_name, id: id, filename: items}); 
		});
	},
	infoRecup: (event, id, date, file) => {
		request('https://esi.tech.ccp.is/latest/characters/names/?datasource=tranquility&character_ids=' + id, function (error, response, body) {
			if (error || response.statusCode != 200)
				throw body
			var datez = new Date(date*1000)
			event.sender.send('showRecup',{"name": JSON.parse(body)[0].character_name, "date": dateFormat(datez, "dd-mm-yy HH:MM:ss"), "file": file, "id": id});
		});
	}
}
