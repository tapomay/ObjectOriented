'use strict';

// var db = require('diskdb');
// db.connect('collections', ['projects', 'resources', 'tasks', 'jobs']);
// db.connect('collections', ['projects']);

var ProjectService = function() {
	
	var db = require('diskdb');
	db.connect('collections', ['projects']);

	var _project = null;

	this.loadProject = function(name) {
		var projects = db.projects.find({'name':name});
		if(projects.length == 0) {
			var date = new Date();
			_project = new Project(name, date, [], [], [], []);
		} else {
			var p = projects[0];
			_project = Project.load(p);
		}
		//alert('Loaded:' + _project.name);
	};

	this.saveProject = function(){
      
	};

	this.createNewProject = function(name, startDate) {
		_project = new Project(name, startDate, [], [], [], []);
	};

	this.exportProject = function() {
		var fileName = _project.name + ".xml";
		var js2xmlparser = require("js2xmlparser");
		var fs = require('fs');
		var data = JSON.stringify(_project);
		var jsonText = js2xmlparser("project",data);
		
		fs.writeFile(fileName, jsonText, function(err) {
			if(err==null)
			{
				alert("The project is exported to " + fileName);
			}
			else
			{
				alert("Error in ecporting project");
			}
		}) ;
	}

	this.activeProject = function(){
      
	return _project.name;
	}

    var dummyData = function() {
        var projectId = 'DEMO_PROJECT_1'
        var r1 = new Resource(projectId, 'res1', 10, ResourceType.LABOR);
        var r2 = new Resource(projectId, 'res2', 20, ResourceType.LABOR);

// Task: projectId, name, description, durationDays, resourcesRequired, deliverables
        var t1 = new Task(projectId, 'task1', 'task1 desc', 3, [r1], null);

        var t2 = new Task(projectId, 'task2', 'task2 desc', 1, [r2], null);

        var j1 = new Job(projectId, 'job1', t1.getEntityId(), new Date('11-20-2015'), 0, JobStates.READY);
        var j2 = new Job(projectId, 'job2', t2.getEntityId(), new Date('11-23-2015'), 0, JobStates.READY);

        var f1 = new Flow(j1.getEntityId(), j2.getEntityId());
        f1.setFromJob(j1);
        f1.setToJob(j2);
        var date = new Date();
        var p = new Project('DEMO_PROJECT_1', date, [r1,r2], [t1, t2], [j1, j2], [f1]);
        db.projects.save(p);
    };

	this.getAllResources = function() {
		      
		return _project.getAllResources();
	};

	this.getAllJobs = function() {
		return _project.getAllJobs();
	};

	this.getAllTasks = function() {
		return _project.getAllTasks();		
	};

	this.getAllFlows = function() {
		return _project.getAllFlows();		
	};

	this.getProjectId = function() {
		return _project.name;		
	};
	
	this.addResource = function(resObj) {
		

		var type = ResourceType.get(resObj.type);
			
		var r = new Resource(resObj.projectId, resObj.name, resObj.cost, resObj.type);
		_project.addResource(r);
	};

	this.addTask = function(taskObj) {
		//var type = ResourceType.get(taskObj.type);
			
		var t = new Task(taskObj.projectId, taskObj.name, taskObj.description, taskObj.durationDays,taskObj.resourcesRequired);
		_project.addTask(t);
	};

	this.deleteResource = function(resObj) {
		var type = ResourceType.get(resObj.type);
			
		var r = new Resource(resObj.projectId, resObj.name, resObj.cost, resObj.type);
		_project.deleteResource(r);
	};

	this.addJob = function(jobObj) {
		// window.console.log('service - addJob');	
		// var j1 = new Job(jobObj.projectId, jobObj.name, 'task1', jobObj.myTime, '50', 'RUNNING');
		if(_project.getJobById(jobObj.getEntityId()))
			throw "Job already exists: " + jobObj.getEntityId();
		_project.addJob(jobObj);
		return jobObj;
	};

	var relevantFlows = function(flows, job) {
		var ret = flows.filter(function(f) {
			var from = f.getFromJob();
			var to = f.getToJob();
    		return ( from === job || to === job);
  		});
		return ret;
	}

	/**
	job: job being edited. Null if new job.
	startTime: startTime set by user
	durationDays: duration set by user
	resources: resources the job is dependent on. set by user
	graphNode: node representing a new job
	links: all edges in graph.
	graphNode and links help in validating predecessor flows coming into a node for a new job.
	**/
	this.validate = function(job, startTime, durationDays, resources, graphNode, links) {
		var ret = [true, "OK"];
		var projectedEndTime = startTime.addDays(durationDays);
		// check parentJob conditions
		// if parentJob:
		// 	startime >= parentJob.startime and endTime < parentJob.endTime
		if(job && !job.isComposite && job.parent) {
			if(startTime < job.parent.startTime || projectedEndTime > job.parent.getEndTime()){
				ret = [false, "Duration exceeds parent: parent.end = " + job.parent.getEndTime().toString()];
			}
		}

		// for each dependsOn:
		// 	check startTime >= dependsOn.endTime

		if(job) {
			var pre = this.dependsOn(job);
			for (var i = pre.length - 1; i >= 0; i--) {
				var p = pre[i];
				if(startTime < p.getEndTime()) {
					ret = [false, "Starts before predecessor: " + p.name];
					break;
				}
			}
		}

		// for each enables:
		// 	check endtime >= dependsOn.startTime

		if(job) {
			var succ = this.enables(job);
			for (var i = succ.length - 1; i >= 0; i--) {
				var s = succ[i];
				if(projectedEndTime > s.startTime) {
					ret = [false, "Ends after successor: " + s.name];
					break;
				}
			}
		}
		// for each resource
		// 	isAvailable(r, startime, endTime)
		if(!_project.isResourceAvailable(resources, job, startTime, durationDays)) {
			if(!job || (job && !job.isComposite)){
				ret = [false, "Resource unavailable"];
			}
		}

		//check incoming flows for dependsOn violation
		if(graphNode) {
			var dependsOnEdges = links.filter(function(l) {
				return (l.target === graphNode);
			});
			window.console.log('dependsOnEdges');
			window.console.log(dependsOnEdges);
			for (var i = dependsOnEdges.length - 1; i >= 0; i--) {
				var source = dependsOnEdges[i].source;
				var dependsOnJob = source.job;
				window.console.log('dependsOnJob');
				window.console.log(dependsOnJob);
				if(dependsOnJob && startTime < dependsOnJob.getEndTime()) {
					ret = [false, "Starts before predecessor: " + dependsOnJob.name];
					break;
				}
			};
		}
		return ret;
	};

	this.dependsOn = function(job) {
		// flowMap[job]
		// for f in flowMap:
		// 	if f.toJob == job
		// 		ret.push(f.fromJob)
		var rf = relevantFlows(_project.flows, job);
		var ret = [];
		for (var i = rf.length - 1; i >= 0; i--) {
			var f = rf[i];
			if(f.getToJob() == job) {
				ret.push(f.getFromJob());
			}
		};
		return ret;
	};

	this.enables = function(job) {
		var rf = relevantFlows(_project.flows, job);
		var ret = [];
		for (var i = rf.length - 1; i >= 0; i--) {
			var f = rf[i];
			if(f.getFromJob() == job) {
				ret.push(f.getToJob());
			}
		};
		return ret;
	};

	this.addFlow = function(fromJob, toJob) {
		_project.addFlow(fromJob, toJob);
	};
	
	this.getResourceById = function(entityId) {
		return _project.getResourceById(entityId);
	};

	this.updateFlows = function(flows, job, compositeJob) {
		var rf = relevantFlows(flows, job);
		for (var i = rf.length - 1; i >= 0; i--) {
			var f = rf[i];
			if(f.getFromJob() == job) {
				f.setFromJob(compositeJob);
			} 
			else if(f.getToJob() == job) {
				f.setToJob(compositeJob);
			}
		};
	};

	this.convertToComposite = function(job) {
		var ret = new CompositeJob(job);
        _project.deleteJob(job);
        _project.addJob(ret);
        this.updateFlows(_project.flows, job, ret);
        return ret;
    };
 
    this.setChild = function(parent, child) {
        window.console.log(parent);
        window.console.log(child);
        parent.addChild(child);
        child.setParent(parent);
	};
	dummyData();
};

ProjectService._INSTANCE = new ProjectService();

var ServiceFactory = function() {
	return ProjectService._INSTANCE;
};