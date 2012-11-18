'use strict';

/* Directives */

eventMap.directive('map', function(MapService) {
    return {
        restrict: 'E',
        replace: false,
        templateUrl: 'partials/map.html',
        link: function($scope, element, attrs) {
            MapService.showMap();
        }
    };
});
