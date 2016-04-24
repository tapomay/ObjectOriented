'use strict';

/* App Module */
var PROJECT_ID = 'DEMO_PROJECT_1';
ProjectService._INSTANCE.loadProject(PROJECT_ID);

var controllers = Controllers.init();

var pcpBlueApp = angular.module('pcpBlueApp', [
  'ngRoute',
  // 'pcpBlueAnimations',
  'pcpBlueControllers',
  // 'pcpBlueFilters',
  'pcpBlueServices', 
  'ui.bootstrap'
]);

var pcpBlueServices = angular.module('pcpBlueServices', []);
pcpBlueServices.factory('ProjectDataSvc', [ServiceFactory]);


var pcpBlueControllers = angular.module('pcpBlueControllers', []);
pcpBlueControllers.controller('ProjectCtrl', ['$scope', 'ProjectDataSvc', controllers.projectController.execute]);
pcpBlueControllers.controller('ResourceCtrl', ['$scope', '$routeParams', '$uibModal', 'ProjectDataSvc', controllers.resourceController.execute]);
pcpBlueControllers.controller('ModalInstanceCtrl', ['$scope', '$routeParams', '$uibModalInstance', 'ProjectDataSvc', controllers.modalInstanceController.execute]);
pcpBlueControllers.controller('ModalEditInstanceCtrl', ['$scope', '$routeParams', '$uibModalInstance', 'ProjectDataSvc', 'name_passed', 'cost_passed', 'type_passed', controllers.modalEditInstanceController.execute]);
pcpBlueControllers.controller('TaskCtrl', ['$scope', '$routeParams','$uibModal','ProjectDataSvc', controllers.taskController.execute]);
pcpBlueControllers.controller('JobCtrl', ['$scope', '$routeParams', '$uibModal', 'ProjectDataSvc', controllers.jobController.execute]);
pcpBlueControllers.controller('ModalAddJobInstanceCtrl', ['$scope', '$routeParams', '$uibModal', '$uibModalInstance', 'ProjectDataSvc', 'job', 'graphNode', 'links', controllers.modalAddJobInstanceController.execute]);
pcpBlueControllers.controller('TaskModalInstanceCtrl', ['$scope', '$routeParams', '$uibModalInstance', 'ProjectDataSvc', controllers.taskmodalInstanceController.execute]);
pcpBlueControllers.controller('TaskDetailsModalCtrl', controllers.jobController.taskDetailsController);
pcpBlueControllers.controller('GraphCtrl', ['$scope', '$routeParams', '$uibModal', 'ProjectDataSvc', controllers.jobController.graphController]);
pcpBlueControllers.controller('GanttViewCtrl',['$scope','$routeParams','ProjectDataSvc',controllers.ganttController.execute]);
pcpBlueControllers.controller('JobScheduleCtrl',['$scope','$routeParams','ProjectDataSvc',controllers.jobScheduleController.execute]);
pcpBlueControllers.controller('ChildJobsCtrl', controllers.childJobsCtrl);

pcpBlueApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/createNew', {
        templateUrl: 'partials/createNewProjectModal.html',
        controller: 'ProjectCtrl'
      }).
      when('/resources', {
        templateUrl: 'partials/resources.html',
        controller: 'ResourceCtrl'
      }).
      when('/tasks', {
        templateUrl: 'partials/tasklist.html',
        controller: 'TaskCtrl'
      }).
      when('/jobs', {
        templateUrl: 'partials/jobslist.html',
        controller: 'JobCtrl'
      }).
      when('/graph', {
        templateUrl: 'partials/graph.html',
        controller: 'GraphCtrl'
      }).
      when('/ganttview', {
        templateUrl: 'partials/ganttview.html',
        controller: 'GanttViewCtrl'
      }).
       when('/jobschedule', {
        templateUrl: 'partials/jobschedule.html',
        controller: 'JobScheduleCtrl'
      }).
      otherwise({
        templateUrl: 'partials/dashboard.html'
      });
  }]);

