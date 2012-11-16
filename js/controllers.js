'use strict';

/* Controllers */

eventMap.MapController = function( $scope , MapData, MapService,ImageLoader) {

    $scope.mapData = null;

    var imagesLoaded = false;

    $scope.$on('actualizeData', function(event,filter) {
        if(!$scope.mapData) MapData.generateTestData(500);

        MapData.filterData(filter);
        MapData.clusterData();

        $scope.mapData = MapData.getMapData();

        if(!imagesLoaded){
            ImageLoader.setOnLoad(function(){
                imagesLoaded = true;
                MapService.showMapData($scope.mapData);
            });
            ImageLoader.loadImages();
        }
        else{
            MapService.showMapData($scope.mapData);
        }

    });




};

eventMap.FilterBarController = function( $scope, $rootScope) {
    jQuery("#filter-slider").slider({
        range: true,
        min: 0,
        max: 1000,
        values: [ 75, 300 ],
        slide: function( event, ui ) {
            jQuery( "#filter-time-info-start" ).html( ui.values[ 1 ] );
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
        $scope.actualizeData();
    }

    $scope.actualizeData = function(){
        $rootScope.$broadcast('actualizeData',angular.copy($scope.filter));
    }


};