var props = '';
exports.pretty = function(obj) {
    getprops(obj);
    return props;
    }

var getprops = function(obj) {
    if (typeof obj === "string") {
        props += obj.trim() + '<BR/>';
    }
    else {
        for(var prop in obj) {
            //props.push(obj(prop));

            //props += prop + ' '


            var kids = obj[prop].children;
            if (kids) {
                kids.forEach(function(kid) {
                    getprops(kid);
                });
            }


            // else props.push('<a href="' + path + "/" + prop + '">' + prop + '</a>');
            
            // if (typeof obj == "array")
            //  return obj;


          //if(obj[prop]) {
             //props.push(prop);
          //}
       }
    }

   //return props;

}


// var empty = function(obj) {
//     if (typeof obj.length != 'undefined') return obj.length == 0;
//     return Object.keys(obj).length == 0;
// }


