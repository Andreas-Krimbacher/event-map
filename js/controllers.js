'use strict';

/* Controllers */

eventMap.InfoViewController = function( $scope) {

};

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

eventMap.FilterBarController = function( $scope, $rootScope, Slider) {

    $scope.sliderTable = Slider.getSliderTable(0.45,0.7,1000);
    $scope.sliderCurrentDate = Slider.getSliderCurrentDate();
    $scope.sliderStartDate = Slider.getSliderStartDate();
    $scope.sliderEndDate = Slider.getSliderEndDate();
    $scope.sliderStartDate6 = new Date($scope.sliderStartDate.getTime());
    $scope.sliderStartDate6.setHours(6);

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

    var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate,$scope.sliderEndDate,$scope.filter.start,$scope.filter.end);

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
            })
        },
        change : function( event, ui ) {
            $scope.actualizeData();
        }
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

        var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate,$scope.sliderEndDate,$scope.filter.start,$scope.filter.end);
        jQuery("#filter-slider").slider('values', [ sliderValues.start, sliderValues.end ]);
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
                var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate,$scope.sliderEndDate,$scope.filter.start,$scope.filter.end);
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
                var sliderValues = Slider.getSliderValues($scope.sliderTable,$scope.sliderStartDate,$scope.sliderEndDate,$scope.filter.start,$scope.filter.end);
                jQuery("#filter-slider").slider('values', [ sliderValues.start, sliderValues.end ]);
            }
        });
    });



    $scope.onCategoryBtnClick = function(category){
        $scope.filter[category] = !$scope.filter[category];
        $scope.actualizeData();
    }

    $scope.actualizeData = function(){
        $rootScope.$broadcast('actualizeData',angular.copy($scope.filter));
    }


};