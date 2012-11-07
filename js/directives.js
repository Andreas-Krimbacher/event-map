'use strict';

/* Directives */

eventMap.directive('map', function(Leaflet) {
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

        }
    };
});
