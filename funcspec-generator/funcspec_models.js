/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global module */
var ACTOR_TYPE = 'UMLActor';
var USECASE_TYPE = 'UMLUseCase';
var ASSOC = "UMLAssociation";
var ASSOC_END = "UMLAssociationEnd";
var INCLUDE = "UMLInclude";
var DIAGRAM = "UMLUseCaseDiagram";
	
var PRIMARY = "PRIMARY";
var SECONDARY = "SECONDARY";
var QUOTE = "\"";

var UMLModel = function(model) {
	this.jsonObject = model;
    this.projectName  = model.name;
    this.client = model.company;
    this.author = model.author;
    this.copyright = model.copyright;
    this.version = model.version;
    this.date = new Date();
    this.intro = model.documentation;
    
    this.actors = {};
    this.usecases = {};
    
    this.addActor = function(actorModel){this.actors[actorModel.ref] = actorModel};
    this.addUsecase = function(usecaseModel){this.usecases[usecaseModel.ref] = usecaseModel};

    this.mappings = function() {
        var ret = {};
        ret['val:model:projectName'] = this.projectName;
        ret['val:model:client'] = this.client;
        ret['val:model:author'] = this.author;
        ret['val:model:documentation'] = this.intro;
        ret['val:model:version'] = this.version;
        ret['val:model:changeby'] = "Tapomay Dey"; //TODO: Hard coding
        ret['val:model:date'] = this.date.getMonth() + "/" + this.date.getDate() + "/" + this.date.getFullYear();
        return ret;
    };
    
    this.extractDiagrams = function(jsonObject){
    	this.diagrams = [];
    	var umlDiagrams = collectElements(jsonObject, "_type", DIAGRAM);
    	for (var i = 0; i < umlDiagrams.length; i++) {
			var diagram = umlDiagrams[i];
			var imgPath = diagram.name + ".jpg";
			this.diagrams.push({'name':diagram.name, 'path':imgPath});
		}
    };
    
    this.extractDiagrams(model);
}

var UMLUseCase = function(jsonObject) {
    this.name = jsonObject.name;
    this.ref = jsonObject._id;
    this.doc = jsonObject.documentation;

//    this.scenario = []; //defined in parseDoc()
//    this.associations = [];
//    this.includes = [];

    this.parseDoc = function() {
    	this.scenario = [];
    	if (this.doc !== undefined) {
	        var docLines = this.doc.split("\n");
	        var i = 0;
	        while(i < docLines.length) {
	            var line = docLines[i];
	            var lineSplit = line.split(":");//TODO: if the rhs contains colon, needs merging
	            if(lineSplit.length > 1) {
	                var key = lineSplit[0];
	                var value = lineSplit[1];
	                if(key.toLowerCase() === "main scenario"){
	                	i++;
	                    break;
	                }
	                var objectKey = key.toLowerCase();
	                eval("this." + objectKey + "=" + QUOTE + value + QUOTE);
	            }
	            i++;
	        }
	        
	        while(i < docLines.length) {
	            var line = docLines[i];
	            var lineSplit = line.split(":");//TODO: if the rhs contains colon, needs merging
	            if(lineSplit.length > 1) {
	                var actor = lineSplit[0];
	                var action = lineSplit[1];
	                this.scenario.push({"actor":actor, "action":action});
	            }
	            i++;
	        }
    	}
    };
    this.parseDoc(); //called right here
    
    this.resolveAssociations = function(usecaseJsonObject) {
    	var associationsObjects = collectElements(usecaseJsonObject, "_type", ASSOC);
    	this.associations = [];
    	
    	for (var i = 0; i < associationsObjects.length; i++) {
			var assocObject = associationsObjects[i];
			var usecaseRef = this.ref;
			var actorRef = assocObject.end2.reference.$ref;

			var assocModel = new UMLAssociation(actorRef, usecaseRef, SECONDARY);
			this.associations.push(assocModel);
		}
    };
    this.resolveAssociations(jsonObject); //called right here
    
    this.resolveIncludes = function(usecaseJsonObject) {
    	var includeObjects = collectElements(usecaseJsonObject, "_type", INCLUDE);
    	this.includes = [];
    	
    	for (var i = 0; i < includeObjects.length; i++) {
			var includeObj = includeObjects[i];
			var sourceRef = this.ref;
			var targetRef = includeObj.target.$ref;

			var includeModel = new UMLInclude(sourceRef, targetRef);
			this.includes.push(includeModel);
		}
    };
    this.resolveIncludes(jsonObject); //called right here

	
}

var UMLActor = function(jsonObject) {
    this.name = jsonObject.name;
    this.ref = jsonObject._id;
    this.doc = jsonObject.documentation;
//    this.associations = [];
    
    this.resolveAssociations = function(actorJsonObject) {
    	var associationObjects = collectElements(actorJsonObject, "_type", ASSOC);
    	this.associations = [];
    	
    	for (var i = 0; i < associationObjects.length; i++) {
			var assocObject = associationObjects[i];
			var actorRef = this.ref;
			var usecaseRef = assocObject.end2.reference.$ref;

			var assocModel = new UMLAssociation(actorRef, usecaseRef, PRIMARY);
			this.associations.push(assocModel);
		}
    };
    this.resolveAssociations(jsonObject); //called right here
    
};

UMLUseCase.prototype.collectIncludes = function(usecase, umlModel) {
	var ret = [];
	for (var i = 0; i < usecase.includes.length; i++) {
		var include = usecase.includes[i];
		var targetRef = include.target;
		var targetUC = umlModel.usecases[targetRef];
		console.log(targetRef);
		if (targetUC !== undefined) {
			ret.push({'name':targetUC.name});	
		}
	}
	return ret;
};

UMLUseCase.prototype.collectActors = function(usecase, umlModel) {
	var ret = [];
	for (var i = 0; i < usecase.associations.length; i++) {
		var assoc = usecase.associations[i];
		var actor = umlModel.actors[assoc.actor];
		if (actor !== undefined) {
			ret.push({'name':actor.name});
		}
	}
	for (var i in umlModel.actors) {
		var actor = umlModel.actors[i];
		for (var j = 0; j < actor.associations.length; j++) {
			var assoc = actor.associations[j];
			var assocUsecaseRef = assoc.usecase;
			if(assocUsecaseRef === usecase.ref) {
				ret.push({'name':actor.name});
				break;
			}
		}
	}
	return ret;
};

var UMLAssociation = function(actorRef, usecaseRef, assocType) {
	this.actor = actorRef;
	this.usecase = usecaseRef;
	this.type = assocType;
};

var UMLInclude = function(sourceRef, targetRef) {
	this.source = sourceRef;
	this.target = targetRef;
};

module.exports.UMLModel = UMLModel;
module.exports.UMLUseCase = UMLUseCase;
module.exports.UMLActor = UMLActor;
module.exports.UMLModel = UMLModel;
module.exports.UMLAssociation = UMLAssociation;
module.exports.UMLInclude = UMLInclude;
