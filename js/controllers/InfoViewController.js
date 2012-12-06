'use strict';

//top controller for the info view, primary for the legend
eventMap.InfoViewController = function( $scope,ImageLoader) {
    $scope.legend = 'none';

    //legend img definition
    $scope.imgLegend =  { busLegend : 'img/maki/bus-18.png',
        pubLegend : 'img/maki/beer-18.png',
        barLegend : 'img/maki/bar-18.png',
        restLegend : 'img/maki/restaurant-18.png',
        hotelLegend : 'img/maki/lodging-18.png',
        fastfoodLegend : 'img/maki/fast-food-18.png',
        cafeLegend : 'img/maki/cafe-18.png'}

    //get images from the omage loader
    $scope.$on('imageLoaded', function() {
        for(var type in $scope.imgLegend){
            $scope.imgLegend[type] = ImageLoader.getImage(type).src;
        }
    });

    //listener to show and hide the legend
    $scope.$on('switchLegend', function(event,settings) {
        if($scope.legend == 'none' && settings.mode) $scope.legend = settings.type;
        if($scope.legend == 'both' && !settings.mode){
            if(settings.type == 'bus') $scope.legend = 'eatanddrink';
            if(settings.type == 'eatanddrink') $scope.legend = 'bus';
        }
        if($scope.legend == 'bus'){
            if(settings.type == 'eatanddrink' && settings.mode) $scope.legend = 'both';
            if(settings.type == 'bus' && !settings.mode) $scope.legend = 'none';
        }
        if($scope.legend == 'eatanddrink'){
            if(settings.type == 'bus' && settings.mode) $scope.legend = 'both';
            if(settings.type == 'eatanddrink' && !settings.mode) $scope.legend = 'none';
        }
    });
};