'use strict';

/* Provider */

eventMap.provider('Leaflet', function() {
    var Leaflet = L;

    this.$get = function() {
        return Leaflet;
    };
});

/* Service */

eventMap.factory('MapService', ['Leaflet',function(Leaflet) {
    var MapService = {};







    return MapService;
}]);
