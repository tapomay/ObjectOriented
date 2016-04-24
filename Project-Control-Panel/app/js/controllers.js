'use strict';

/* Controllers */

var Controllers = function() {    
  
  /**
    Controller for dashboard
  **/
  var ProjectController = function(){

    this.execute = function($scope, projectSvc) {
      //populate dashboard entities in $scope
      var d = new Date();
      $scope.currentJobs = [];//projectSvc.getCurrentJobs(d);

    }
  };

  /**
    Controller for /resources
  **/
  var ResourceController = function(){

    this.execute = function($scope, $routeParams, $uibModal, projectSvc) {
      //populate dashboard entities in $scope
      $scope.resources = projectSvc.getAllResources();
     //this.open1 = $scope.open1;
	 $scope.open1 = function(){
			
			var modalInstance = $uibModal.open({
			templateUrl: 'partials/myModalContent.html',
			controller: 'ModalInstanceCtrl',
		});
   modalInstance.result.then(function () {
      
    }, function () {
      window.console.info('Modal dismissed at: ' + new Date());
    });
  	
	
	};
	
	  $scope.deleteResource = function (resource_passed) {
			

		// Setup the new data to be inserted
			$scope.newResource = {};
			
			$scope.newResource.name = resource_passed.name;
			$scope.newResource.cost = resource_passed.cost;
			$scope.newResource.type = resource_passed.resourceType;	
			$scope.newResource.id = projectSvc.getProjectId();
			
			projectSvc.deleteResource($scope.newResource);
	  };	
	  
		$scope.editResource = function(resource_passed){
			
	
			var modalEditInstance = $uibModal.open({
			templateUrl: 'partials/myModalEditContent.html',
			controller: 'ModalEditInstanceCtrl',
			resolve: {
			name_passed: function () {
				return resource_passed.name;
				},
			cost_passed: function () {
				return resource_passed.cost;
				},
			type_passed: function () {
				return resource_passed.resourceType;
				}				
			}			
		});
	   modalEditInstance.result.then(function () {
		  
		}, function () {
		  window.console.info('Edit Modal dismissed at: ' + new Date());
		});
	
		};	  
	  
	  
	  

	};
  
  };

 var ModalInstanceCtrl = function($scope, $uibModalInstance) {
  this.execute = function($scope, $routeParams, $uibModalInstance, projectSvc) {

  $scope.ok = function () {

	// Setup the new data to be inserted
		$scope.newResource = {};
	  	$scope.newResource.name = $scope.r_name;
		$scope.newResource.cost = $scope.r_cost;
		$scope.newResource.type = $scope.data.singleSelect;	
		$scope.newResource.id = projectSvc.getProjectId();
		
		projectSvc.addResource($scope.newResource);
		
		$uibModalInstance.close();  
				
//    $uibModalInstance.close({rname1: $scope.r_name, rcost1: $scope.r_cost, rtype1: $scope.data.singleSelect, resources1: $scope.resources});  
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel','');
  };

  };  
}; 

 var ModalEditInstanceCtrl = function($scope, $uibModalInstance, name_passed, cost_passed, type_passed) {
		
	 
  this.execute = function($scope, $routeParams, $uibModalInstance, projectSvc, name_passed, cost_passed, type_passed) {

    $scope.r_name = name_passed;
    $scope.r_cost = cost_passed;
    $scope.data_singleSelect = type_passed;
	
	$scope.oldResource = {};
	$scope.oldResource.name = name_passed;
	$scope.oldResource.cost = cost_passed;
	$scope.oldResource.type = type_passed;	
	$scope.oldResource.id = projectSvc.getProjectId();	
		
  $scope.ok = function () {

	// Setup the new data to be inserted
		$scope.newResource = {};
	  	$scope.newResource.name = $scope.r_name;
		$scope.newResource.cost = $scope.r_cost;
		$scope.newResource.type = $scope.data_singleSelect;	
		$scope.newResource.id = projectSvc.getProjectId();

		
		projectSvc.deleteResource($scope.oldResource);
			
		projectSvc.addResource($scope.newResource);
		
		$uibModalInstance.close();  
				
//    $uibModalInstance.close({rname1: $scope.r_name, rcost1: $scope.r_cost, rtype1: $scope.data.singleSelect, resources1: $scope.resources});  
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel','');
  };

  };  
}; 


  
  /**
    Controller for /tasks
  **/
  var TaskController = function()
   {

    this.execute = function($scope, $routeParams, $uibModal, projectSvc) {
      //populate dashboard entities in $scope
      $scope.tasks = projectSvc.getAllTasks();
	  $scope.resources = projectSvc.getAllResources();
      $scope.open2 = function()
      {
      
      var modalInstance = $uibModal.open({
      templateUrl:'partials/myTaskModalContent.html',
      controller: 'TaskModalInstanceCtrl',
    });
     modalInstance.result.then(function () {
      
    }, function () {
      window.console.info('Modal dismissed at: ' + new Date());
    });
    };
    };

  };


var TaskModalInstanceCtrl = function($scope, $uibModalInstance) {
  this.execute = function($scope, $routeParams, $uibModalInstance, projectSvc) {
  	  $scope.resources = projectSvc.getAllResources();
	  

  $scope.ok = function () {

  // Setup the new data to be inserted
    $scope.newTask = {};
    $scope.newTask.name = $scope.t_name;
    $scope.newTask.description = $scope.t_desc;
    $scope.newTask.durationDays = $scope.t_duration;
	//window.console.log($scope.data1_multipleSelect[0]);
    $scope.newTask.resourcesRequired = $scope.data1_multipleSelect; 
    //$scope.newResource.id = projectSvc.getProjectId();
    
    projectSvc.addTask($scope.newTask);
    
    $uibModalInstance.close();  
        

  };

  $scope.cancel = function () 
  {
    $uibModalInstance.dismiss('cancel','');
  };

  };  
}; 








var compositeCheck = function(job) {
  var ret = false;
  if(job){
    ret = job.isComposite;
  }
  return ret;
};

  /**
    Controller for /jobs
  **/
  var JobController = function() {

    this.execute = function($scope, $routeParams, $uibModal, projectSvc) {
      //populate dashboard entities in $scope
      $scope.jobs = projectSvc.getAllJobs();
      $scope.flows = projectSvc.getAllFlows();
      $scope.isComposite = compositeCheck;
      
      $scope.openEditJob = function(){
          var modalInstance = $uibModal.open({
            templateUrl: 'partials/addJobModalContent.html',
            controller: 'ModalAddJobInstanceCtrl',
            resolve: {
              job: function () {
                return null;
              },
              graphNode: function() {
                return null;
              },
              links: function() {
                return null;
              }
            }
          });
        };

    	$scope.openTaskDetails = function(j) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'myModalContent.html',
          controller: 'TaskDetailsModalCtrl',
          resolve: {
            task: function () {
              return j.getTask();
            }
          }
        });
    	};
    };

    this.taskDetailsController = function($scope, $uibModalInstance, task) {
      $scope.t = task;
      $scope.resources = task.resourcesRequired;
      $scope.ok = function () {
        $uibModalInstance.close();
      };
    };

    this.graphController = function($scope, $routeParams, $uibModal, projectSvc) {
      $scope.jobs = projectSvc.getAllJobs();
      $scope.flows = projectSvc.getAllFlows();

      $scope.openJobEdit = function(j, graphNode, links) {

        var modalInstance = $uibModal.open({
          templateUrl: 'partials/addJobModalContent.html',
          controller: 'ModalAddJobInstanceCtrl',
          resolve: {
            job: function () {
              return j;
            },
            graphNode: function() {
              return graphNode;
            },
            links: function() {
              return links;
            }
          }
        });

      };

      $scope.flowCreateHeartBeat = function(fromJob, toJob) {
        window.console.log("flowCreateHeartBeat");
        window.console.log(fromJob);
        window.console.log(toJob);
        if(fromJob && toJob) {
          try {
            window.console.log('3PO: ');
            window.console.log(fromJob.name);
            window.console.log(' => ');
            window.console.log(toJob.name);
            projectSvc.addFlow(fromJob, toJob);
          } catch(err) {
            window.console.log(err);
          }
        }
      };
    };
};

