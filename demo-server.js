#!/usr/bin/env node
var http = require('http');
var sanitizer = require('./html-sanitizer.js');


var s = function(obj) { return JSON.stringify(obj, null, '  ') }

http.createServer(function  (request, response) {

	var write = function(data) {
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write(data);
		response.end();		
	}

	if(request.url.substr(1) == '') write("{'error':'no url'}");
	else {
		var extReq = require('request')
		var url = request.url.substr(1)
		var query = false

		var firstQ = url.indexOf('?')
		if (firstQ != -1) {
			var nextQ = url.indexOf('?', firstQ)
			
			if (nextQ != firstQ) {
				query = url.substr(nextQ)
				url = url.substr(0, nextQ)
			}
			else query = url.substr(firstQ)
		}

		extReq.get(url, function(err, resp, body) {
		    if (err)
		        write(s({'error': err }))
		    else if (resp.statusCode != 200)
		    	write(s({'response': response }))
		    else {
		    	var qo = sanitizer.load(body)

		    	var writeJson = function(obj) { write(s(obj)) }

		    	if (query) qo.query(unescape(query.substr(1)), writeJson)
		    	else qo.obj(writeJson)
		    }
		    	//if (request.headers.accept)
		        
		    	//sanitizer.load(body).json(write);
		});
	}

}).listen(7770);