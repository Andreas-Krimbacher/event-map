'use strict';

eventMap.service('ImageLoader', function() {

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
        multi1:'img/multi1.png',
        multi2:'img/multi2.png',
        multi3:'img/multi3.png',
        multi4:'img/multi4.png'
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