'use strict';

/* Directives */

eventMap.directive('map', function(MapService) {
    return {
        restrict: 'E',
        replace: false,
        template: '<div id="map"></div>',
        link: function($scope, element, attrs) {
                MapService.showMap();




        }
    };
});
