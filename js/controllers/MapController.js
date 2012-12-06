'use strict';

//Controller for the Map
eventMap.MapController = function( $scope ,$rootScope, MapData, MapService,ImageLoader) {

    $scope.mapData = null;

    //create the Map
    MapService.showMap();

    var imagesLoaded = false;

    //impressum close button onclick
    jQuery('#impressum-close').click(function (event) {
        $("#impressum").modal("hide");
    });

    //listener when the map is loaded
    $scope.$on('mapIsLoaded', function() {
        MapData.loadInfoData();
    });

    //listener to actualize the map data
    $scope.$on('actualizeData', function(event,filter) {
        MapService.clearBorder();
        if(filter) MapData.filterData(filter);
        MapData.clusterData();

        $scope.mapData = MapData.getMapData();

        if(!imagesLoaded){
            ImageLoader.setOnLoad(function(){
                imagesLoaded = true;
                jQuery('#container').removeClass('hide-element');
                MapService.showMapData($scope.mapData);
                $scope.$apply($rootScope.$broadcast('$routeUpdate'));
            });
            ImageLoader.loadImages();
        }
        else{
            jQuery('#filter-bar').removeClass('hide-element');
            MapService.showMapData($scope.mapData);
        }

    });
};