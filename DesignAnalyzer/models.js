/* global module */

var TYPES = function(){};

TYPES.INTERFACE = "UMLInterface";
TYPES.CLASS = "UMLClass";
TYPES.ASSOC = "UMLAssociation";
TYPES.GENERALIZATION = "UMLGeneralization";
TYPES.INTERFACE_REALIZATION = "UMLInterfaceRealization";
TYPES.OPERATION = "UMLOperation";
TYPES.PARAMS = "UMLParameter";
TYPES.ATTRIBS = "UMLAttribute";

TYPES.collectTypes = function(){
    return [TYPES.INTERFACE, TYPES.CLASS, TYPES.ASSOC, TYPES.GENERALIZATION, 
        TYPES.INTERFACE_REALIZATION, TYPES.OPERATION, TYPES.PARAMS, TYPES.ATTRIBS];

};

var Func = function(type, func, otherEnd) {
    this._type = type;
    this._func = func;
    this._other = otherEnd;
    this.funcval = function(){return this._func};
    this.typeval = function(){return this._type};
    this.otherval = function(){return this._other};
};

Func.RESPONSIBILITY = 'RESPONSIBILITY';
Func.INSTABILITY = 'INSTABILITY';
Func.STABILITY = 'STABILITY';
Func.DEVIANCE = 'DEVIANCE';

Func.INEDGE = function(other){return new Func(TYPES.ASSOC, Func.RESPONSIBILITY, other)};
Func.OUTEDGE = function(other){return new Func(TYPES.ASSOC, Func.INSTABILITY, other)};

Func.INHERITED = function(other){return new Func(TYPES.GENERALIZATION, Func.RESPONSIBILITY, other)};
Func.INHERITS = function(other){return new Func(TYPES.GENERALIZATION, Func.INSTABILITY, other)};

Func.IMPLEMENTED = function(other){return new Func(TYPES.INTERFACE_REALIZATION, Func.RESPONSIBILITY, other)};
Func.IMPLEMENTS = function(other){return new Func(TYPES.INTERFACE_REALIZATION, Func.INSTABILITY, other)};

Func.REFERRED = function(other){return new Func(TYPES.PARAMS, Func.RESPONSIBILITY, other)};
Func.REFERS = function(other){return new Func(TYPES.PARAMS, Func.INSTABILITY, other)};

var Metric = function(cls, classCount){
    var responsibility = 0;
    var instability = 0;
    var stability = -1;
    var deviance = -1;
    var classCount = classCount;
    var className = cls;

    this.addFunc = function(f) {
        if(f.funcval() === Func.RESPONSIBILITY) {
            responsibility++;
        }
        else if(f.funcval() === Func.INSTABILITY) {
            instability++;
        }
    };

    this.compute = function() {
        instability /= classCount;
        responsibility /= classCount;
        stability = 1 - instability;
        deviance = Math.abs(responsibility - stability); 
    };

    this.print = function(){
        console.log(className, ':');
        console.log('    Responsibility: ', responsibility);
        console.log('    Instability: ', instability);
        console.log('    Stability: ', stability);
        console.log('    Deviance: ', deviance);
    };
};

module.exports.TYPES = TYPES;
module.exports.Func = Func;
module.exports.Metric = Metric;

