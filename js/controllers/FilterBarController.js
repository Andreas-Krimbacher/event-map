'use strict';

// Controller for the Filter bar

eventMap.FilterBarController = function( $scope, $rootScope, Slider,MapService) {
    // init slider values
    $scope.sliderTable = Slider.getSliderTable(0.45,0.7,1000);
    $scope.sliderCurrentDate = Slider.getSliderCurrentDate();
    $scope.sliderStartDate = Slider.getSliderStartDate();
    $scope.sliderEndDate = Slider.getSliderEndDate();
    $scope.sliderStartDate6 = new Date($scope.sliderStartDate.getTime());
    $scope.sliderStartDate6.setHours(6);
    $scope.sliderEndDate6 = new Date($scope.sliderEndDate.getTime());
    $scope.sliderEndDate6.setHours(6);

    //init filter
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

    // get slider values
    var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate6,$scope.sliderEndDate6,$scope.filter.start,$scope.filter.end);


    //init POI buttons
    $scope.poiButtonsActive = true;
    $scope.eatDrinkActive = false;
    $scope.busActive = false;

    // create slider
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

    //listener to update the view to the current filter
    $scope.$on('updateFilterInView', function(event,filter) {
        var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate6,$scope.sliderEndDate6,filter.start,filter.end);
        jQuery("#filter-slider").slider('values', [ sliderValues.start, sliderValues.end ]);
        $scope.filter = filter;
    });

    //set filter dates in view
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

    //create datepickers
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

    // listener to update the datepicker
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

    //onklick for category filter buttons
    $scope.onCategoryBtnClick = function(category){
        $scope.filter[category] = !$scope.filter[category];
        $scope.actualizeData();
    }

    //function to actualize the map data
    $scope.actualizeData = function(){
        $rootScope.$broadcast('actualizeData',angular.copy($scope.filter));
    }

    MapService.setMapIsLoadedFunction(function(){
        $rootScope.$broadcast('mapIsLoaded',angular.copy($scope.filter));
    });

    $scope.$on('infoIsLoaded', function() {
        $rootScope.$broadcast('actualizeData',angular.copy($scope.filter));
    });

    //onclick functions for POI buttons
    $scope.$on('setPoiButtonsActive', function(event,mode) {
        if(!$scope.$$phase) {
            $scope.$apply(function(){
                if(!mode){
                    $scope.setPOIOverlay('bus',false);
                    $scope.setPOIOverlay('eatanddrink',false);
                }
                $scope.poiButtonsActive = mode;
            });
        }
        else{
            $scope.setPOIOverlay('bus',false);
            $scope.setPOIOverlay('eatanddrink',false);
            $scope.poiButtonsActive = mode;
        }
    });
    $scope.setPOIOverlay = function(type,mode){
        if($scope.poiButtonsActive){
            if(type == 'bus'){
                $scope.busActive = mode;
                MapService.setBusOverlay(mode);
            }
            if(type == 'eatanddrink'){
                $scope.eatDrinkActive = mode;
                MapService.setEatDrinkOverlay(mode);
            }
            $rootScope.$broadcast('switchLegend',{type:type,mode:mode});
        }
    }
};