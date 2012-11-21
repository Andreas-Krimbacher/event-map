'use strict';

/* Controllers */

eventMap.InfoViewController = function( $scope, $rootScope,$location, MapData, $route, MapService) {

    $scope.pointsParts = [];
    $scope.mapParts = [];
    $scope.openParts = [];
    $scope.borderParts = [];

    $scope.noRefresh = false;
    $scope.filterChanged = false;

    $rootScope.$on('$routeUpdate', function() {

        $scope.filterChanged = false;

        if($scope.noRefresh){
            $scope.noRefresh = false;
            return;
        }

        var urlParts = $location.search()

        if(urlParts.points){
            var pointsParts = urlParts.points+'';
            pointsParts = pointsParts.split('|');
        }

        if(urlParts.open){
            var openParts = urlParts.open+'';
            openParts = openParts.split('|');
        }
        else{
            var openParts = [];
            if(pointsParts && pointsParts.length < 5)  var openParts = angular.copy(pointsParts);
        }



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




        if(urlParts.map){
            var mapParts = urlParts.map+'';
            mapParts = mapParts.split('|');

            if(!urlParts.noMove){

                if(!urlParts.noMoveFilter){
                    var filter = MapData.getCurrentFilter();
                    var points = MapData.getPointData($scope.pointsParts);

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

        MapService.clearBorder();
        if(urlParts.border && !$scope.filterChanged){
            var borderParts = urlParts.border+'';
            borderParts = borderParts.split('|');

            MapService.drawBorder({lat:borderParts[0],lng:borderParts[1]},borderParts[2]);
        }



        $scope.pointsParts = pointsParts;
        $scope.openParts = openParts;
        $scope.mapParts = mapParts;
        $scope.borderParts = borderParts;

    });

    $scope.showPointOnMap = function($event,id){
        $event.stopPropagation();
        var filter = MapData.getCurrentFilter();
        var point = MapData.getPointData([id]);
        point = point[0];
        if(!filter[point.type] || filter.start > point.endDate || filter.end < point.startDate){
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

    $scope.zoomToPoint = function(point){
        var url = {};

        if($scope.pointsParts) url.points = $scope.pointsParts.join('|');
        if($scope.openParts) url.open = $scope.openParts.join('|');
        url.map = point.point.lat +'|'+point.point.lng+'|18';
        url.noMoveFilter = true;

        var clusterPoints = MapData.getCluster18OfPoint(point.id);
        var count = 0;
        for(var x in clusterPoints.data){
            if(clusterPoints.data[x].length>0) count++;
        }
        if(clusterPoints.hasSingleData) count=0;
        url.border =  point.point.lat +'|'+point.point.lng+'|'+count;


        $location.search(url);

    }


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

eventMap.MapController = function( $scope ,$rootScope, MapData, MapService,ImageLoader) {

    $scope.mapData = null;

    var imagesLoaded = false;

    $scope.$on('mapIsLoaded', function() {
        MapData.loadInfoData();
    });

    $scope.$on('actualizeData', function(event,filter) {
        MapService.clearBorder();
        if(filter) MapData.filterData(filter);
        MapData.clusterData();

        $scope.mapData = MapData.getMapData();

        if(!imagesLoaded){
            ImageLoader.setOnLoad(function(){
                imagesLoaded = true;
                jQuery('#filter-bar').removeClass('hide-element');
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

eventMap.FilterBarController = function( $scope, $rootScope, Slider,MapService) {

    $scope.sliderTable = Slider.getSliderTable(0.45,0.7,1000);
    $scope.sliderCurrentDate = Slider.getSliderCurrentDate();
    $scope.sliderStartDate = Slider.getSliderStartDate();
    $scope.sliderEndDate = Slider.getSliderEndDate();
    $scope.sliderStartDate6 = new Date($scope.sliderStartDate.getTime());
    $scope.sliderStartDate6.setHours(6);
    $scope.sliderEndDate6 = new Date($scope.sliderEndDate.getTime());
    $scope.sliderEndDate6.setHours(6);

    $scope.filter = {concert: true,
        exhib: true,
        film: true,
        other: true,
        start: null,
        end: null};

    //init time filter
    $scope.filter.start = new Date($scope.sliderCurrentDate.getTime());
    $scope.filter.start.setHours(6);
    $scope.filter.end = new Date($scope.sliderCurrentDate.getTime());
    $scope.filter.end.setHours(6);
    $scope.filter.end.setDate($scope.filter.start.getDate()+8);

    var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate6,$scope.sliderEndDate6,$scope.filter.start,$scope.filter.end);

    jQuery("#filter-slider").slider({
        range: true,
        min: 0,
        max: 999,
        values: [ sliderValues.start, sliderValues.end ],
        slide: function( event, ui ) {
            $scope.$apply(function(){
                if(ui.values[0] == 0){
                    $scope.filter.start.setFullYear(1971);
                }
                else{
                    $scope.filter.start.setTime($scope.sliderStartDate6.getTime()+$scope.sliderTable[ui.values[0]]*86400000);
                    if($scope.filter.start.getHours() != 6) $scope.filter.start.setHours(6);
                }
                if(ui.values[1] == 999){
                    $scope.filter.end.setFullYear(2040);
                }
                else{
                    $scope.filter.end.setTime($scope.sliderStartDate6.getTime()+(($scope.sliderTable[ui.values[1]]+1)*86400000));
                    if($scope.filter.end.getHours() != 6) $scope.filter.end.setHours(6);
                }
                $scope.actualizeData();
                if($scope.datepicker) $scope.updateDatepicker();
            })
        },
        change : function( event, ui ) {
            $scope.actualizeData();
        }
    });

    $scope.$on('updateFilterInView', function(event,filter) {
        var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate6,$scope.sliderEndDate6,filter.start,filter.end);
        jQuery("#filter-slider").slider('values', [ sliderValues.start, sliderValues.end ]);
        $scope.filter = filter;
    });

    $scope.setFilterDates = function(string){
        var today = new Date();
        if(today.getHours() < 6){
            today.setDate(today.getDate()-1);
        }

        today.setHours(12);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        var todayStart = new Date(today.getTime());
        todayStart.setHours(6);
        var todayEnd = new Date(today.getTime()+86400000);
        todayEnd.setHours(6);


        if(string == 'today'){
            $scope.filter.start.setTime(todayStart.getTime());
            $scope.filter.end.setTime(todayEnd.getTime());
        }
        if(string == 'tomorrow'){
            $scope.filter.start.setTime(todayStart.getTime()+86400000);
            $scope.filter.end.setTime(todayEnd.getTime()+86400000);
        }
        if(string == 'thisWeek'){
            $scope.filter.start.setTime(todayStart.getTime());
            $scope.filter.end.setTime(todayEnd.getTime()+86400000*7);
        }

        var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate6,$scope.sliderEndDate6,$scope.filter.start,$scope.filter.end);
        jQuery("#filter-slider").slider('values', [ sliderValues.start, sliderValues.end ]);

        if($scope.datepicker) $scope.updateDatepicker();
    }

    //Datepicker

    $scope.datepicker = false;

    $(function() {
        $( "#datepicker-start" ).datepicker({
            onSelect: function( selectedDate ) {
                var date = new Date(selectedDate);
                date.setHours(6);
                $scope.$apply($scope.filter.start.setTime(date.getTime()));
                $( "#datepicker-end" ).datepicker( "option", "minDate", selectedDate );
                var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate6,$scope.sliderEndDate6,$scope.filter.start,$scope.filter.end);
                jQuery("#filter-slider").slider('values', [ sliderValues.start, sliderValues.end ]);
            }
        });
    });
    $(function() {
        $( "#datepicker-end" ).datepicker({
            onSelect: function( selectedDate ) {
                var date = new Date(selectedDate);
                date.setHours(6);
                date.setDate(date.getDate()+1);
                $scope.$apply($scope.filter.end.setTime(date.getTime()));
                $( "#datepicker-start" ).datepicker( "option", "maxDate", selectedDate );
                var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate6,$scope.sliderEndDate6,$scope.filter.start,$scope.filter.end);
                jQuery("#filter-slider").slider('values', [ sliderValues.start, sliderValues.end ]);
            }
        });
    });

    $scope.$watch('datepicker',function(newValue){
        if(newValue) $scope.updateDatepicker();
    })

    $scope.updateDatepicker = function(){
        if($scope.filter.start.getFullYear() < 1980){
            $( "#datepicker-start" ).datepicker( "setDate", null );
            $( "#datepicker-end" ).datepicker( "option", "minDate", null );
        }
        else{
            $( "#datepicker-start" ).datepicker( "setDate", $scope.filter.start );
            $( "#datepicker-end" ).datepicker( "option", "minDate", $scope.filter.start );
        }
        if($scope.filter.end.getFullYear() > 2030){
            $( "#datepicker-end" ).datepicker( "setDate", null );
            $( "#datepicker-start" ).datepicker( "option", "maxDate", null );
        }
        else{
            if($scope.filter.end.getHours() <= 6){
                $( "#datepicker-end" ).datepicker( "setDate", new Date($scope.filter.end.getTime() - 86400000) );
                $( "#datepicker-start" ).datepicker( "option", "maxDate", new Date($scope.filter.end.getTime() - 86400000) );
            }
            else{
                $( "#datepicker-end" ).datepicker( "setDate", $scope.filter.end );
                $( "#datepicker-start" ).datepicker( "option", "maxDate", $scope.filter.end );
            }
        }

    };



    $scope.onCategoryBtnClick = function(category){
        $scope.filter[category] = !$scope.filter[category];
        $scope.actualizeData();
    }

    $scope.actualizeData = function(){
        $rootScope.$broadcast('actualizeData',angular.copy($scope.filter));
    }

    MapService.setMapIsLoadedFunction(function(){
        $rootScope.$broadcast('mapIsLoaded',angular.copy($scope.filter));
    });

    $scope.$on('infoIsLoaded', function() {
        $rootScope.$broadcast('actualizeData',angular.copy($scope.filter));
    });


    $scope.setPOIOverlay = function(type,mode){
        if(type == 'bus') MapService.setBusOverlay(mode);
        if(type == 'eatDrink') MapService.setEatDrinkOverlay(mode);
    }
};