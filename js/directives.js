'use strict';

/* Directives */

eventMap.directive('map', function(MapService,ImageLoader) {
    return {
        restrict: 'E',
        replace: false,
        template: '<div id="map"></div>',
        link: function($scope, element, attrs) {
            MapService.showMap();


            ImageLoader.setOnLoad(function(){
                $scope.showMarkers();
            });
            ImageLoader.loadImages();
        }
    };
});
