'use strict';

//controller for the info view (for the text information)

eventMap.InfoViewTextController = function( $scope, $rootScope,$location, MapData, $route, MapService) {

    //init
    $scope.initCall = true;
    $scope.pointsParts = [];
    $scope.mapParts = [];
    $scope.openParts = [];
    $scope.borderParts = [];
    $scope.noRefresh = false;
    $scope.filterChanged = false;

    //listener for a route change
    $rootScope.$on('$routeUpdate', function() {

        $scope.filterChanged = false;

        if($scope.noRefresh){
            $scope.noRefresh = false;
            return;
        }

        // get parameters from url
        var urlParts = $location.search()

        //get points from parameter
        if(urlParts.points){
            var pointsParts = urlParts.points+'';
            pointsParts = pointsParts.split('|');
        }

        //get open information from parameters
        if(urlParts.open){
            var openParts = urlParts.open+'';
            openParts = openParts.split('|');
        }
        else{
            var openParts = [];
            if(pointsParts && pointsParts.length < 5)  var openParts = angular.copy(pointsParts);
        }


        //load the html partial for the information
        if(urlParts.points){

            if(pointsParts.length > 1){
                $scope.templateUrl = "partials/info.html";
                var info = MapData.getRawMapDataInfoView(angular.copy(pointsParts),angular.copy(openParts));
                $scope.info = info;
            }
            else{
                $scope.templateUrl = "partials/info-single.html";
                var info = MapData.getRawMapDataSingle(pointsParts);
                $scope.info = info;
            }
        }
        else{
            var pointsParts = [];
        }

        //get map parameters from parameter and apply
        if(urlParts.map){
            var mapParts = urlParts.map+'';
            mapParts = mapParts.split('|');

            if(!urlParts.noMove){

                if(!urlParts.noMoveFilter){
                    var filter = MapData.getCurrentFilter();
                    var points = MapData.getPointData(pointsParts);

                    //adjust filter
                    for(var x in points){
                        if(filter[points[x].type] != true){
                            filter[points[x].type] = true;
                            $scope.filterChanged = true;
                        }

                        if(filter.start > points[x].endDate){
                            filter.start.setTime(points[x].endDate.getTime()-3600000);
                            $scope.filterChanged = true;
                        }
                        if(filter.end < points[x].startDate){
                            filter.end.setTime(points[x].startDate.getTime()+3600000);
                            $scope.filterChanged = true;
                        }
                    }

                    if($scope.filterChanged){
                        $rootScope.$broadcast('updateFilterInView',angular.copy(filter));
                        $rootScope.$broadcast('actualizeData',filter);
                    }


                }
                else{
                    $scope.noRefresh = true;
                    $location.search('noMoveFilter',null).replace();
                }


                // zoom to point
                MapService.zoomToPoint({lat:mapParts[0],lng:mapParts[1]},mapParts[2]);

            }
            else{
                $scope.noRefresh = true;
                $location.search('noMove',null).replace();
            }

        }
        else{
            var mapParts = [];
        }

        //get border properties from parameter and draw border
        MapService.clearBorder();
        if(urlParts.border){
            var borderParts = urlParts.border+'';
            borderParts = borderParts.split('|');

            var zoom = MapService.getZoom();

            //determine the marker size
            var cluster = MapData.getClusterOfPoint(borderParts[0],zoom);
            if(cluster.hasSingleData && zoom != 15){
                var count = 0;
            }
            else{
                var count = 0;
                for(var x in cluster.data){
                    if(cluster.data[x].length>0) count++;
                }
            }

            // draw border
            MapService.drawBorder({lat:cluster.point.lat,lng:cluster.point.lng},count);
        }

        $scope.pointsParts = pointsParts;
        $scope.openParts = openParts;
        $scope.mapParts = mapParts;
        $scope.borderParts = borderParts;

        $scope.initCall = false;
    });


    //onclick function to show a single point
    $scope.showPointOnMap = function($event,id){
        $event.stopPropagation();
        var filter = MapData.getCurrentFilter();
        var point = MapData.getPointData([id]);
        point = point[0];
        if(!filter[point.type] || filter.start > point.endDate || filter.end < point.startDate){
            //adjust filter
            jQuery('#alert-filter').click(function (event) {
                $(this).unbind(event);
                $scope.$apply( function(){
                    filter[point.type] = true;
                    if(filter.start > point.endDate) filter.start.setTime(point.endDate.getTime()-3600000);
                    if(filter.end < point.startDate) filter.end.setTime(point.startDate.getTime()+3600000);

                    $rootScope.$broadcast('updateFilterInView',angular.copy(filter));
                    $rootScope.$broadcast('actualizeData',filter);

                    $scope.zoomToPoint(point);
                });
                $("#alert").modal("hide");
            });
            jQuery('#alert').modal('show');
        }
        else{
            $scope.zoomToPoint(point);
        }
    }

    jQuery('#alert-cancel').click(function () {
        $("#alert").modal("hide");
    });

    //onclick listener to zoom to a point
    $scope.zoomToPoint = function(point){
        var url = {};

        if($scope.pointsParts) url.points = $scope.pointsParts.join('|');
        if($scope.openParts) url.open = $scope.openParts.join('|');
        url.map = point.point.lat +'|'+point.point.lng+'|18';
        url.noMoveFilter = true;

        url.border =  point.id;


        $location.search(url);

    }

    // onclick listener to open information in the info view
    $scope.open = function(id,open){
        if(open){
            $scope.openParts.push(id);

            if(id == 'concert' || id == 'exhib' || id == 'film' || id == 'other'){
                if($scope.info[id].data.length == 1){
                    $scope.openParts.push($scope.info[id].data[0].id);
                    $scope.info[id].data[0].isOpen = true;
                }

            }

            var url = {};

            if($scope.mapParts) url.map = $scope.mapParts.join('|');
            if($scope.openParts) url.open = $scope.openParts.join('|');
            if($scope.borderParts) url.border = $scope.borderParts.join('|');
            url.points = $scope.pointsParts.join('|');
            url.noMove = true;

            $location.search(url).replace();
        }
        else{
            var pos;
            if(id == 'concert' || id == 'exhib' || id == 'film' || id == 'other'){
                var typePoints = [];
                var x,i;
                for(x in  $scope.info[id].data){
                    typePoints.push($scope.info[id].data[x].id);
                }
                for(x in  typePoints){
                    pos = $scope.openParts.indexOf(typePoints[x]+'');
                    if(pos != -1) $scope.openParts.splice(pos,1);
                }
            }
            pos = $scope.openParts.indexOf(id+'');
            if(pos != -1) $scope.openParts.splice(pos,1);
        }
    }
};