var GanttController= function(){
	this.execute=function($scope,$routeParams,projectSvc){
		$scope.jobs = projectSvc.getAllJobs();
		var jobs=$scope.jobs;
		
		g = new JSGantt.GanttChart('g',document.getElementById('GanttChartDIV'), 'day');
		
		g.setShowRes(1); // Show/Hide Responsible (0/1)
		g.setShowDur(1); // Show/Hide Duration (0/1)
		g.setShowComp(0); // Show/Hide % Complete(0/1)
		g.setCaptionType('Resource');  // Set to Show Caption
		//g.setDateInputFormat('mm/dd/yyyy');
		//g.setDateDisplayFormat('MM/DD/YYYY')

		if(g){

		for(var i=0; i<jobs.length; i++) {
			var job = jobs[i];
      var resources=[];
      for(var r=0;r<job.getTask().resourcesRequired.length;r++){
          resources.push(job.getTask().resourcesRequired[r].name)
      }
			//console.log(task.endDate.format("MM/DD/YYYY"));
			var endTime = moment(job.startTime).add(job.getTask().durationDays,'days').toDate();
			g.AddTaskItem(
				new JSGantt.TaskItem(
					job.id,   
					job.name,
					new moment(job.startTime).format("MM/DD/YYYY"),
					new moment(endTime).format("MM/DD/YYYY"),
					'ff00ff', 
					'', 
					0,
					resources,
					0, 
					0, 
					'', 
					0,
					job.dependsOn
					));
		}		
			g.Draw();	
			g.DrawDependencies();

		}else {
			console.log("problem in drawing");
		}
	};
};

