/*
 * tools.js exports nodejs functions for
 * traversing nested JSON objects and filtering
 * out useful sub-elements.
 * 
 * This is a modification over tools.js that returns
 * a more comprehensive output while filtering.
 * The return value is an associative array instead, 
 * where the key is the actual value from the input 
 * value array.
 */

Array.prototype.includes = function(searchElement) {
    for ( var item in this ) {
        if(searchElement === this[item]) {
            return true;
        }
    }
    return false;
};

/*
 * recursively traverses a JSON object (or array), applying a
 * specified callback function to each element it encounters.
 * the traversal stops if the callback returns true or the entire
 * object is traversed.
 */
var visit = function(obj, callBack) {
	var result = callBack(obj);
	if (!result && obj != null && (typeof obj == "object" || typeof obj == "array")) {
		for(var i in obj) {
		   result = visit(obj[i], callBack);
		   if (result) break;
		}
	}
	return result;
};

/*
 * Given an object, key, and value, this function traverses
 * the object and collects all sub-objects x with x.key == val
 * into an array.
 */
var collectElements = function(obj, key, val) {
	var result = [];
	var filter = function(elem) {
		if (elem != null && typeof elem[key] != null && elem[key] == val) {
            result.push(elem);
		}
	}
	visit(obj, filter);
	return result;
};

/**
 * Given an object, key, and value, this function traverses
 * the object and collects all sub-objects x with x.key == val
 * into an array.
 * 
 * @param {type} obj
 * @param {type} key
 * @param {type} valArr
 * @returns {Array}: 0th element is type=>object map and 1st element is 
 * ID=>object map
 */
var collectElementsMod = function(obj, key, valArr) {
	var result = {};
    var idMap = {};
        
	var filter = function(elem) {
            if (elem !== null && typeof elem[key] !== null && 
                    valArr.includes(elem[key])) {
                var elemArr = result[elem[key]];
                if(elemArr === undefined) {
                    elemArr = new Array();
                    result[elem[key]] = elemArr;
                }
                elemArr.push(elem);
                if(elem._id !== undefined && elem.name != undefined)
                    idMap[elem._id] = elem;
            }
	}
        
	visit(obj, filter);
	return [result, idMap];
};

/*
 * This is a useful StarUML-specific function that searches a model looking
 * for the type of a thing. This works even if the thing is a reference to
 * some other object in the model.
 */
var getType = function(model, thing) {
	var tp = "void";
	if (thing != null && typeof thing == "object" && typeof thing.type != "undefined") {
		tp = thing.type;
		if (typeof tp == "object" && typeof tp.$ref != "undefined") {
			tp = getReference(model, tp.$ref).name;
		}
	}
	return tp;
};

module.exports.collectElementsMod = collectElementsMod;
