'use strict';

/* Controllers */

eventMap.MapController = function( $scope , MapData, MapService) {
    MapData.generateTestData(500);
    MapData.clusterData();

    var mapData = MapData.getMapData();



    $scope.showMarkers = function(){
            MapService.showMarkers(mapData);
    }



};

eventMap.FilterBarController = function( $scope) {
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


};