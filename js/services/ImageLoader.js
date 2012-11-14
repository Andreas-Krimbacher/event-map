'use strict';

eventMap.service('ImageLoader', function() {

    var imageLoaded = function(){};

//    var sources = {
//        concertMap: 'img/concert2.png',
//        exhibMap: 'img/exhib2.png',
//        filmMap: 'img/film2.png',
//        otherMap: 'img/other2.png'
//    };

    var sources = {
        concertMap: 'img/concert3.png',
        exhibMap: 'img/exhib3.png',
        filmMap: 'img/film3.png',
        otherMap: 'img/other3.png'
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