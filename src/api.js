module.exports =  {
	info: (id, event, items) => {
		const request = require('request');
		event.sender.send('load');
		request('https://esi.tech.ccp.is/latest/characters/names/?datasource=tranquility&character_ids=' + id, function (error, response, body) {
			if (error || response.statusCode == 400)
				return null
			event.sender.send('info', {img : "https://imageserver.eveonline.com/Character/" + id + "_128.jpg", name: JSON.parse(body)[0].character_name, id: id, filename: items}); 
		});
	}
}
