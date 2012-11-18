'use strict';

eventMap.service('MapService', function(ImageLoader,$rootScope,$location, $http) {

    var map = null;
    var baseMap = null;
    var overlay = null;
    var currentMarkers = [];
    var markerZoomChangeListener = null;
    this.mapIsLoaded = function(){};

    var eatDrinkData = [];
    var currentEatDrinkMarker = [];
    var busData = [];
    var currentBusMarker = [];

    this.getOverlay = function(){
        return overlay;
    }

    this.getMap = function(){
        return map;
    }

    this.setMapIsLoadedFunction = function(func){
        this.mapIsLoaded = func;
    }

    this.getEatDrinkData = function(){
        $http.get('data/RestaurantList.json').success(function(data) {
            eatDrinkData = data;
        });
    }

    this.setEatDrinkOverlay = function(mode){
        if(mode){
            var k = eatDrinkData.length;
            while(k--){
                if(!eatDrinkData[k].marker){
                    eatDrinkData[k].marker = new google.maps.Marker({
                        position: new google.maps.LatLng(eatDrinkData[k].y,eatDrinkData[k].x),
                        title : eatDrinkData[k].Name,
                        icon : 'img/rest.png',
                        zIndex : 101
                    });
                }
                currentEatDrinkMarker.push(eatDrinkData[k].marker);
                eatDrinkData[k].marker.setMap(map);
            }
        }
        else{
            while(currentEatDrinkMarker[0]){
                currentEatDrinkMarker.pop().setMap(null);
            }
        }
    }

    this.getBusData = function(){
        $http.get('data/BusList.json').success(function(data) {
            busData = data;
        });
    }

    this.setBusOverlay = function(mode){
        if(mode){
            var k = busData.length;
            while(k--){
                if(!busData[k].marker){
                    busData[k].marker = new google.maps.Marker({
                        position: new google.maps.LatLng(busData[k].y,busData[k].x),
                        title : busData[k].Name,
                        icon : 'img/bus.png',
                        zIndex : 101
                    });
                }
                currentBusMarker.push(busData[k].marker);
                busData[k].marker.setMap(map);
            }
        }
        else{
            while(currentBusMarker[0]){
                currentBusMarker.pop().setMap(null);
            }
        }
    }

    this.showMapData = function(mapData){

        this.showMarkers(mapData);

        var that = this;
        var mapData = mapData;
        google.maps.event.removeListener(markerZoomChangeListener);
        markerZoomChangeListener = google.maps.event.addListener(map,'zoom_changed',function(e) {
            that.showMarkers(mapData);
        });

    };

    this.showMarkers = function(mapData){

        while(currentMarkers[0]){
            currentMarkers.pop().setMap(null);
        }

        if(map.getZoom() == 15){
            for(var x in mapData.zoom15){
                this.drawCluster(mapData.zoom15[x]);
            }
        }
        if(map.getZoom() == 16){
            for(var x in mapData.zoom16){
                if(mapData.zoom16[x].hasData){
                    if(mapData.zoom16[x].hasSingleData){
                        if(mapData.zoom16[x].data.concert[0]) this.drawMarker(mapData.zoom16[x].data.concert[0]);
                        if(mapData.zoom16[x].data.exhib[0]) this.drawMarker(mapData.zoom16[x].data.exhib[0]);
                        if(mapData.zoom16[x].data.film[0]) this.drawMarker(mapData.zoom16[x].data.film[0]);
                        if(mapData.zoom16[x].data.other[0]) this.drawMarker(mapData.zoom16[x].data.other[0]);
                    }
                    else{
                        this.drawCluster(mapData.zoom16[x]);
                    }
                }
            }
        }
        if(map.getZoom() == 17){
            for(var x in mapData.zoom17){
                if(mapData.zoom17[x].hasData){
                    if(mapData.zoom17[x].hasSingleData){
                        if(mapData.zoom17[x].data.concert[0]) this.drawMarker(mapData.zoom17[x].data.concert[0]);
                        if(mapData.zoom17[x].data.exhib[0]) this.drawMarker(mapData.zoom17[x].data.exhib[0]);
                        if(mapData.zoom17[x].data.film[0]) this.drawMarker(mapData.zoom17[x].data.film[0]);
                        if(mapData.zoom17[x].data.other[0]) this.drawMarker(mapData.zoom17[x].data.other[0]);
                    }
                    else{
                        this.drawCluster(mapData.zoom17[x]);
                    }
                }
            }
        }
        if(map.getZoom() == 18){
            for(var x in mapData.zoom18){
                if(mapData.zoom18[x].hasData){
                    if(mapData.zoom18[x].hasSingleData){
                        if(mapData.zoom18[x].data.concert[0]) this.drawMarker(mapData.zoom18[x].data.concert[0]);
                        if(mapData.zoom18[x].data.exhib[0]) this.drawMarker(mapData.zoom18[x].data.exhib[0]);
                        if(mapData.zoom18[x].data.film[0]) this.drawMarker(mapData.zoom18[x].data.film[0]);
                        if(mapData.zoom18[x].data.other[0]) this.drawMarker(mapData.zoom18[x].data.other[0]);
                    }
                    else{
                        this.drawCluster(mapData.zoom18[x]);
                    }
                }
            }
        }
    }


    this.zoomToPoint = function(point){
        map.setZoom(18);

        var imageBoundaries = new google.maps.LatLngBounds (
            new google.maps.LatLng(47.3646 ,8.5240), // lower left coordinate
            new google.maps.LatLng(47.3815 ,8.5485) // upper right coordinate
        )

        var latLng = new google.maps.LatLng(point.lat,point.lng);

        if(!imageBoundaries.contains(latLng)) {
            var X = latLng.lng();
            var Y = latLng.lat();

            var AmaxX = imageBoundaries.getNorthEast().lng();
            var AmaxY = imageBoundaries.getNorthEast().lat();
            var AminX = imageBoundaries.getSouthWest().lng();
            var AminY = imageBoundaries.getSouthWest().lat();

            if (X < AminX) {X = AminX;}
            if (X > AmaxX) {X = AmaxX;}
            if (Y < AminY) {Y = AminY;}
            if (Y > AmaxY) {Y = AmaxY;}

            latLng = new google.maps.LatLng(Y,X);
        }

        map.setCenter(latLng);
    }

    this.drawCluster = function(cluster){

        if(!cluster.marker){

        var canvas = document.createElement("canvas");
//            canvas.width = 68;
//            canvas.height = 68;
//
//            var context = canvas.getContext("2d");
//
//            context.shadowColor ="#707070";
//            context.shadowOffsetX = 2;
//            context.shadowOffsetY = 2;
//            context.shadowBlur = 2;
//            context.font =  "normal bold 12px sans-serif";
//            context.fillStyle    = "#000000";
//
//            context.drawImage(ImageLoader.getImage('concertMap'),0,0);
//            context.drawImage(ImageLoader.getImage('exhibMap'),36,0);
//            context.drawImage(ImageLoader.getImage('filmMap'),0,36);
//            context.drawImage(ImageLoader.getImage('otherMap'),36,36);
//
//            var value = cluster.data.concert.length;
//            var metrics = context.measureText(value);
//            var textWidth = metrics.width;
//            var xPosition = 16 - (textWidth/2);
//            context.fillText(value,xPosition,29);
//
//            var value = cluster.data.exhib.length;
//            var metrics = context.measureText(value);
//            var textWidth = metrics.width;
//            var xPosition = 16 - (textWidth/2);
//            context.fillText(value,xPosition+36,29);
//
//            var value = cluster.data.film.length;
//            var metrics = context.measureText(value);
//            var textWidth = metrics.width;
//            var xPosition = 16 - (textWidth/2);
//            context.fillText(value,xPosition,29+36);
//
//            var value = cluster.data.other.length;
//            var metrics = context.measureText(value);
//            var textWidth = metrics.width;
//            var xPosition = 16 - (textWidth/2);
//            context.fillText(value,xPosition+36,29+36);

            var symbolCount = 0;
            for(var x in cluster.data){
                if(cluster.data[x][0]) symbolCount++;
            }

            if(symbolCount < 2){
                canvas.width = 38;
                canvas.height = 20;
            }
            else if(symbolCount < 3){
                canvas.width = 38;
                canvas.height = 42;
            }
            else{
                canvas.width = 78;
                canvas.height = 42;
            }

            var context = canvas.getContext("2d");

            context.shadowColor ="#707070";
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 2;
            context.font =  "normal bold 12px sans-serif";
            context.fillStyle    = "#000000";

            var position = [{imageX : 0,
                imageY : 0,
                textX : 21,
                textY : 14
            },{imageX : 0,
                imageY : 22,
                textX : 21,
                textY : 36
            },{imageX : 40,
                imageY : 0,
                textX : 61,
                textY : 14
            },{imageX : 40,
                imageY : 22,
                textX : 61,
                textY : 36
            }];

            var positionCount = 0;

            var value = cluster.data.concert.length;
            if(value){
                context.drawImage(ImageLoader.getImage('concertMapNR'),position[positionCount].imageX,position[positionCount].imageY);
                if(value < 10){
                    context.fillText(value,position[positionCount].textX+3,position[positionCount].textY);
                }
                else{
                    context.fillText(value,position[positionCount].textX,position[positionCount].textY);
                }
                positionCount++;
            }

            value = cluster.data.film.length;
            if(value){
                context.drawImage(ImageLoader.getImage('filmMapNR'),position[positionCount].imageX,position[positionCount].imageY);
                if(value < 10){
                    context.fillText(value,position[positionCount].textX+3,position[positionCount].textY);
                }
                else{
                    context.fillText(value,position[positionCount].textX,position[positionCount].textY);
                }
                positionCount++;
            }

            value = cluster.data.exhib.length;
            if(value){
                context.drawImage(ImageLoader.getImage('exhibMapNR'),position[positionCount].imageX,position[positionCount].imageY);
                if(value < 10){
                    context.fillText(value,position[positionCount].textX+3,position[positionCount].textY);
                }
                else{
                    context.fillText(value,position[positionCount].textX,position[positionCount].textY);
                }
                positionCount++;
            }



            value = cluster.data.other.length;
            if(value){
                context.drawImage(ImageLoader.getImage('otherMapNR'),position[positionCount].imageX,position[positionCount].imageY);
                if(value < 10){
                    context.fillText(value,position[positionCount].textX+3,position[positionCount].textY);
                }
                else{
                    context.fillText(value,position[positionCount].textX,position[positionCount].textY);
                }

                positionCount++;
            }



            var icon = new google.maps.MarkerImage(canvas.toDataURL(),new google.maps.Size(78, 42),new google.maps.Point(0,0),new google.maps.Point(canvas.width/2,canvas.height/2));

            var myLatlng = new google.maps.LatLng(cluster.point.lat,cluster.point.lng);

            cluster.marker = new google.maps.Marker({
                position: myLatlng,
                icon:icon,
                url : '/info?points=' + cluster.pointsString,
                zIndex : 1001
            });

            google.maps.event.addListener(cluster.marker, 'click', function() {
                $rootScope.$apply($location.url(cluster.marker.url));
            });
        }

        cluster.marker.setMap(map);
        currentMarkers.push(cluster.marker);


    };





    this.drawMarker = function(event){

        if(!event.marker){
            var canvas = document.createElement("canvas");
            canvas.width = 24;
            canvas.height = 24;

            var context = canvas.getContext("2d");

            context.drawImage(ImageLoader.getImage(event.type+'Map'),0,0);

            var icon = new google.maps.MarkerImage(canvas.toDataURL(),new google.maps.Size(24, 24),new google.maps.Point(0,0),new google.maps.Point(12,12));

            var myLatlng = new google.maps.LatLng(event.point.lat,event.point.lng);

            event.marker = new google.maps.Marker({
                position: myLatlng,
                icon:icon,
                title : event.title,
                url : '/info/?points=' + event.id,
                zIndex : 1001
            });

            google.maps.event.addListener(event.marker, 'click', function() {
                $rootScope.$apply($location.url(event.marker.url));
            });
        }



        event.marker.setMap(map);
        currentMarkers.push(event.marker);
    };

    this.showMap = function(){

        var that = this;

        this.getEatDrinkData();
        this.getBusData();

        var imageBoundaries = new google.maps.LatLngBounds (
            new google.maps.LatLng(47.3635184326772 ,8.52219235359625), // lower left coordinate
            new google.maps.LatLng(47.3825878958978 , 8.55067793132157) // upper right coordinate
        );

        var mapOptions = {
            center: new google.maps.LatLng(47.37345,8.53659),
            zoom: 15,
            draggable:false,
            streetViewControl: false,
            mapTypeControl:false
        };

        var baseMapOptions = {
            getTileUrl: function(coord, zoom) {
                return that.getTileUrl(coord, zoom);
            },
            tileSize: new google.maps.Size(256, 256),
            maxZoom: 18,
            minZoom: 15,
            name: "Event Map"
        };

        map = new google.maps.Map(document.getElementById("map"),mapOptions);
        baseMap = new google.maps.ImageMapType(baseMapOptions);

        map.mapTypes.set('EventMap', baseMap);
        map.setMapTypeId('EventMap');

        overlay = new google.maps.OverlayView();
        overlay.draw = function() {};
        overlay.setMap(map);

        google.maps.event.addListenerOnce(map,'idle',function() {
            that.mapIsLoaded();
        });


        var dragBoundaries = {zoom16:new google.maps.LatLngBounds (
            new google.maps.LatLng(47.3678 ,8.5292), // lower left coordinate
            new google.maps.LatLng(47.3783 ,8.5435) // upper right coordinate
        ),
            zoom17: new google.maps.LatLngBounds (
                new google.maps.LatLng(47.3656 ,8.526), // lower left coordinate
                new google.maps.LatLng(47.3805 ,8.5470) // upper right coordinate
            ),
            zoom18: new google.maps.LatLngBounds (
                new google.maps.LatLng(47.3646 ,8.5240), // lower left coordinate
                new google.maps.LatLng(47.3815 ,8.5485) // upper right coordinate
         )}

        google.maps.event.addListener(map,'zoom_changed',function(e) {
            if(map.getZoom()>15){
                map.setOptions({draggable:true});
                that.checkBounds(dragBoundaries);
            }
            else{
                map.setOptions({draggable:false});
                map.setCenter(new google.maps.LatLng(47.37345,8.53659));
            }

        });

        google.maps.event.addListener(map,'center_changed',function() {
            that.checkBounds(dragBoundaries);
        });
    }

    this.checkBounds = function(dragBoundaries){
        var imageBoundaries;
        var zoom = map.getZoom();
        if(zoom==16){
            imageBoundaries = dragBoundaries.zoom16;
        }
        else if(zoom==17){
            imageBoundaries = dragBoundaries.zoom17;
        }
        else if(zoom==18){
            imageBoundaries = dragBoundaries.zoom18;
        }
        else{
            return;
        }
        if(!imageBoundaries.contains(map.getCenter())) {
            var C = map.getCenter();
            var X = C.lng();
            var Y = C.lat();

            var AmaxX = imageBoundaries.getNorthEast().lng();
            var AmaxY = imageBoundaries.getNorthEast().lat();
            var AminX = imageBoundaries.getSouthWest().lng();
            var AminY = imageBoundaries.getSouthWest().lat();

            if (X < AminX) {X = AminX;}
            if (X > AmaxX) {X = AmaxX;}
            if (Y < AminY) {Y = AminY;}
            if (Y > AmaxY) {Y = AmaxY;}

            map.setCenter(new google.maps.LatLng(Y,X));
        }
    }

    this.getTileUrl = function(coord, zoom) {
        var y = coord.y;
        var x = coord.x;

        // tile range in one direction range is dependent on zoom level
        // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
        var tileRange = 1 << zoom;

        // don't repeat across y-axis (vertically)
        if (y < 0 || y >= tileRange) {
            return null;
        }

        // repeat across x-axis
        if (x < 0 || x >= tileRange) {
            x = (x % tileRange + tileRange) % tileRange;
        }

        var bound = Math.pow(2, zoom);
        return "img/tiles" +
            "/" + zoom + "/" + x + "/" +
            (bound - y - 1) + ".jpg";
    }


});