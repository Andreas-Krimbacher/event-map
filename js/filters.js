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


