var cheerio = require('cheerio')

exports.load = function(html, options) {
    $ = cheerio.load(html)
    var elements = $('*')

    var defaultFilter = function() {
        $('script').remove()
        $('textarea').remove()
        $('select').remove()
        $('input').remove()
        $('font').remove()
        $('style').remove()
        $('center').remove()
        $('form').remove()

        elements.removeAttr('style')
        elements.removeAttr('bgcolor')
    }

    if (options) {
        if (options.filter) {
            if (options.filter.elems)
                options.filter.elems.forEach(function(elem) { $(elem).remove() })
            if (options.filter.attribs)
                options.filter.attribs.forEach(function(attrib) { elements.removeAttr(attrib) })
        }
        else defaultFilter()
    }
    else defaultFilter()

    return {
        obj : function(cb) {
            cb(makeSimple($('html')[0]))
        },

        json : function(cb) {
            var simple = makeSimple($('html')[0])
            cb(JSON.stringify(simple, null, '  '))
        },

        query : function(selector, cb) {
            var simple = {}
            try {
                simple = makeSimple($(selector)[0]);
            }
            catch(err) {
                console.log(err)
                simple = makeSimple($('html')[0]);
            }
            cb(simple)
        },

        clean : function(cb) {
            var simple = makeSimple($('html')[0])
            var props = ''

            var getprops = function(obj) {
                if (typeof obj === "string") {
                    props += obj.trim() + '\n'
                }
                else {
                    for(var prop in obj) {
                        var kids = obj[prop].children
                        if (kids) {
                            kids.forEach(function(kid) {
                                getprops(kid)
                            })
                        }
                    }
                }
            }
            getprops(simple)
            cb(props)
        }
    }
}

var makeSimple = function(elem) {
    var simple = { }

    var getattribs = function() {
        if (!empty(elem.attribs)) simple[elem.name] = elem.attribs
        else simple[elem.name] = {}
    }

    switch (elem.type) {
        case "tag":
        case "script":
        case "style":
            getattribs()
            var kids = simplifyKids(elem.children)
            if (kids && kids.length)
                simple[elem.name].children = kids
            break
        case "text":
            return elem.data.trim()
        case "comment":
            var trimmed = elem.data.trim()
            if (trimmed) simple.comment = trimmed
            break
        default:
            var unkown = {}
            unkown[elem.type] = elem
            console.log(unkown)
            break
    }

    return simple
}

var simplifyKids = function(kids) {
    var simpleKids = []
    if (kids) {
        kids.forEach(function(kid) {
            if (kid) {
                var simpleKid = makeSimple(kid)
                if (!empty(simpleKid)) 
                    simpleKids.push(simpleKid)
            }
        })
    }
    return simpleKids
}

var empty = function(obj) {
    if (typeof obj.length != 'undefined') return obj.length == 0
    return Object.keys(obj).length == 0
}
