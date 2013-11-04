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
            $('select').remove();
            $('input').remove();
            $('font').remove();
            $('style').remove();
            $('center').remove();
            $('form').remove();

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
            console.log(elements);
            //okHandler(elements.html());
            okHandler(JSON.stringify(simple, null, " "));
            }
        });
    }

var makeSimple = function(elem) {
    var simple = { }

    if (elem.type == "tag") {
        simple.tag = elem.name;
        if (notEmpty(elem.attribs)) simple.attribs = elem.attribs;
        var kids = simplifyKids(elem.children);
        if (kids && kids.length) {
            if (kids.length == 1 && kids[0].text) {
                simple.text = kids[0].text;
            }
            else {
                simple.children = kids;
            }
        }
    }
    else if (elem.type == "text") {
        var trimmed = elem.data.trim();
        if (trimmed) simple.text = trimmed;
    }
    // else {
    //     simple.unkown = elem;
    // }

    return simple;
}

var simplifyKids = function(kids) {
    var simpleKids = [];
    if (kids) {
        kids.forEach(function(kid) {
            if (kid) {
                var simpleKid = makeSimple(kid);
                if (notEmpty(simpleKid)) simpleKids.push(simpleKid);
            }
        });
    }
    return simpleKids;
}

var notEmpty = function(obj) {
    return Object.keys(obj).length > 0
}


