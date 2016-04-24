/**
 * New node file
 */
// (function(){ 

// var app = angular.module('pcpBlueApp',[]);

var Enum = require('enum');
var uuid = require('node-uuid');
// var exports = module.exports = {};

var ResourceType = new Enum([ 'LABOR', 'EQUIPMENT', 'MATERIAL' ]);
// exports.ResourceType = ResourceType;

var Resource = function(projectId, name, cost, resourceType) {
	
	Resource.create = function(obj) {
		var type = ResourceType.get(obj.resourceType);
		var ret = new Resource(obj.projectId, obj.name, obj.cost, type);
		ret.entityId = obj.entityId;
		return ret;
	};

	this.projectId = projectId;
	this.name = name;
	this.cost = cost;
	this.resourceType = resourceType;
	this.entityId = uuid.v4();
	
	if (isNaN(this.cost)) {
		throw "Invalid cost: " + String(this.cost);
	}

	if (!(this.resourceType in ResourceType)) {
		throw "Invalid resource type: " + String(this.resourceType);
	}

	this.getName = function() {
		return this.name;
	};

	this.getCost = function() {
		return this.cost;
	};

	this.getResourceType = function() {
		return this.resourceType;
	};

	this.getEntityId = function() {
		return this.entityId;
	};

};
// exports.Resource = Resource;

var Task = function(projectId, name, description, durationDays, resourcesRequired, deliverables) {

	Task.create = function(obj) {//pass resourceObj array too
		var ret = new Task(obj.projectId, obj.name, obj.description, obj.durationDays, obj.resourcesRequired, obj.deliverables);
		ret.entityId = obj.entityId;
		return ret;
	};

	this.projectId = projectId;
	this.name = name;
	this.description = description;
	this.durationDays = durationDays;

	this.resourcesRequired = resourcesRequired;
	this.laborRequired = -1;
	this.equipmentRequired = -1;
	this.materialRequired = -1;
	this.deliverables = deliverables; //TODO:
	this.entityId = uuid.v4();

	var _attribs = {
		'duration' : this.durationDays,
		'laborRequired' : this.laborRequired,
		'equipmentRequired' : this.equipmentRequired,
		'materialRequired' : this.materialRequired
	};

	for ( var key in _attribs) {
		if (isNaN(_attribs[key])) {
			throw "Invalid " + key + ": " + String(_attribs[key]);
		}
	}

	this.createJob = function(name, startTime) {
		var j = new Job(name, this, startTime);
		return j;
	};

	this.getName = function() {
		return this.name;
	};

	this.getDescription = function() {
		return this.description;
	};

	this.getDuration = function() {
		return this.durationDays;
	};

	this.getlaborRequired = function() {
		return this.laborRequired;
	};

	this.getMaterialRequired = function() {
		return this.materialRequired;
	};

	this.getEquipmentRequired = function() {
		return this.equipmentRequired;
	};

	this.getEntityId = function() {
		return this.entityId;
	};
};
// exports.Task = Task;

var JobStates = new Enum([ 'READY', 'RUNNING', 'COMPLETE' ]);
// exports.JobStates = JobStates;
Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf() + days * 24 * 60 * 60 * 1000 );
    return dat;
}

var Job = function(projectId, name, task, startTime, percentComplete, state) {

	Job.create = function(obj) {
		var d = new Date(obj.startTime);
		var ret = new Job(obj.projectId, obj.name, obj.task, d, obj.percentComplete, obj.state);
		ret.entityId = obj.entityId;
		return ret;
	};
	this.projectId = projectId;
	this.name = name;
	this.task = task;
	this.startTime = startTime;
	this.percentComplete = percentComplete;
	this.state = state;
	this.entityId = uuid.v4();
	var _taskObj = null;
	this.isComposite = false;

	this.getEndTime = function(){return this.startTime.addDays(_taskObj.durationDays)};

	this.setParent = function(parent) {
		this.parent = parent;
	}

/*
	if (!(this.startTime instanceof Date)) {
		throw "StartTime Invalid: Must be a Date() - " + Object.keys(this.startTime);
	}    
*/

	this.getTask = function(){
		return _taskObj;
	};

	this.setTask = function(t){
		if(!(t instanceof Task)){
			throw "Invalid task: " + t;
		}
		this.task = t.entityId;
		_taskObj = t;
	};

	this.getName = function() {
		return this.name;
	};

	this.getStartTime = function() {
		return this.startTime;
	};

	this.getPercentComplete = function() {
		return this.percentComplete;
	};

	this.getState = function() {
		return this.state;
	};
	
	this.changeState = function(newState) {
		if(!(newState in JobStates)) {
			throw "Invalid JobState: " + String(newState);
		}
		this.state = newState;
	};

	this.getEntityId = function() {
		return this.entityId;
	};

};
// exports.Job = Job;

var Flow = function(fromJob, toJob) {
	this.fromJob = fromJob;
	this.toJob = toJob;

	var _fromJobObj, _toJobObj;

	this.getFromJob = function() {
		return _fromJobObj;
	};
	this.getToJob = function() {
		return _toJobObj;
	};
	this.setFromJob = function(fromJob) {
		_fromJobObj = fromJob;
		this.fromJob = fromJob.entityId;
	};
	this.setToJob = function(toJob) {
		_toJobObj = toJob;
		this.toJob = toJob.entityId;
	};
};

var CompositeJob = function(job) {

	this.projectId = job.projectId;
	this.name = job.name;
	this.task = job.task;
	this.startTime = job.startTime;
	this.percentComplete = job.percentComplete;
	this.state = job.state;
	this.entityId = job.entityId;
	var _taskObj = job.getTask();
	this.children = [];
	this.isComposite = true;

	this.getTask = function(){
		return _taskObj;
	};

	this.setTask = function(t){
		if(!(t instanceof Task)){
			throw "Invalid task: " + t;
		}
		this.task = t.entityId;
		_taskObj = t;
	};

	this.getEndTime = function(){return this.startTime.addDays(_taskObj.durationDays)};
	
	this.addChild = function(childjob) {
		this.children.push(childjob);
	};
	
};

CompositeJob.prototype = new Job();