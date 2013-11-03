#!/usr/bin/env node
var http = require('http');
var stripper = require('./stripper.js');

http.createServer(function  (request, response) {
	stripper.query(request.url.substr(1), 
		function(error) {console.log(error)},
		function(json) {
	    	response.writeHead(200);
	    	response.write(json);
	    	response.end();
	});
}).listen(8888);