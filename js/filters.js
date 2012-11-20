'use strict';

/* Filters */

eventMap.filter('sliderDate', function() {
    return function(date,type) {
        if(date.getFullYear() > 2030 || date.getFullYear() < 1980) return '∞';

        var month = date.getMonth()+1;
        month = month < 10 ? '0' + month : month;

        var day = date.getDate();
        if(type == 'end' && date.getHours() <= 6){
            var newDate = new Date(date.getTime());
            newDate.setDate(newDate.getDate()-1);
            day = newDate.getDate();
        }
        day = day < 10 ? '0' + day : day;

        var string = '';
        if(new Date().getFullYear() != date.getFullYear()){
            var year = date.getFullYear() + '';
            string = day+'.'+month+'.'+year.substring(2,4);
        }
        else{
            string = day+'.'+month;
        }

        return string;
    };
});

eventMap.filter('replaceTypeName', function() {
    return function(type) {
        var string;
        switch (type) {
            case 'concert':
                string = 'Concert';
                break;
            case 'exhib':
                string = 'Exhibition';
                break;
            case 'film':
                string = 'Film';
                break;
            case 'other':
                string = 'Other Event';
                break;
            default:
                string = 'Other Event';
                break;
        }

        return string;
    };
});

eventMap.filter('infoDate', function($filter) {
    var standardDateFilterFn = $filter('date');
    return function(date) {



        var string = '';

        if(date){

            if(date.endDate.getTime() ==  date.startDate.getTime()){
                string = standardDateFilterFn(date.startDate, 'dd.MM.yyyy') + '<br>' + standardDateFilterFn(date.startDate, 'HH:mm');
            }
            else if((date.endDate - date.startDate)>86400000){
                string = standardDateFilterFn(date.startDate, 'dd.MM.yyyy') + ' until<br>' + standardDateFilterFn(date.endDate, 'dd.MM.yyyy');
            }
            else{
                string = standardDateFilterFn(date.startDate, 'dd.MM.yyyy') + '<br>' + standardDateFilterFn(date.startDate, 'HH:mm')+ ' until ' + standardDateFilterFn(date.endDate, 'HH:mm');
            }
        }

        return string;
    };
});