function generateFlows(links, graphNode, projectSvc) {
  var toSplice = links.filter(function(l) {
    return (l.source === graphNode || l.target === graphNode);
  });
  toSplice.map(function(l) {
    if(l.source == graphNode) {
      var otherNode = l.target;
      if(otherNode.job) {
        var fromJob = graphNode.job;
        var toJob = otherNode.job;
            window.console.log('3PO.1: ');
            window.console.log(fromJob.name);
            window.console.log(' => ');
            window.console.log(toJob.name);
            projectSvc.addFlow(fromJob, toJob);

        projectSvc.addFlow(fromJob, toJob);
      }
    }
    else if(l.target == graphNode) {
      var otherNode = l.source;
      if(otherNode.job) {
        var toJob = graphNode.job;
        var fromJob = otherNode.job;
            window.console.log('3PO.2: ');
            window.console.log(fromJob.name);
            window.console.log(' => ');
            window.console.log(toJob.name);
            projectSvc.addFlow(fromJob, toJob);
        projectSvc.addFlow(fromJob, toJob);
      }
    }
  });
}
var JobScheduleController=function(){
       this.execute=function($scope,$routeParams,projectSvc){
               var jobs=projectSvc.getAllJobs();
               var agenda=[];
               var jobSchedule=[],index;
               $scope.schedule=jobSchedule;
               for(var i=0; i<jobs.length; i++) {
               val = jobs[i];
               for(var j=0;j<val.getTask().durationDays;j++){
                       var item={};
                       var newDate=new moment(val.startTime).add('days',j);
                       item.day=new moment(newDate).format("MM/DD/YYYY");
                       item.jobName=val.name;
                       agenda.push(item);
               }
               }
               for (var i = 0; i < agenda.length;i++){
               index = dayContains(agenda[i].day);
                   if (index == -1){
                       jobSchedule.push({day: agenda[i].day, jobName: agenda[i].jobName});
                   } else {
                       jobSchedule[index].jobName += ','+agenda[i].jobName;
                   }
               }
        
               function dayContains(key){
                   for (var i=0; i < jobSchedule.length; i++){
                      if (JSON.stringify(jobSchedule[i].day) == JSON.stringify(key)) {
                           return i;
                           break;
                       }
                   }
                   return -1;
               }
        $scope.exportToExcel=function(){
          var _exportCSV=JSON.stringify($scope.schedule);
      function JSONToCSVConvertor(_exportCSV,ShowLabel) {
          var arrData = typeof _exportCSV != 'object' ? JSON.parse(_exportCSV) : _exportCSV;
          var CSV = '';    
          if (ShowLabel) {
              var row = "";
              for (var index in arrData[0]) {
                if(index!="$$hashKey"){
                  row += index + ',';
              }
              }
              row = row.slice(0, -1);
              CSV += row + '\r\n';
          }
          for (var i = 0; i < arrData.length; i++) {
              var row = "";
              for (var index in arrData[i]) {
                if(index!="$$hashKey")
                  row += '"' + arrData[i][index] + '",';
              }
              row.slice(0, row.length - 1);
              CSV += row + '\r\n';
          }
        return CSV;
          if (CSV == '') {        
              alert("Invalid data");
              return;
          }   
      }
      var saveFile=function(name,data) {
          var chooser = document.querySelector(name);
          chooser.addEventListener("change", function(evt) {
            console.log(this.value); // get your file name
           var fs = require('fs');// save it now
      fs.writeFile(this.value, data, function(err) {
          if(err) {
             alert("error"+err);
          }
      });
          }, false);

          chooser.click();  
        }

       var CSVData= JSONToCSVConvertor(_exportCSV,true);
      saveFile('#export_file',CSVData);
        };
     };
 };

var resourcesUnion = function(res1, res2) {
  var ret = [];
  if(res1) {
    ret = res1;
  }
  if(res2) {
    for(var i=0; i<res2.length; i++) {
      if(ret.indexOf(res2[i]) == -1) {
        ret.push(res2[i]);
      }
    }    
  }
  return ret;
};

