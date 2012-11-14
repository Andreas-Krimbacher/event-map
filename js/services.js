'use strict';

/* Service */

eventMap.service('Cluster', function() {

    this.getRegionClusters = function(rawMapData){
        var x;

        var clusters = {};

        clusters['Langstrasse'] = {
            point : {lat: 47.376,lng: 8.529},
            data : {concert : [],exhib: [], film: [], other: []},
            marker : null
        }
        clusters['Bahnhofstrasse'] = {
            point : {lat: 47.373,lng: 8.538},
            data : {concert : [],exhib: [], film: [], other: []},
            marker : null
        }
        clusters['NiederndorfUni'] = {
            point : {lat: 47.375,lng: 8.547},
            data : {concert : [],exhib: [], film: [], other: []},
            marker : null
        }
        clusters['Sued'] = {
            point : {lat: 47.369,lng: 8.529},
            data : {concert : [],exhib: [], film: [], other: []},
            marker : null
        }
        clusters['Bellevue'] = {
            point : {lat: 47.369,lng: 8.546},
            data : {concert : [],exhib: [], film: [], other: []},
            marker : null
        }

        for(x in rawMapData){
            clusters[rawMapData[x].region].data[rawMapData[x].type].push(rawMapData[x]);
        }

        return clusters;
    }


    this.calculateDistance = function(rawMapData){
        var i, j,dist;
        var length = rawMapData.length;
        for(i=0;i<length;i++){
            for(j=i+1;j<length;j++){
                dist = Math.sqrt(Math.pow(rawMapData[i].point.lat-rawMapData[j].point.lat,2)+Math.pow(rawMapData[i].point.lng-rawMapData[j].point.lng,2));
//                if(dist < 0.001){
//                    rawMapData[i].nearPoint.push(j);
//                    rawMapData[j].nearPoint.push(i);
//                }
            }

        }


    }

});


