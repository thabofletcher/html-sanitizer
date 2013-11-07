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

            //console.log(elements);
            //okHandler(elements.html());
            okHandler(JSON.stringify(simple, null, " "));
            }
        });
    }

var makeSimple = function(elem) {
    var simple = { }

    if (elem.type == "tag") {

        if (notEmpty(elem.attribs)) simple[elem.name] = elem.attribs;
        else simple[elem.name] = {};

        var kids = simplifyKids(elem.children);
        if (kids && kids.length) {
            if (kids.length == 1 && kids[0].text) {
                simple[elem.name] = kids[0].text;
            }
            else {
                simple[elem.name].children = kids;
            }
        }
    }
    else if (elem.type == "text") {
        var trimmed = elem.data.trim();
        if (trimmed) simple.text = trimmed;
    }
    else if (elem.type == "comment") {
        var trimmed = elem.data.trim();
        if (trimmed) simple.comment = trimmed;
    }
    else {
        var unkown = {}
        unkown[elem.type] = elem;
        console.log(unkown);
    }

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


