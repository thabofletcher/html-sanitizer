var http = require('http');

exports.query = function(request, callback) {
	var post_data = 'ClientCandidateID=' + request.url.substr(1) + '&_=';

	// An object of options to indicate where to post to
	var post_options = {
	    host: 'www.zend.com',
	    port: '80',
	    path: '/en/store/education/certification/yellow-pages.php',
	    method: 'POST',
	    headers: {
			//'Origin': 'http://www.zend.com',
			'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
			//'X-Prototype-Version': '1.5.1.1',
			//'X-Return-Type': 'JSON',
			'X-Requested-With': 'XMLHttpRequest',
			//'Referer': 'http://www.zend.com/store/education/certification/yellow-pages.php',
			//'Accept-Encoding': 'gzip,deflate,sdch',
			//'Accept-Language': 'en-US,en;q=0.8'
			}
	};

	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
	    res.on('data', function(json) {
	    	callback(json);
	    });
	});

	post_req.write(post_data);
	post_req.end();
}
