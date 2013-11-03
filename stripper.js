var request = require('request');
var cheerio = require('cheerio');

var url = process.argv[2];


exports.query = function(url, errorHandler, okHandler) {
    request.get(url, function(err, resp, body) {
        if (err) {
            errorHandler(err);
            return;
        }

        if (resp.statusCode == 200) {
            $ = cheerio.load(body);

            $('head').remove();
            $('script').remove();
            $('textarea').remove();
            $('input').remove();
            $('font').remove();
            $('style').remove();
            $('center').remove();

            var elements = $('*');
            elements.removeAttr('class');
            elements.removeAttr('style');
            elements.removeAttr('bgcolor');

            var simple = makeSimple($('body')[0]);

            // var tagfreq = {};
            // for (var i = 0; i < elements.length; i++) {
            //     var elem = elements[i];
            //     if (!tagfreq[elem.name])
            //         tagfreq[elem.name] = 1;
            //     else
            //         tagfreq[elem.name]++;
            //     }
            
            //console.log(tagfreq);
            console.log(simple);
            //okHandler(elements.html());
            okHandler(JSON.stringify(simple, null, " "));
            }
        });
    }

var makeSimple = function(elem) {
    return { 
        "tag" : elem.name,
        "attribs" : elem.attribs,
        "children" : simplifyKids(elem.children)
    };
}

var simplifyKids = function(kids) {
    var simpleKids = [];
    if (kids) {
        kids.forEach(function(kid) {
            simpleKids.push(makeSimple(kid));
        });
    }
    return simpleKids;
}


