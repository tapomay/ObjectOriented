//Design Analyzer
//CS251B: Homework 5
//Spring 2016
//Tapomay Dey
/**
Given a UML diagram as mdj file, the following program computes design metrics - responsibility, instability, stability and deviance.
It uses a MapReduce based implementation. 
**/

var tools = require('./tools_mod.js');
var models = require('./models.js');
var mapreduce = require('mapred');
var fileArg = process.argv[2];
var PATH = fileArg || './hr.mdj';
console.log('Using input file: ', PATH);

/*Parse input file as Json*/
function parseMdj(filePath) {
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return obj;
}

function parseMdjText(fileText) {
    var obj = JSON.parse(fileText);
    return obj;
};

/*used by diagnostics*/
function parseNames(objArr, f) {
    if (f == undefined) f = 'name';
    return objArr.map(function(x){return eval('x.' + f);});
};

/**
 * ignore this method
 */
function diagnostics(objectMap) {
    
    var classes = objectMap[models.TYPES.CLASS];
    console.log('D:Parsing classes:', parseNames(classes));

    var interfaces = objectMap[models.TYPES.INTERFACE];
    console.log('Parsing interfaces:', parseNames(interfaces));

    var assocs = objectMap[models.TYPES.ASSOC];
    console.log('Parsing associations:', parseNames(assocs, '_id'));

    var gens = objectMap[models.TYPES.GENERALIZATION];
    console.log('Parsing generalizations:', parseNames(gens, '_id'));

    var interface_real = objectMap[models.TYPES.INTERFACE_REALIZATION];
    console.log('Parsing interface realizations:', parseNames(interface_real, '_id'));

    var operations = objectMap[models.TYPES.OPERATION];
    console.log('Parsing operations:', parseNames(operations));

    var params = objectMap[models.TYPES.PARAMS];
    console.log('Parsing params:', parseNames(params, 'direction'));

}

/**
* key = Association/Generalization id
* value = UML object
**/
var assocMapper = function(assocId, assocObj) {
    var list = [];
    list.push([assocObj.end2.reference.$ref, models.Func.INEDGE(assocObj.end1.reference.$ref)]);
    list.push([assocObj.end1.reference.$ref, models.Func.OUTEDGE(assocObj.end2.reference.$ref)]);
    return list;
};

//generalization
var genMapper = function(genId, genObj) {
    var list = [];
    list.push([genObj.target.$ref, models.Func.INHERITED(genObj.source.$ref)]);
    list.push([genObj.source.$ref, models.Func.INHERITS(genObj.target.$ref)]);
    return list;
};

//interface realization
var intrMapper = function(genId, genObj) {
    var list = [];
    list.push([genObj.target.$ref, models.Func.IMPLEMENTED(genObj.source.$ref)]);
    list.push([genObj.source.$ref, models.Func.IMPLEMENTS(genObj.target.$ref)]);
    return list;
};

//method parameters
var paramsMapper = function(paramId, paramObj) {
    var list = [];
    if (paramObj.type.$ref != undefined) {
        var operationRef = paramObj._parent.$ref;
        var operationObj = paramsMapper.operations.getById(operationRef);
        var other = operationObj._parent.$ref;
        list.push([paramObj.type.$ref, models.Func.REFERRED(other)]);
        list.push([other, models.Func.REFERS(paramObj.type.$ref)]);
    }
    return list;
};

//Stateful reducer that collects all metrics
//Contains duplicate dependency check logic. eg: association + generalization from A->B should be counted once.
var MultiReducer = function(classIndexArg) {
    var classIndex = classIndexArg;
    var metricIndex = {};
    var visitedIndex = {};
    this.reduce = function(classRef, funcList){
        var cls = classIndex.getById(classRef).name;
        
        var m = metricIndex[classRef];
        if(m == undefined) {
            m = new models.Metric(cls, classIndex.size());
            metricIndex[classRef] = m;
            visitedIndex[classRef] = [];
        }

        // console.log('Reducing:', cls, funcList.length);
        funcList.forEach(function(f){
            
            if(visitedIndex[classRef].indexOf(f.otherval() + ":" + f.funcval()) === -1) {
                m.addFunc(f);
                visitedIndex[classRef].push(f.otherval() + ":" + f.funcval());                
                // console.log('Adding ref: ', cls, '->', classIndex.getById(f.otherval()).name, f.typeval(), f.funcval());
            } 
            // else {
                // console.log('Skipping duplicate ref: ', cls, '->', classIndex.getById(f.otherval()).name, f.typeval(), f.funcval());
            // }
        });
        return m;
    };

    /*Displays all metrics*/
    this.evaluate = function() {
        for(var k in metricIndex) {
            metricIndex[k].compute();
            metricIndex[k].print();
        }
    };
};


var objToKV = function(obj) {
    return [obj._id, obj];
};


var Indexer = function() {
    var idIndex = {};
    this.index = function(obj) {
        if(obj != undefined){
            idIndex[obj._id] = obj;        
        }
    };
    this.getById = function(idVal) {
        return idIndex[idVal];
    };
    this.size = function() {
        return Object.keys(idIndex).length;
    };
};

/**
 * Entry Point
 */
function mainHandler(mdjObject) {
    
    var result = tools.collectElementsMod(mdjObject, "_type", models.TYPES.collectTypes());
    
    var objectMap = result[0];
    var idMap = result[1];
    
    // diagnostics(objectMap);

    var classes = objectMap[models.TYPES.CLASS];
    var interfaces = objectMap[models.TYPES.INTERFACE];
    var assocs = objectMap[models.TYPES.ASSOC];
    var gens = objectMap[models.TYPES.GENERALIZATION];
    var interface_real = objectMap[models.TYPES.INTERFACE_REALIZATION];
    var operations = objectMap[models.TYPES.OPERATION];
    var params = objectMap[models.TYPES.PARAMS];

    var classIndex = new Indexer();
    if(classes != undefined)
        classes.map(classIndex.index);

    if(interfaces != undefined)
        interfaces.map(classIndex.index);

    var operationsIndex = new Indexer();

    if(operations != undefined)
        operations.map(operationsIndex.index);

    console.log('Total classes/interfaces:', classIndex.size());

    var mreducer = new MultiReducer(classIndex);

    if(assocs != undefined)
        mapreduce(assocs.map(objToKV), assocMapper, mreducer.reduce, function(result){});

    if(gens != undefined)
        mapreduce(gens.map(objToKV), genMapper, mreducer.reduce, function(result){});

    if(interface_real != undefined)
        mapreduce(interface_real.map(objToKV), intrMapper, mreducer.reduce, function(result){});

    paramsMapper.operations = operationsIndex;
    if(params != undefined)
        mapreduce(params.map(objToKV), paramsMapper, mreducer.reduce, function(result){});

    mreducer.evaluate();
};

var jsonObject = parseMdj(PATH);
mainHandler(jsonObject);
