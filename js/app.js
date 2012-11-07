'use strict';

/* App Module */

//var archWalk = angular.module('arch-walk', []);

var eventMap = angular.module('event-map', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/map.html'}).
      otherwise({redirectTo: '/'});
}]);
