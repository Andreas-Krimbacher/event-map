'use strict';

/* Service */

eventMap.service('Utility', function() {

    this.getSliderTable = function(firstChange, secondChange){

        var currentDate = new Date();
        var startDate = new Date();
        startDate.setMonth(currentDate.getMonth()-1);
        var firstChangeDate = new Date();
        firstChangeDate.setMonth(currentDate.getMonth()+1);
        var secondChangeDate = new Date();
        secondChangeDate.setMonth(currentDate.getMonth()+3);
        var endDate = new Date();
        endDate.setMonth(currentDate.getMonth()+6);

        var datesFirstGap = Math.floor(( startDate-firstChangeDate ) / 86400000);
        var datesSecondGap = Math.floor(( secondChangeDate-firstChangeDate ) / 86400000);
        var datesLastGap = Math.floor(( endDate-secondChangeDate ) / 86400000);





    }

});

