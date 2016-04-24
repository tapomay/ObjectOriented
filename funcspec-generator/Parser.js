/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require('./tools_mod.js');
var models = require('./funcspec_models.js');
var view = require('./view.js');

var PATH = '/home/tapomay/workspaces/staruml2/funcspec/atm.mdj';

var ACTOR_TYPE = 'UMLActor';
var USECASE_TYPE = 'UMLUseCase';
var ASSOC = "UMLAssociation";
var ASSOC_END = "UMLAssociationEnd";
var INCLUDE = "UMLInclude";

var PRIMARY = "PRIMARY";
var SECONDARY = "SECONDARY";


function parseMdj(filePath) {
//    var fs = require('fs');
    var fs = require('browserify-fs');
    var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return obj;
}

function parseMdjText(fileText) {
    var obj = JSON.parse(fileText);
    return obj;
}

//function parseMdjJquery(filePath, handler) {
//    $.getJSON(filePath, function(response){
//          handler(response);
//      });
//}

/**
 * Entry Point
 */
function mainHandler(mdjObject) {
	
    var result = collectElementsMod(mdjObject, "_type", [ACTOR_TYPE, USECASE_TYPE]);
    
    var objectMap = result[0];
    var idMap = result[1];
    

    var actorJSONObjects = objectMap[ACTOR_TYPE];
    var usecaseJSONObjects = objectMap[USECASE_TYPE];

    var umlModel = new models.UMLModel(mdjObject);
    
    for (var i = 0; i < actorJSONObjects.length; i++) {
    	var actor = actorJSONObjects[i];
    	console.log("Parsing Actor: " + actor.name);
    	
    	var actorModel = new models.UMLActor(actor);
    	umlModel.addActor(actorModel);
    }
    
    for (var i = 0; i < usecaseJSONObjects.length; i++) {
    	var usecase = usecaseJSONObjects[i];
    	console.log("Parsing UseCase: " + usecase.name);
    	var usecaseModel = new models.UMLUseCase(usecase);
    	umlModel.addUsecase(usecaseModel);
    }

    //Update DOM elements in browser
    view.render(umlModel);

    
    //FOLLOWING CODE IS FOR DEBUG PURPOSES
//    console.log(umlModel.actors);
//    console.log(umlModel.usecases);
//    for(var i in umlModel.usecases) {
//    	var uc = umlModel.usecases[i];
//    	var includes = uc.collectIncludes(uc, umlModel);
//    	console.log(uc.name + " includes :" + JSON.stringify(includes));
//    }
//    
//    for(var i in umlModel.usecases) {
//    	var uc = umlModel.usecases[i];
//    	var actors = uc.collectActors(uc, umlModel);
//    	console.log(uc.name + " actors :" + JSON.stringify(actors));
//    }

};

//Moving following invocations into HTML method bootstrap()
//var jsonObject = parseMdj(PATH);
//mainHandler(jsonObject);

// Functions which will be available to external callers
//Browserify exposes these methods to external javascript as parser object with the help of --s option
module.exports.parseMdjText = parseMdjText;
module.exports.mainHandler = mainHandler;