'use strict';

//service for slider functions

eventMap.service('Slider', function() {

    var sliderCurrentDate = null;
    var sliderStartDate = null;
    var sliderEndDate = null;
    var sliderLength = 1000;

    //returns current date of the slider
    this.getSliderCurrentDate = function(){
        return sliderCurrentDate;
    }

    //returns start date
    this.getSliderStartDate = function(){
        return sliderStartDate;
    }

    //returns end date
    this.getSliderEndDate = function(){
        return sliderEndDate;
    }

    //returns the slider table which connects the slider values to date values
    this.getSliderTable = function(firstChange, secondChange, newSliderLength){

        sliderLength = newSliderLength ? newSliderLength : sliderLength;

        sliderCurrentDate = new Date();
        if(sliderCurrentDate.getHours() < 6){
            sliderCurrentDate.setDate(sliderCurrentDate.getDate()-1);
        }
        sliderCurrentDate.setHours(12);
        sliderCurrentDate.setMinutes(0);
        sliderCurrentDate.setSeconds(0);
        sliderCurrentDate.setMilliseconds(0);


        var startDate = new Date(sliderCurrentDate.getTime());
        startDate.setMonth(sliderCurrentDate.getMonth()-1);
        sliderStartDate = startDate;

        var firstChangeDate = new Date(sliderCurrentDate.getTime());
        firstChangeDate.setMonth(sliderCurrentDate.getMonth()+1);
        var secondChangeDate = new Date(sliderCurrentDate.getTime());
        secondChangeDate.setMonth(sliderCurrentDate.getMonth()+3);

        var endDate = new Date(sliderCurrentDate.getTime());
        endDate.setMonth(sliderCurrentDate.getMonth()+6);
        sliderEndDate = endDate;

        var daysFirstGap = Math.floor(( firstChangeDate - startDate ) / 86400000);
        var daysSecondGap = Math.floor(( secondChangeDate-firstChangeDate ) / 86400000);
        var daysLastGap = Math.floor(( endDate-secondChangeDate ) / 86400000);

        var valuesFirstGap = Math.floor(sliderLength*firstChange);
        var valuesSecondGap = Math.floor(sliderLength*secondChange-valuesFirstGap);
        var valuesLastGap = Math.floor(sliderLength-valuesFirstGap-valuesSecondGap);

        var x;
        var sliderTable = [];

        for(x=0;x<valuesFirstGap;x++){
            sliderTable[x] = Math.floor((x/valuesFirstGap)*daysFirstGap);
        }
        for(x=0;x<valuesSecondGap;x++){
            sliderTable[x+valuesFirstGap] = Math.floor((x/valuesSecondGap)*daysSecondGap)+daysFirstGap;
        }
        for(x=0;x<valuesLastGap;x++){
            sliderTable[x+valuesFirstGap+valuesSecondGap] = Math.floor((x/valuesLastGap)*daysLastGap)+daysFirstGap+daysSecondGap;
        }

        return sliderTable;

    }

    //returns the slider value for a specific date
    this.getSliderValues = function(sliderTable,sliderStartDate,sliderEndDate,start,end){
        var values = {start : null, end : null};

        var x;
        var valueStart = null;
        if(sliderStartDate>start || (sliderEndDate < start && start<end)){
            values.start = 0;
        }
        else{
            var daysStart = Math.round(( start - sliderStartDate ) / 86400000);
            for(x in sliderTable){
                if(sliderTable[x] == daysStart && !valueStart){
                    valueStart = x;
                }
                if(valueStart && sliderTable[x] != daysStart){
                    if(valueStart == x){
                        values.start = x;
                    }
                    else{
                        values.start = Math.round((parseInt(x)+parseInt(valueStart))/2);
                        break;
                    }
                }
            }
        }

        valueStart = null;
        if(sliderEndDate<end || (sliderStartDate>end && start<end)){
            values.end = sliderLength-1;
        }
        else{
            var daysEnd = Math.round(( end - sliderStartDate ) / 86400000)-1;
            for(x in sliderTable){
                if(sliderTable[x] == daysEnd && !valueStart){
                    valueStart = x;
                }
                if(valueStart && sliderTable[x] != daysEnd){
                    if(valueStart == x){
                        values.end = x;
                    }
                    else{
                        values.end = Math.round((parseInt(x)+parseInt(valueStart))/2);
                        break;
                    }
                }
            }
        }

        return values;
    }

});

