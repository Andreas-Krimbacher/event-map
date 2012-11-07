'use strict';

/* App Module */

//var archWalk = angular.module('arch-walk', []);

var archWalk = angular.module('arch-walk', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'partials/inputForm.html'}).
      otherwise({redirectTo: '/'});
}]);
