'use strict';

/* App Module */

//var archWalk = angular.module('arch-walk', []);

var eventMap = angular.module('event-map', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/',{redirectTo: '/info'}).
      when('/info', {template: '<div ng-include="templateUrl"></div>', controller : eventMap.InfoViewController, reloadOnSearch: false}).
      otherwise({redirectTo: '/'});
}]);
