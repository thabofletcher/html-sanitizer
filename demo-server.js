#!/usr/bin/env node
var http = require('http');
var sanitizer = require('./html-sanitizer.js');


http.createServer(function  (request, response) {

	var write = function(data) {
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write(data);
		response.end();		
	}

	if(request.url.substr(1) == '') write("{'error':'no url'}");
	else {
		var extReq = require('request');
		extReq.get(request.url.substr(1), function(err, resp, body) {
	        if (err)
	            write("{'error':'" + JSON.stringify(err) + "'}");
	        else if (resp.statusCode != 200)
	        	write("{'response':'" + JSON.stringify(response) + "'}")
	        else
	        	if (request.headers.accept)
	            sanitizer.load(body).query('body.0.id', write)
	        	//sanitizer.load(body).json(write);
	        });
		}

}).listen(7770);