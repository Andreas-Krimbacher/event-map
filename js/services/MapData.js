'use strict';

eventMap.service('MapData', function(Cluster,MapService) {
    var rawMapData = null;

    var currentFilter = null;

    var mapData = {zoom15:[],zoom16:[],zoom17:[],zoom18:[]};

    this.getMapData = function() {
        return mapData;
    };

    this.getPointData = function(id) {
        return rawMapData[id];
    };

    this.getCurrentFilter = function() {
        return currentFilter;
    };

    this.getRawMapDataInfoView = function(ids, opens){
        var rawMapDataInfo = {concert : {data: [],isOpen : false},exhib: {data: [],isOpen : false}, film: {data: [],isOpen : false}, other: {data: [],isOpen : false}};

        var infoText = '20h Wettbewerbsfilme<br>20.45h Kurzfilmprogramm<br>21.30h	Preisverleihung<br><br>Filme wider die Alpenbunker-Mentalität/-Realität<br><br>Das Fabrikvideo hat zusammen mit dem Konzeptbüro der Roten Fabrik zu einem Wettbewerb aufgerufen, der an diesem Abend präsentiert wird. Den Siegerbeitrag kürt das Publikum per Abstimmung!';

        var k = rawMapData.length;
        while(k--){
            var i = ids.length;
            while(i--){
                if(rawMapData[k].id == ids[i]){
                    var data = {id : rawMapData[k].id,
                                title : rawMapData[k].title,
                                isOpen: false,
                                address : {street : 'Strehlgasse 29', city : '8001 Zurich', country: 'Switzerland'},
                                startDate : rawMapData[k].startDate,
                                endDate : rawMapData[k].endDate,
                                infoText:infoText};

                    var l = opens.length;
                    while(l--){
                        if(opens[l] == ids[i]){
                            data.isOpen = true;
                            rawMapDataInfo[rawMapData[k].type].isOpen = true;
                        }
                    }

                    rawMapDataInfo[rawMapData[k].type].data.push(data);
                    ids.splice(i,1);
                    break;
                }
            }
            if(!ids.length) break;
        }

        var l = opens.length;
        while(l--){
            if(opens[l] == 'concert') rawMapDataInfo.concert.isOpen = true;
            if(opens[l] == 'exhib') rawMapDataInfo.exhib.isOpen = true;
            if(opens[l] == 'film') rawMapDataInfo.film.isOpen = true;
            if(opens[l] == 'other') rawMapDataInfo.other.isOpen = true;
        }

        return rawMapDataInfo;
    }

    this.getRawMapDataSingle = function(ids){

        var infoText = '20h Wettbewerbsfilme<br>20.45h Kurzfilmprogramm<br>21.30h	Preisverleihung<br><br>Filme wider die Alpenbunker-Mentalität/-Realität<br><br>Das Fabrikvideo hat zusammen mit dem Konzeptbüro der Roten Fabrik zu einem Wettbewerb aufgerufen, der an diesem Abend präsentiert wird. Den Siegerbeitrag kürt das Publikum per Abstimmung!';

        var k = rawMapData.length;
        while(k--){
            if(rawMapData[k].id == ids[0]){
                return {id : rawMapData[k].id,
                    title : rawMapData[k].title,
                    type:rawMapData[k].type,
                    isOpen: true,
                    address : {street : 'Strehlgasse 29', city : '8001 Zurich', country: 'Switzerland'},
                    startDate : rawMapData[k].startDate,
                    endDate : rawMapData[k].endDate,
                    infoText:infoText};
            }
        }
    }


    this.clusterData = function() {

        var k = rawMapData.length;
        while(k--){
            rawMapData[k].cluster.preCluster16 = null;
            rawMapData[k].cluster.preCluster17 = null;
            rawMapData[k].cluster.preCluster18 = null;
        }

        mapData.zoom15 = Cluster.getRegionClusters(rawMapData);
        var preCluster = Cluster.getPreClusters(rawMapData);
        mapData.zoom16 = preCluster.preCluster16;
        mapData.zoom17 = preCluster.preCluster17;
        mapData.zoom18 = preCluster.preCluster18;

    };

    this.filterData = function(filter) {

        var timeChanged = false;
        if(!currentFilter || filter.start != currentFilter.start || filter.end != filter.currentFilter) timeChanged = true;

        var k = rawMapData.length;
        while(k--){
            if(rawMapData[k].type == 'concert') rawMapData[k].showOnMap = filter.concert;
            if(rawMapData[k].type == 'exhib') rawMapData[k].showOnMap = filter.exhib;
            if(rawMapData[k].type == 'film') rawMapData[k].showOnMap = filter.film;
            if(rawMapData[k].type == 'other') rawMapData[k].showOnMap = filter.other;
            if(timeChanged){
                if(filter.start > rawMapData[k].endDate || filter.end < rawMapData[k].startDate) rawMapData[k].showOnMap = false;
            }
        }


        currentFilter = filter;
    };

    this.generateTestData = function(count) {
        var x;
        rawMapData = [];



        for(x=0;x<count;x++){
            var nearPoints = {zoom16pre:[],
                            zoom16post:[],
                            zoom17pre:[],
                            zoom17post:[],
                            zoom18pre: [],
                            zoom18post: []};
            var cluster = {preCluster16 : null,
                            preCluster17 : null,
                            preCluster18 : null};
            rawMapData.push({id : x,
                            point : {lat:_.random(4736700, 4738000)/100000,lng:_.random(852400, 854900)/100000},
                            type:_.random(0, 3),
                            region:_.random(0, 4),
                            startDate : new Date(),
                            endDate : null,
                            nearPoint : nearPoints,
                            cluster : cluster,
                            showOnMap : true,
                            title: 'XYZ Exhibition'});


            switch (rawMapData[rawMapData.length-1].type) {
                case 0:
                    rawMapData[rawMapData.length-1].type = 'concert';
                    break;
                case 1:
                    rawMapData[rawMapData.length-1].type = 'exhib';
                    break;
                case 2:
                    rawMapData[rawMapData.length-1].type = 'film';
                    break;
                case 3:
                    rawMapData[rawMapData.length-1].type = 'other';
                    break;
                default:
                    rawMapData[rawMapData.length-1].type = 'concert';
                    break;
            }

            switch (rawMapData[rawMapData.length-1].region) {
                case 0:
                    rawMapData[rawMapData.length-1].region = 'Langstrasse';
                    break;
                case 1:
                    rawMapData[rawMapData.length-1].region = 'Bahnhofstrasse';
                    break;
                case 2:
                    rawMapData[rawMapData.length-1].region = 'NiederndorfUni';
                    break;
                case 3:
                    rawMapData[rawMapData.length-1].region = 'Sued';
                    break;
                case 4:
                    rawMapData[rawMapData.length-1].region = 'Bellevue';
                    break;
                default:
                    rawMapData[rawMapData.length-1].type = 'Langstrasse';
                    break;
            }

            rawMapData[rawMapData.length-1].startDate.setMonth(rawMapData[rawMapData.length-1].startDate.getMonth()+ _.random(-1,6));
            rawMapData[rawMapData.length-1].startDate.setDate(rawMapData[rawMapData.length-1].startDate.getDate()+ _.random(0,31));
            rawMapData[rawMapData.length-1].startDate.setHours(rawMapData[rawMapData.length-1].startDate.getHours()+ _.random(0,24));
            rawMapData[rawMapData.length-1].startDate.setMinutes(0);
            rawMapData[rawMapData.length-1].startDate.setSeconds(0);
            rawMapData[rawMapData.length-1].startDate.setMilliseconds(0);

            rawMapData[rawMapData.length-1].endDate = new Date(rawMapData[rawMapData.length-1].startDate.getTime()+_.random(1,20)*1800000)

        };

        var pixel_temp;
        var map = MapService.getMap();
        var overlay = MapService.getOverlay();

        map.setZoom(16);
        for(x=0;x<count;x++){
            pixel_temp = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(rawMapData[x].point.lat,rawMapData[x].point.lng),16);
            rawMapData[x].pixel = {zoom16 : {x : pixel_temp.x, y : pixel_temp.y},zoom17 : {x : null, y : null},zoom18 : {x : null, y : null}};
        }
        map.setZoom(17);
        for(x=0;x<count;x++){
            pixel_temp = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(rawMapData[x].point.lat,rawMapData[x].point.lng),17);
            rawMapData[x].pixel.zoom17.x = pixel_temp.x;
            rawMapData[x].pixel.zoom17.y = pixel_temp.y;
        }
        map.setZoom(18);
        for(x=0;x<count;x++){
            pixel_temp = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(rawMapData[x].point.lat,rawMapData[x].point.lng),18);
            rawMapData[x].pixel.zoom18.x = pixel_temp.x;
            rawMapData[x].pixel.zoom18.y = pixel_temp.y;
        }
        map.setZoom(15);

        Cluster.calculateDistance(rawMapData);
    };
});