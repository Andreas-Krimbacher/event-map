'use strict';

/* Controllers */

eventMap.MapController = function( $scope ) {



};

eventMap.FormController = function( $scope) {
    jQuery("#filter-slider").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 75, 300 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });


};
