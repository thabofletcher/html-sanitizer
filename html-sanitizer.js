var cheerio = require('cheerio')

exports.load = function(html, cb) {
    $ = cheerio.load(html)
    // $('head').remove()
    // $('script').remove()
    // $('textarea').remove()
    // $('select').remove()
    // $('input').remove()
    // $('font').remove()
    // $('style').remove()
    // $('center').remove()
    // $('form').remove()

    //var elements = $('*')
    //elements.removeAttr('class')
    //elements.removeAttr('style')
    //elements.removeAttr('bgcolor')

    // var simple = makeSimple($('html')[0])
    // if (cb) cb(simple)

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



            // var terms = expression.split('.')
            // var err = '';
        
            // var objptr = simple
            // terms.forEach(function(term){
            //     if (typeof objptr[term] != 'undefined')
            //         objptr = objptr[term]
            //     else if (objptr.children && typeof objptr.children[term] != 'undefined')
            //         objptr = objptr.children[term]
            //     else {
            //         err = "Unable to find: " + term + " from " + expression
            //         if (cb) cb(JSON.stringify(err))
            //         return //pruner;
            //     }

            //     // if (term === "first") {
            //     //     objptr = objptr.children[0];
            //     // }                
            // })
            // cb(JSON.stringify(objptr, null, '  '))

            // return pruner;

            // pruner : function(cb) {
            //     var pruned = objptr
            //     pruned.forEach(function(node){
            // }
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

    if (elem.type == "tag" || elem.type == "script") {
        getattribs()
        var kids = simplifyKids(elem.children)
        if (kids && kids.length)
            simple[elem.name].children = kids
    }
    else if (elem.type == "text") {
        return elem.data.trim()
    }
    else if (elem.type == "comment") {
        var trimmed = elem.data.trim()
        if (trimmed) simple.comment = trimmed
    }
    else {
        var unkown = {}
        unkown[elem.type] = elem
        console.log(unkown)
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
