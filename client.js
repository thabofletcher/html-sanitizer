var request = require('request');
var cheerio = require('cheerio');

exports.query = function(request, callback) {
	callback(queryById(request.url.substr(1)));
}

var queryById = function(id, callback) {
	var url = '';
	request.get(url, function(err, resp, body) {
	    if (err)
	        throw err;
	    if (resp.statusCode == 200) {
	    	$ = cheerio.load(body);
		    
	    	// parse here and fill out returnedObj

			var returnedObj = {};
			callback(JSON.stringify(returnedObj));
		}
	});	
}
