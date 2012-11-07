'use strict';

/* Directives */

archWalk.directive('map', function(Leaflet) {
    return {
        restrict: 'E',
        replace: false,
        template: '<div id="map"></div>',
        link: function(scope, element, attrs) {

            var mapOptions = {
                zoom: 14,
                center: new google.maps.LatLng(47.373,8.542),
                disableDefaultUI: true,
                mapTypeControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById('map'),
                mapOptions);

            scope.$watch('showLocation', function(newLocation, oldLocation){
                if(newLocation){
                    map.setCenter(newLocation.geometry.location);
                    map.setZoom(16);
                }
            },true);



            scope.polygon = null;
            scope.point = null;

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: null,
                drawingControl: false,
                polygonOptions : {
                    strokeWeight: 0,
                    fillOpacity: 0.45,
                    editable: true,
                    cursor: 'grabbing'
                },
                markerOptions: {
                    draggable: true,
                    cursor: 'grabbing'
                }
            });
            drawingManager.setMap(map);

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
                // Switch back to non-drawing mode after drawing a shape.
                scope.$apply(function() {
                    scope.drawControl = null;

                    if (e.type == google.maps.drawing.OverlayType.MARKER) {
                        scope.point = e.overlay;
                        scope.markerPosition = e.overlay.position;

                        google.maps.event.addListener(scope.point, "dragend", function(e) {
                            scope.$apply(function() {
                                scope.markerPosition = e.latLng;
                            });
                        });
                    }
                    if (e.type == google.maps.drawing.OverlayType.POLYGON) {
                        scope.polygon = e.overlay;
                        scope.checkValidate();
                    }
                });

            });


            scope.$watch('drawControl', function(newValue, oldValue){
                if(newValue == 'poly'){
                    if(scope.polygon){
                        scope.drawControl = null;
                    }
                    else{
                        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
                    }
                }
                if(newValue == 'point'){
                    if(scope.point){
                        scope.drawControl = null;
                    }
                    else{
                        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
                    }
                }
                if(!newValue){
                    drawingManager.setDrawingMode(null);
                }
            });

            scope.$watch('editable', function(newValue, oldValue){

                if(scope.polygon) scope.polygon.setEditable(false);
                if(scope.point) scope.point.setDraggable(false);

                if(newValue == 'poly' && scope.polygon){
                    if(scope.polygon){
                        scope.polygon.setEditable(true);
                    }
                }
                if(newValue == 'point' && scope.point){
                    if(scope.point){
                        scope.point.setDraggable(true);
                    }
                }
            });

            scope.deleteElement = function(element){
                if(element == 'poly' && scope.polygon){
                    scope.polygon.setMap(null);
                    scope.polygon = null;

                    scope.checkValidate();

                    scope.drawControl = 'poly';
                }
                if(element == 'point' && scope.point){
                    google.maps.event.clearListeners(scope.point, "dragend");
                    scope.markerPosition = null;
                    scope.point.setMap(null);
                    scope.point = null;

                    scope.markerPositionInfo = {};
                    scope.checkValidate();
                    scope.showMarkerInfo();

                    scope.drawControl = 'point';
                }
            };
        }
    };
});
