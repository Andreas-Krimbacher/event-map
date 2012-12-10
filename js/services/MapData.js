'use strict';

//service to provide the mapdata

eventMap.service('MapData', function(Cluster,MapService, $http, $rootScope) {
    //all data
    var rawMapData = null;

    //current filter that is applied to the mapdata
    var currentFilter = null;

    //filtered data
    var mapData = {zoom15:[],zoom16:[],zoom17:[],zoom18:[]};

    //function to get the mapdata
    this.getMapData = function() {
        return mapData;
    };

    //function to get the map data for a specific id
    this.getPointData = function(id) {
        var result = [];
        for(var x in id){
            result.push(rawMapData[id[x]]);
        }
        return result;
    };

    //function to get the current filter
    this.getCurrentFilter = function() {
        return angular.copy(currentFilter);
    };

    //function to get the info view data for specific ids
    this.getRawMapDataInfoView = function(ids, opens){
        var rawMapDataInfo = {concert : {data: [],isOpen : false},exhib: {data: [],isOpen : false}, film: {data: [],isOpen : false}, other: {data: [],isOpen : false}};


        var k = rawMapData.length;
        while(k--){
            var i = ids.length;
            while(i--){
                if(rawMapData[k].id == ids[i]){
                    var data = {id : rawMapData[k].id,
                                title : rawMapData[k].title,
                                isOpen: false,
                                address : {street : rawMapData[k].address.street, city : rawMapData[k].address.city, place: rawMapData[k].address.place},
                                date : {startDate : rawMapData[k].startDate,endDate : rawMapData[k].endDate},
                                infoText:this.generateInfoView(rawMapData[k].info)};

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

        for(var x in opens){
            if(rawMapDataInfo[opens[x]])rawMapDataInfo[opens[x]].isOpen = true;
        }

        return rawMapDataInfo;
    }

    //function to get the info view data for a specific id
    this.getRawMapDataSingle = function(ids){
        var k = rawMapData.length;
        while(k--){
            if(rawMapData[k].id == ids[0]){
                return {id : rawMapData[k].id,
                    title : rawMapData[k].title,
                    type:rawMapData[k].type,
                    isOpen: true,
                    address : {street : rawMapData[k].address.street, city : rawMapData[k].address.city, place: rawMapData[k].address.place},
                    date : {startDate : rawMapData[k].startDate,endDate : rawMapData[k].endDate},
                    infoText:this.generateInfoView(rawMapData[k].info)};
            }
        }
    }

    //generate the text for the info view
    this.generateInfoView = function(info){
        var html = '';

        for(var x in info){
            if(info[x].type == 'summary'){
                if(info[x].text != ''){
                    html += info[x].text + '<br><br>';
                }

            }
            else{
                html += '<b>'+info[x].type+':</b><br>';
                html += info[x].text + '<br><br>';
            }
        }
        return html;
    }

    //get the cluster of a point with specific id
    this.getClusterOfPoint = function(id,zoom){
        return mapData['zoom'+zoom][rawMapData[id].cluster['preCluster'+zoom]];
    }

    //cluster the data
    this.clusterData = function() {

        var k = rawMapData.length;
        while(k--){
            rawMapData[k].cluster.preCluster15 = null;
            rawMapData[k].cluster.preCluster16 = null;
            rawMapData[k].cluster.preCluster17 = null;
            rawMapData[k].cluster.preCluster18 = null;
            rawMapData[k].marker = null;
        }


        var preCluster = Cluster.getPreClusters(rawMapData);
        mapData.zoom16 = preCluster.preCluster16;
        mapData.zoom17 = preCluster.preCluster17;
        mapData.zoom18 = preCluster.preCluster18;
        mapData.zoom15 = Cluster.getRegionClusters(rawMapData);

    };

    //filter the data
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

    //load the data from the json "infoAll.json" to rawmapdata
    this.loadInfoData = function() {
        var x;

        $http.get('data/infoAll.json').success(function(data) {

            var dataFromFile = data;

            rawMapData = [];
            var types = [];

            //image boundaries
            var imageBoundaries = new google.maps.LatLngBounds (
                new google.maps.LatLng(47.3635184326772 ,8.52219235359625), // lower left coordinate
                new google.maps.LatLng(47.3825878958978 , 8.55067793132157) // upper right coordinate
            );

            //polygons of the regions
            var langstrassePoly = new google.maps.Polygon({
                paths: [
                    new google.maps.LatLng(47.3812193972646,8.54006087880933),
                    new google.maps.LatLng(47.3748573179181,8.53316252919359),
                    new google.maps.LatLng(47.3716533469557,8.53119869020753),
                    new google.maps.LatLng(47.3716399765898,8.53119049498789),
                    new google.maps.LatLng(47.3716120455889,8.51951890406045),
                    new google.maps.LatLng(47.3847205843375,8.51949274663138),
                    new google.maps.LatLng(47.3847205843375,8.53707091610793),
                    new google.maps.LatLng(47.3812193972646,8.54006087880933)
                ]
            });
            var bahnhofstrassePoly = new google.maps.Polygon({
                paths: [
                    new google.maps.LatLng(47.3663130655671,8.54295495732909),
                    new google.maps.LatLng(47.3663886111224,8.5395716403621),
                    new google.maps.LatLng(47.3686652788497,8.5373755113603),
                    new google.maps.LatLng(47.3716533469557,8.53119869020753),
                    new google.maps.LatLng(47.3748573179181,8.53316252919359),
                    new google.maps.LatLng(47.3812193972646,8.54006087880933),
                    new google.maps.LatLng(47.380532715077,8.54064729538339),
                    new google.maps.LatLng(47.3780744629607,8.54257451062987),
                    new google.maps.LatLng(47.3761320592439,8.54315715709973),
                    new google.maps.LatLng(47.3731576148812,8.54235041583376),
                    new google.maps.LatLng(47.3709722019058,8.54252969167064),
                    new google.maps.LatLng(47.3690495055512,8.54267910844341),
                    new google.maps.LatLng(47.3686652788497,8.54270896750753),
                    new google.maps.LatLng(47.3663130655671,8.54295495732909)
                ]
            });
            var niederndorfuniPoly = new google.maps.Polygon({
                paths: [
                    new google.maps.LatLng(47.3739324594181,8.55431274158747),
                    new google.maps.LatLng(47.3690495055512,8.54267910844341),
                    new google.maps.LatLng(47.3709722019058,8.54252969167064),
                    new google.maps.LatLng(47.3731576148812,8.54235041583376),
                    new google.maps.LatLng(47.3761320592439,8.54315715709973),
                    new google.maps.LatLng(47.3780744629607,8.54257451062987),
                    new google.maps.LatLng(47.380532715077,8.54064729538339),
                    new google.maps.LatLng(47.3812193972646,8.54006087880934),
                    new google.maps.LatLng(47.3847205843375,8.53707091610793),
                    new google.maps.LatLng(47.3847205843375,8.55422744002716),
                    new google.maps.LatLng(47.3739324594181,8.55431274158747)
                ]
            });
            var suedPoly = new google.maps.Polygon({
                paths: [
                    new google.maps.LatLng(47.3716533469557,8.53119869020753),
                    new google.maps.LatLng(47.3686652788497,8.5373755113603),
                    new google.maps.LatLng(47.3663886111224,8.5395716403621),
                    new google.maps.LatLng(47.3663130655671,8.54295495732909),
                    new google.maps.LatLng(47.362114609395,8.54339402358738),
                    new google.maps.LatLng(47.3622600029865,8.5195375655906),
                    new google.maps.LatLng(47.3716120455889,8.51951890406045),
                    new google.maps.LatLng(47.3716399765898,8.53119049498789),
                    new google.maps.LatLng(47.3716533469557,8.53119869020753)
                ]
            });
            var bellevuePoly = new google.maps.Polygon({
                paths: [
                    new google.maps.LatLng(47.3690495055512,8.54267910844341),
                    new google.maps.LatLng(47.3739324594181,8.55431274158747),
                    new google.maps.LatLng(47.3620474923534,8.55440671586404),
                    new google.maps.LatLng(47.362114609395,8.54339402358738),
                    new google.maps.LatLng(47.3663130655671,8.54295495732909),
                    new google.maps.LatLng(47.3686652788497,8.54270896750753),
                    new google.maps.LatLng(47.3690495055512,8.54267910844341)
                ]
            });

            //generate rawmapdata
            var id = 0;

            var titles = [];

            for(var x in dataFromFile){

                // hack to prevent double entries
                if(_.indexOf(titles,dataFromFile[x].title) != -1){
                    continue;
                }
                titles.push(dataFromFile[x].title);


                if(!imageBoundaries.contains(new google.maps.LatLng(dataFromFile[x].point.lat,dataFromFile[x].point.lng))){
                    continue;
                }
                var cont = false;
                for(var k in rawMapData){
                    if(dataFromFile[x].title == rawMapData[k].title && (new Date(dataFromFile[x].startDate).getTime() == rawMapData[k].startDate.getTime()) && (new Date(dataFromFile[x].endDate).getTime() == rawMapData[k].endDate.getTime())) cont=true;
                }
                if(cont) continue;


                var endDate = dataFromFile[x].endDate ? new Date(dataFromFile[x].endDate) : new Date(dataFromFile[x].startDate);

                var nearPoints = {zoom15pre:[],
                    zoom15post:[],
                    zoom16pre:[],
                    zoom16post:[],
                    zoom17pre:[],
                    zoom17post:[],
                    zoom18pre: [],
                    zoom18post: []};
                var cluster = {preCluster15 : null,
                    preCluster16 : null,
                    preCluster17 : null,
                    preCluster18 : null};
                rawMapData.push({id : id,
                    point : {lat:dataFromFile[x].point.lat,lng:dataFromFile[x].point.lng},
                    address : dataFromFile[x].address,
                    address_components : dataFromFile[x].address_components,
                    formatted_address : dataFromFile[x].formatted_address,
                    type:'other',
                    region: null,
                    startDate : new Date(dataFromFile[x].startDate),
                    endDate : endDate,
                    nearPoint : nearPoints,
                    cluster : cluster,
                    showOnMap : true,
                    title: dataFromFile[x].title,
                    info : dataFromFile[x].info});



                //time fix (to get test data for today)
                var additionalDays = Math.round((new Date() - new Date(2012,10,19)) / 86400000);
                rawMapData[rawMapData.length-1].startDate.setTime(rawMapData[rawMapData.length-1].startDate.getTime()+additionalDays*86400000);
                rawMapData[rawMapData.length-1].endDate.setTime(rawMapData[rawMapData.length-1].endDate.getTime()+additionalDays*86400000);
                //

                if(types.indexOf(dataFromFile[x].type) == -1) types.push(dataFromFile[x].type);

                id++;

                //determine category
                switch (dataFromFile[x].type) {
                    case "Party"||"Tanz"||"Konzert"||"Unerhört - Ein Zürcher Jazzfestival"||"Lucerne Festival - Am Piano":
                        rawMapData[rawMapData.length-1].type = 'concert';
                        break;
                    case "Ausstellung"||"Mix"||"Vortrag"||"Messe"||"Diskussion"||"CulturEscapes":
                        rawMapData[rawMapData.length-1].type = 'exhib';
                        break;
                    case "Musical"||"Theater"||"Oper"||"Lesung"||"Film":
                        rawMapData[rawMapData.length-1].type = 'film';
                        break;
                    case  "Führung"||"Swiss Christmas"||"Sport"||"Freischwimmer"||"Markt"||"Comedy"||"Zirkus"||"Spektakuli":
                        rawMapData[rawMapData.length-1].type = 'other';
                        break;
                    default:
                        rawMapData[rawMapData.length-1].type = 'other';
                        break;
                }

                //determine region
                if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(rawMapData[rawMapData.length-1].point.lat,rawMapData[rawMapData.length-1].point.lng),langstrassePoly)){
                    rawMapData[rawMapData.length-1].region = "Langstrasse";
                }
                else if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(rawMapData[rawMapData.length-1].point.lat,rawMapData[rawMapData.length-1].point.lng),bahnhofstrassePoly)){
                    rawMapData[rawMapData.length-1].region = "Bahnhofstrasse";
                }
                else if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(rawMapData[rawMapData.length-1].point.lat,rawMapData[rawMapData.length-1].point.lng),niederndorfuniPoly)){
                    rawMapData[rawMapData.length-1].region = "NiederndorfUni";
                }
                else if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(rawMapData[rawMapData.length-1].point.lat,rawMapData[rawMapData.length-1].point.lng),suedPoly)){
                    rawMapData[rawMapData.length-1].region = "Sued";
                }
                else if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(rawMapData[rawMapData.length-1].point.lat,rawMapData[rawMapData.length-1].point.lng),bellevuePoly)){
                    rawMapData[rawMapData.length-1].region = "Bellevue";
                }
                else{
                    rawMapData[rawMapData.length-1].region = "Langstrasse";

                }

            }


            //calculate the pixel values for each data entry
            var pixel_temp;
            var map = MapService.getMap();
            var overlay = MapService.getOverlay();

            map.setZoom(15);
            for(x=0;x<rawMapData.length;x++){
                pixel_temp = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(rawMapData[x].point.lat,rawMapData[x].point.lng),15);
                rawMapData[x].pixel = {zoom15 : {x : pixel_temp.x, y : pixel_temp.y},zoom16 : {x : null, y : null},zoom17 : {x : null, y : null},zoom18 : {x : null, y : null}};
            }
            
            map.setZoom(16);
            for(x=0;x<rawMapData.length;x++){
                pixel_temp = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(rawMapData[x].point.lat,rawMapData[x].point.lng),16);
                rawMapData[x].pixel.zoom16.x = pixel_temp.x;
                rawMapData[x].pixel.zoom16.y = pixel_temp.y;
            }
            map.setZoom(17);
            for(x=0;x<rawMapData.length;x++){
                pixel_temp = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(rawMapData[x].point.lat,rawMapData[x].point.lng),17);
                rawMapData[x].pixel.zoom17.x = pixel_temp.x;
                rawMapData[x].pixel.zoom17.y = pixel_temp.y;
            }
            map.setZoom(18);
            for(x=0;x<rawMapData.length;x++){
                pixel_temp = overlay.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(rawMapData[x].point.lat,rawMapData[x].point.lng),18);
                rawMapData[x].pixel.zoom18.x = pixel_temp.x;
                rawMapData[x].pixel.zoom18.y = pixel_temp.y;
            }
            map.setZoom(15);

            //calculate the distance between each point and generate the nearpoint array
            Cluster.calculateDistance(rawMapData);

            $rootScope.$broadcast('infoIsLoaded');

        });
    };
});
