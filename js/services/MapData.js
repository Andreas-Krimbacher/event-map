'use strict';

eventMap.service('MapData', function(Cluster) {
    var rawMapData = null;

    var mapData = {zoom15:[],zoom16:[],zoom17:[],zoom18:[]};

    this.getMapData = function() {
        return mapData;
    };


    this.clusterData = function() {
            Cluster.calculateDistance(rawMapData);

            mapData.zoom15 = Cluster.getRegionClusters(rawMapData);
        this.getPreClusters();
            mapData.zoom17 = rawMapData;
    };

    this.getPreClusters = function(){
        mapData.zoom16 = Cluster.getPreClusters(rawMapData);
    }

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
            rawMapData.push({point : {lat:_.random(4736700, 4738000)/100000,lng:_.random(852400, 854900)/100000},type:_.random(0, 3),region:_.random(0, 4),nearPoint : nearPoints, cluster : cluster});

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

        };


    };
});