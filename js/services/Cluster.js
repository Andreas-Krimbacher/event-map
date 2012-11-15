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

    this.getPreClusters = function(rawMapData){
        var i, j, k,l ,dist,nearPoints,clusterData,clusterFound,oldCluster,newCluster;
        var clusterIndex = 0;
        var preCluster16 = [];
        i = rawMapData.length;
        while(i--){
            if(rawMapData[i].cluster.preCluster16 == null){
                nearPoints = rawMapData[i].nearPoint.zoom16pre;
                l = nearPoints.length-1;
                j = -1;
                clusterFound = false;

                while(j++ != l){
                    if(rawMapData[nearPoints[j]].cluster.preCluster16 != null){
                        if(!clusterFound){
                            preCluster16[rawMapData[nearPoints[j]].cluster.preCluster16].data.push(rawMapData[i]);
                            rawMapData[i].cluster.preCluster16 = rawMapData[nearPoints[j]].cluster.preCluster16;
                            clusterFound = true;
                        }
                        else{
                            oldCluster = rawMapData[nearPoints[j]].cluster.preCluster16;
                            newCluster = rawMapData[i].cluster.preCluster16;
                            if(newCluster != oldCluster){
                                clusterData = preCluster16[oldCluster].data;
                                k = clusterData.length;
                                while(k--){
                                    clusterData[k].cluster.preCluster16 = newCluster;
                                    preCluster16[newCluster].data.push(clusterData[k]);
                                }
                                preCluster16[oldCluster].data = [];
                                preCluster16[oldCluster].hasData = false;
                            }
                        }
                    }
                }
                if(!clusterFound){
                    preCluster16.push({id:clusterIndex,point : {lat: null,lng: null},data:[rawMapData[i]],hasData : true})
                    rawMapData[i].cluster.preCluster16 = clusterIndex;
                    clusterIndex++;
                }
            }
        }

        //--- use when only pre clustering is done
        var latSum,lngSum,pointCount;

        i = preCluster16.length;
        while(i--){
            if(preCluster16[i].hasData){
                latSum = lngSum = 0;
                var data = {concert : [],exhib: [], film: [], other: []};
                pointCount = preCluster16[i].data.length;
                j = pointCount;
                while(j--){
                    latSum += preCluster16[i].data[j].point.lat;
                    lngSum += preCluster16[i].data[j].point.lng;

                    data[preCluster16[i].data[j].type].push(preCluster16[i].data[j]);
                }
                preCluster16[i].point.lat = latSum/pointCount;
                preCluster16[i].point.lng = lngSum/pointCount;
                preCluster16[i].data = data;
                preCluster16[i].marker = null;
            }
        }
        //---

        return preCluster16;
    }

    this.calculateDistance = function(rawMapData){
        var i, j,dist;
        i = rawMapData.length;
        while(i--){
            j=i;
            while(j--){
                dist = Math.sqrt(Math.pow(rawMapData[i].point.lat-rawMapData[j].point.lat,2)+Math.pow(rawMapData[i].point.lng-rawMapData[j].point.lng,2));
                if(dist < 0.0008){
                    rawMapData[i].nearPoint.zoom16pre.push(j);
                    rawMapData[j].nearPoint.zoom16pre.push(i);
                }
            }

        }


    }

});

