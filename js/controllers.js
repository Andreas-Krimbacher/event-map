'use strict';

/* Controllers */

eventMap.MapController = function( $scope , MapData, MapService,ImageLoader) {

    $scope.mapData = null;

    $scope.$on('generateData', function(event) {
        MapData.generateTestData(500);
        MapData.clusterData();
        $scope.mapData = MapData.getMapData();
        ImageLoader.setOnLoad(function(){
            MapService.showMarkers($scope.mapData);
        });
        ImageLoader.loadImages();
    });




};

eventMap.FilterBarController = function( $scope, $rootScope) {
    jQuery("#filter-slider").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 75, 300 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });


    $scope.filter = {concert: true,
                    exhib: true,
                    film: true,
                    other: true,
                    start: null,
                    end: null};

    $scope.onCategoryBtnClick = function(category){
        $scope.filter[category] = !$scope.filter[category];
    }

    $scope.generateData = function(){
        $rootScope.$broadcast('generateData');
    }


};