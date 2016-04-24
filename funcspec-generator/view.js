
/**
 * View renderer module:
 * This code executes only on browser for rendering the page as per
 * dynamic data from MDJ.
 * Uses JQuery templates. Expects JQuery to be loaded on the HTML page.
 *  
 */
var models = require('./funcspec_models.js');

function render(umlModel) {
	console.log("Rendering the model.");
	models.UMLModel.populateHTML(umlModel);
    models.UMLActor.populateHTML(umlModel.actors);
    models.UMLUseCase.populateHTML(umlModel);
}

models.UMLModel.populateHTML = function(umlModel) {
    var idVals = umlModel.mappings();
    for (var i in idVals) {
    	console.log("Refreshing: " + i);
        document.getElementById(i).innerHTML = idVals[i];
    }
    
    $( "#diagramTemplate" ).tmpl( umlModel.diagrams )
	.appendTo( "#diagrams" );
    
};

models.UMLActor.populateHTML = function(actorMap) {
	
	var values = [];
	for(var i in actorMap) {
		var actor = actorMap[i];
		values.push({'actor':actor.name, 'doc':actor.doc});
	}	
	console.log("Rendering Actors: " + values);
	$( "#actorTemplate" ).tmpl( values )
	.appendTo( "#business_context" );
};

models.UMLUseCase.populateHTML = function(umlModel) {
	
	var values = [];
	for(var i in umlModel.usecases) {
		var uc = umlModel.usecases[i];
		var includes = uc.collectIncludes(uc, umlModel);
		var actors = uc.collectActors(uc, umlModel);
		
		
		values.push({'name':uc.name, 'description':uc.description, 'priority':uc.priority, 
			'risk':uc.risk, 'scenario':uc.scenario, 'actors':actors, 'includes':includes});
	}	
	console.log("Rendering Usecases: " + values);
	$( "#usecaseTemplate" ).tmpl( values )
	.appendTo( "#functional_requirements" );
};

module.exports.render = render;