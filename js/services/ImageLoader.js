'use strict';

eventMap.service('ImageLoader', function($rootScope) {

    var imageLoaded = function(){};

    var sources = {
        concertMapNR: 'img/concert3.png',
        exhibMapNR: 'img/exhib3.png',
        filmMapNR: 'img/film3.png',
        otherMapNR: 'img/other3.png',
        concertMapNB: 'img/concert2.png',
        exhibMapNB: 'img/exhib2.png',
        filmMapNB: 'img/film2.png',
        otherMapNB: 'img/other2.png',
        concertMap: 'img/concert1.png',
        exhibMap: 'img/exhib1.png',
        filmMap: 'img/film1.png',
        otherMap: 'img/other1.png',
        singleBorder:'img/single.png',
        multiBorder1:'img/multi1.png',
        multiBorder2:'img/multi2.png',
        multiBorder3:'img/multi3.png',
        multiBorder4:'img/multi4.png',
        bus : 'img/maki/bus-24.png',
        pub : 'img/maki/beer-12.png',
        bar : 'img/maki/bar-12.png',
        rest : 'img/maki/restaurant-12.png',
        hotel : 'img/maki/lodging-12.png',
        fastfood : 'img/maki/fast-food-12.png',
        cafe : 'img/maki/cafe-12.png',
        busLegend : 'img/maki/bus-18.png',
        pubLegend : 'img/maki/beer-18.png',
        barLegend : 'img/maki/bar-18.png',
        restLegend : 'img/maki/restaurant-18.png',
        hotelLegend : 'img/maki/lodging-18.png',
        fastfoodLegend : 'img/maki/fast-food-18.png',
        cafeLegend : 'img/maki/cafe-18.png'
    };

    var images = {};

    this.loadImages = function(){
        var loadedImages = 0;
        var numImages = 0;

        var src;

        for(src in sources) {
            numImages++;
        }

        for(src in sources) {
            images[src] = new Image();
            images[src].onload = function() {
                if(++loadedImages >= numImages) {
                    imageLoaded();
                    $rootScope.$broadcast('imageLoaded');
                }
            };
            images[src].src = sources[src];
        }
    };

    this.setOnLoad = function(callback){
        imageLoaded = callback;
    };

    this.getImage = function(name){
        return images[name];
    }

});