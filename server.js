#!/usr/bin/env node
var http = require('http');
var client = require('./client.js');
 
http.createServer(function  (request, response) {
	client.query(request, function(json) {
    	response.writeHead(200);
    	response.write(json);
    	response.end();
	});
}).listen(80);