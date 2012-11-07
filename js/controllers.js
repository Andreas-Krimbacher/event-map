'use strict';

/* Controllers */

archWalk.MapController = function( $scope, $rootScope ) {
    var geocoder = new google.maps.Geocoder();


    //search location
    $scope.showLocation = null;
    $scope.$on('showLocation', function(e,locationSearchText){

        geocoder.geocode( { 'address': locationSearchText}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $scope.showLocation = results[0];
                $scope.$digest();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    });

    //DrawControl
    $scope.drawControl = null;
    $scope.editable = null;

    $scope.$on('editPolygon', function(e,active){
        if(active){
            $scope.drawControl = 'poly';
            $scope.editable = 'poly';
        }
        else{
            $scope.editable = null;
            $scope.drawControl = null;
        }

    });

    $scope.$on('editPoint', function(e,active){
        if(active){
            $scope.drawControl = 'point';
            $scope.editable = 'point';
        }
        else{
            $scope.editable = null;
            $scope.drawControl = null;
        }
    });

    $scope.$on('deleteElement', function(e,element){
        $scope.deleteElement(element);
        $scope.drawControl = element;
    });

    //Geocode Marker
    $scope.markerPosition = null;
    $scope.markerPositionInfo = {};
    $scope.$watch('markerPosition', function(newValue, oldValue){
        if(newValue){
            geocoder.geocode({'latLng': newValue}, function(results, status) {
                $scope.$apply(function() {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            $scope.markerPositionInfo.address_components = results[0].address_components;
                            $scope.markerPositionInfo.formatted_address = results[0].formatted_address;
                            $scope.markerPositionInfo.position =  results[0].geometry.location;

                            $scope.checkValidate();
                            $scope.showMarkerInfo();
                        } else {
                            $scope.markerPositionInfo = {};
                            alert('No results found');
                            $scope.checkValidate();
                            $scope.showMarkerInfo();
                        }
                    } else {
                        $scope.markerPositionInfo = {};
                        alert('Geocoder failed due to: ' + status);
                        $scope.checkValidate();
                        $scope.showMarkerInfo();
                    }
                });
            });

        }
        else{
            $scope.markerIsValid = false;
        }
    },true);


    //Validation info
    $scope.checkValidate = function(){
        if(!_.isEmpty($scope.markerPositionInfo) && $scope.polygon){
            $rootScope.$broadcast('setValidation', true);
        }
        else{
            $rootScope.$broadcast('setValidation', false);
        }
    };

    $scope.showMarkerInfo = function(){
        if(_.isEmpty($scope.markerPositionInfo)){
            $rootScope.$broadcast('showMarkerInfo',false);
        }
        else{
            $rootScope.$broadcast('showMarkerInfo',$scope.markerPositionInfo);
        }
    };

    $rootScope.getPolygonData = function(){
        return $scope.polygon;
    }


};

archWalk.FormController = function( $scope,$rootScope , $filter,  MediaWiki) {

    $scope.title = "";
    $scope.information = "";
    $scope.mainCategory = "Architecture";
    $scope.language = "English";
    $scope.markerInfo = {};
    $scope.markerInfo.formatted_address = "No point info available."

    $scope.mapData=false;

    $scope.polygonEdit = false;
    $scope.pointEdit = false;

    $scope.showLocation = function(locationSearchText){
        $rootScope.$broadcast('showLocation', locationSearchText);
    }




    $scope.saveData = function(){
        var pageName = $filter('pageNameTitle')($scope.title)+'_'+$scope.mainCategory+'_'+$filter('pageNameLocation')($scope.markerInfo)+'_'+$filter('pageNameLanguage')($scope.language);
        MediaWiki.checkPageName(pageName,function(status,pageName){
            if(status){
                $scope.createPage(pageName);
            }
        });
    }


    $scope.createPage = function(pageName){
        var poly = $rootScope.getPolygonData();
        var pointArray = poly.getPath().getArray();

        var wkt = 'POLYGON (('
        var x;

       for(x= 0; x<pointArray.length-1;x++){
            wkt += pointArray[x].Ya;
            wkt += ' ';
            wkt += pointArray[x].Za;
            wkt += ', ';
        }
        wkt += pointArray[x].Ya;
        wkt += ' ';
        wkt += pointArray[x].Za;
        wkt += '))';

        if(!$scope.otherCategories) $scope.otherCategories = [];


        var siteData = {
            pageName:pageName,
            title:$scope.title,
            mainCategory:$scope.mainCategory,
            otherCategories:$scope.otherCategories,
            language:$scope.language,
            information:$scope.information,
            wkt:wkt,
            lat:$scope.markerInfo.position.Ya,
            lng:$scope.markerInfo.position.Za,
            formatted_address:$scope.markerInfo.formatted_address,
            street_number:'undefined',
            route:'undefined',
            locality:'undefined',
            country:'undefined',
            postal_code:'undefined'
        }


        for(x in $scope.markerInfo.address_components){
            if($scope.markerInfo.address_components[x].types[0] == 'street_number'){
                siteData.street_number = $scope.markerInfo.address_components[x].long_name;
            }
            if($scope.markerInfo.address_components[x].types[0] == 'route'){
                siteData.route = $scope.markerInfo.address_components[x].long_name;
            }
            if($scope.markerInfo.address_components[x].types[0] == 'locality'){
                siteData.locality = $scope.markerInfo.address_components[x].long_name;
            }
            if($scope.markerInfo.address_components[x].types[0] == 'country'){
                siteData.country = $scope.markerInfo.address_components[x].long_name;
            }
            if($scope.markerInfo.address_components[x].types[0] == 'postal_code'){
                siteData.postal_code = $scope.markerInfo.address_components[x].long_name;
            }
        }



        MediaWiki.createPage(siteData,function(status,pageName){
            if(status){
                alert(pageName+' - was created successfully. Heureka!');
                $scope.clearForm();
            }
        });
    }


    //DrawControl
    $scope.editPolygon = function(){
        if($scope.polygonEdit){
            $rootScope.$broadcast('editPolygon', false);
            $scope.polygonEdit = false;
        }
        else{
            $rootScope.$broadcast('editPolygon', true);
            $scope.pointEdit = false;
            $scope.polygonEdit = true;
        }
    }

    $scope.editPoint = function(){
        if($scope.pointEdit){
            $rootScope.$broadcast('editPoint', false);
            $scope.pointEdit = false;
        }
        else{
            $rootScope.$broadcast('editPoint', true);
            $scope.polygonEdit = false;
            $scope.pointEdit = true;
        }
    }

    $scope.deleteElement = function(){
        if( $scope.polygonEdit){
            $rootScope.$broadcast('deleteElement', 'poly');
        }
        if( $scope.pointEdit){
            $rootScope.$broadcast('deleteElement', 'point');
        }
    }

    //Validation info
    $scope.$on('setValidation', function(e,status){
        $scope.mapData=status;
    });

    $scope.$on('showMarkerInfo', function(e,info){
        if(info){
            $scope.markerInfo = info;
        }
        else{
            $scope.markerInfo.formatted_address = "No point info available.";
            $scope.markerInfo.address_components = null;
        }
    });

    //clearForm

    $scope.clearForm = function(){
        $scope.title = "";
        $scope.information = "";

        $rootScope.$broadcast('deleteElement', 'poly');
        $rootScope.$broadcast('deleteElement', 'point');

        $scope.polygonEdit = false;
        $scope.pointEdit = false;
        $rootScope.$broadcast('editPolygon', false);
        $rootScope.$broadcast('editPoint', false);

    }

};