function idsToResources(newResources, projectSvc) {
  var ret = [];
  if(newResources) {
    for(var i = 0; i < newResources.length; i++) {
      var id = newResources[i];
      var res = projectSvc.getResourceById(id);
      ret.push(res);
    }
  }
  return ret;
}

var ModalAddJobInstanceCtrl = function() {
  this.execute = function($scope, $routeParams, $uibModal, $uibModalInstance, projectSvc, job, graphNode, links) {
    window.console.log(job);
    window.console.log(graphNode);

    $scope.isComposite = compositeCheck;

    $scope.resourcesAvailable = projectSvc.getAllResources();
    if(job) {
      $scope.j_name = job.name;
      $scope.j_description = job.getTask().description;
      $scope.dt = job.startTime;
      $scope.j_duration = job.getTask().durationDays;
      $scope.j_dependsOn = projectSvc.dependsOn(job);
      $scope.j_enables = projectSvc.enables(job);
      $scope.j_resources = job.getTask().resourcesRequired;
      $scope.j_percentComplete = job.percentComplete;
      $scope.job = job;
    }

    $scope.ok = function () {

      // Setup the new data to be inserted/edited
      var projectId = projectSvc.getProjectId();
      var name = $scope.j_name;
      var description = $scope.j_description;
      var startTime = $scope.dt;
      window.console.log('Date is: ' + $scope.dt);      
      var durationDays = $scope.j_duration;
      var resources = $scope.j_resources;
      var newResources = $scope.data1_multipleSelect; 
      newResources = idsToResources(newResources, projectSvc);
      resources = resourcesUnion(resources, newResources);
      var validation = projectSvc.validate($scope.job, startTime, durationDays, resources, graphNode, links);
      var isValid = validation[0];
      if(isValid) {
          if($scope.job) { //EDIT

            var task = $scope.job.getTask();
            task.description = description;
            task.durationDays = durationDays;
            task.resourcesRequired = resources;
            //TODO: flaw - all jobs associated with this task affected
            job.name = name;
            if(graphNode){
              graphNode.name = name;
            }
            job.startTime = startTime;
            //EDIT COMPLETE
          } else { // CREATE
            var task = $scope.task; //if select task - currently disabled
            if(!task){
              var taskName = name + "Task";
              var deliverables = null;
              
              var newTask = new Task(projectId, taskName, description, durationDays, resources, deliverables);
              projectSvc.addTask(newTask);
              task = newTask;
            }
            var state = JobStates.READY;
            var percentComplete = 0;
            var newJob = new Job(projectId, name, task.entityId, startTime, percentComplete, state);
            newJob.setTask(task);
            projectSvc.addJob(newJob);
            if(graphNode){
              graphNode.name = name;            
              graphNode.job = newJob;
            }
            if(links) {
              generateFlows(links, graphNode, projectSvc);
            }
          }
          $uibModalInstance.close();
        }
        else {
          alert("Invalid details: " + validation[1]);
        }

          

    //    $uibModalInstance.close({rname1: $scope.r_name, rcost1: $scope.r_cost, rtype1: $scope.data.singleSelect, resources1: $scope.resources});  
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel','');
  };

  $scope.makeComposite = function(job) {
    var compositeJob = projectSvc.convertToComposite(job);
        window.console.log("NEW COMP JOB");
        window.console.log(compositeJob);
        $scope.job = compositeJob;
        if(graphNode) {
          graphNode.job = compositeJob;
          graphNode.name = compositeJob.name;
        }
  };

  $scope.addChild = function(job) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'myModalContent.html',
      controller: 'ChildJobsCtrl',
      resolve: {
        items: function () {
          return projectSvc.getAllJobs();
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      projectSvc.setChild($scope.job, selectedItem);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  };//execute  
  };

  var ChildJobsCtrl = function ($scope, $uibModalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: 'None'
    };

    $scope.ok = function () {
      $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  };


  this.projectController = new ProjectController();
  this.resourceController = new ResourceController();
  this.modalInstanceController = new ModalInstanceCtrl();
  this.modalEditInstanceController = new ModalEditInstanceCtrl();
  this.modalAddJobInstanceController = new ModalAddJobInstanceCtrl();

  this.taskController = new TaskController();
  this.taskmodalInstanceController = new TaskModalInstanceCtrl();
  this.jobController = new JobController();
  this.ganttController=new GanttController();
  this.jobScheduleController=new JobScheduleController();
  this.childJobsCtrl = ChildJobsCtrl;
};

Controllers._INSTANCE = new Controllers();

Controllers.init = function() {
  return Controllers._INSTANCE; 
};
var g; //global for gantt
