#!/usr/bin/env node
var http = require('http');
var stripper = require('./stripper.js');
var view = require('./prettyview.js');


http.createServer(function  (request, response) {
	stripper.query(request.url.substr(1), 
		function(error) {console.log(error)},
		function(ok) {

			//var json = JSON.stringify(ok);
			// view.query()

	    	response.writeHead(200, {"Content-Type": "text/html"});
	    	//response.write(json);
	    	response.write(view.pretty(ok));
	    	response.end();
	});
}).listen(7770);