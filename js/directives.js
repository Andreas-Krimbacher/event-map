'use strict';

/* Directives */

eventMap.directive('map', function(Leaflet) {
    return {
        restrict: 'E',
        replace: false,
        template: '<div id="map"></div>',
        link: function(scope, element, attrs) {

            var imageBoundaries = new google.maps.LatLngBounds (
                new google.maps.LatLng(47.3635184326772 ,8.52219235359625), // lower left coordinate
                new google.maps.LatLng(47.3825878958978 , 8.55067793132157) // upper right coordinate
            );
//            var mapOptions = {
//                zoom: 16,
//                minZoom: 15,
//                maxExtent:imageBoundaries,
//                center: new google.maps.LatLng(47.373,8.542),
//                disableDefaultUI: true,
//                mapTypeControl: true,
//                mapTypeId: google.maps.MapTypeId.ROADMAP
//            };
//            var map = new google.maps.Map(document.getElementById('map'),
//                mapOptions);
//

//




            var moonTypeOptions = {
                getTileUrl: function(coord, zoom) {
                    var normalizedCoord = getNormalizedCoord(coord, zoom);
                    if (!normalizedCoord) {
                        return null;
                    }
                    var bound = Math.pow(2, zoom);
                    return "img/tiles" +
                        "/" + zoom + "/" + normalizedCoord.x + "/" +
                        (bound - normalizedCoord.y - 1) + ".jpg";
                },
                tileSize: new google.maps.Size(256, 256),
                maxZoom: 18,
                minZoom: 15,
                name: "Moon"
            };

            var moonMapType = new google.maps.ImageMapType(moonTypeOptions);



                var mapOptions = {
                    center: new google.maps.LatLng(47.37295,8.53659),
                    zoom: 15,
                    draggable:false,
                    streetViewControl: false,
                    mapTypeControl:false
                };

                var map = new google.maps.Map(document.getElementById("map"),
                    mapOptions);
                map.mapTypes.set('moon', moonMapType);
                map.setMapTypeId('moon');


// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
            function getNormalizedCoord(coord, zoom) {
                var y = coord.y;
                var x = coord.x;

                // tile range in one direction range is dependent on zoom level
                // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
                var tileRange = 1 << zoom;

                // don't repeat across y-axis (vertically)
                if (y < 0 || y >= tileRange) {
                    return null;
                }

                // repeat across x-axis
                if (x < 0 || x >= tileRange) {
                    x = (x % tileRange + tileRange) % tileRange;
                }

                return {
                    x: x,
                    y: y
                };
            }

            google.maps.event.addListener(map,'zoom_changed',function(e) {
                if(map.getZoom()>15){
                    map.setOptions({draggable:true});
                    checkBounds();
                }
                else{
                    map.setOptions({draggable:false});
                    map.setCenter(new google.maps.LatLng(47.37295,8.53659));
                }

                 });

            google.maps.event.addListener(map,'center_changed',function() { checkBounds(); });


            function checkBounds() {
                var zoom = map.getZoom();
                if(zoom==16){
                    imageBoundaries = new google.maps.LatLngBounds (
                        new google.maps.LatLng(47.364+0.0047 ,8.522+0.0075), // lower left coordinate
                        new google.maps.LatLng(47.383-0.0045 ,8.551-0.0071) // upper right coordinate
                    );
                }
                else if(zoom==17){
                    imageBoundaries = new google.maps.LatLngBounds (
                        new google.maps.LatLng(47.364+0.002 ,8.522+0.004), // lower left coordinate
                        new google.maps.LatLng(47.383-0.0023 ,8.551-0.004) // upper right coordinate
                    );
                }
                else if(zoom==18){
                    imageBoundaries = new google.maps.LatLngBounds (
                        new google.maps.LatLng(47.364+0.0008 ,8.522+0.002), // lower left coordinate
                        new google.maps.LatLng(47.383-0.001 ,8.551-0.002) // upper right coordinate
                    );
                }
                if(! imageBoundaries.contains(map.getCenter())) {
                    var C = map.getCenter();
                    var X = C.lng();
                    var Y = C.lat();

                    var AmaxX = imageBoundaries.getNorthEast().lng();
                    var AmaxY = imageBoundaries.getNorthEast().lat();
                    var AminX = imageBoundaries.getSouthWest().lng();
                    var AminY = imageBoundaries.getSouthWest().lat();

                    if (X < AminX) {X = AminX;}
                    if (X > AmaxX) {X = AmaxX;}
                    if (Y < AminY) {Y = AminY;}
                    if (Y > AmaxY) {Y = AmaxY;}

                    map.setCenter(new google.maps.LatLng(Y,X));
                }
            }
        }
    };
});
