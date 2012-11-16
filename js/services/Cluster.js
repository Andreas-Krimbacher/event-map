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
            if(rawMapData[x].showOnMap) clusters[rawMapData[x].region].data[rawMapData[x].type].push(rawMapData[x]);
        }

        return clusters;
    }

    this.getPreClusters = function(rawMapData){
        var i, j, k,l ,dist,nearPoints,clusterData,clusterFound,oldCluster,newCluster,clusterIndex;
        var preCluster16 = [];
        var preCluster17 = [];
        var preCluster18 = [];

        //--------------------------------------------------------------------------------------------------------------
        //------------------------------------------------preCluster16--------------------------------------------------
        
        clusterIndex = 0;
        i = rawMapData.length;
        while(i--){
            if(rawMapData[i].showOnMap){
                nearPoints = rawMapData[i].nearPoint.zoom16pre;
                l = nearPoints.length-1;
                j = -1;
                clusterFound = false;

                while(j++ != l){
                    if(rawMapData[nearPoints[j]].cluster.preCluster16 != null && rawMapData[nearPoints[j]].showOnMap){
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
                    preCluster16.push({id:clusterIndex,point : {lat: null,lng: null},data:[rawMapData[i]],hasData : true,hasSingleData : false})
                    rawMapData[i].cluster.preCluster16 = clusterIndex;
                    clusterIndex++;
                }
            }
        }

        //--------------------------------------------------------------------------------------------------------------
        //------------------------------------------------preCluster17--------------------------------------------------

        clusterIndex = 0;
        i = rawMapData.length;
        while(i--){
            if(rawMapData[i].showOnMap){
                nearPoints = rawMapData[i].nearPoint.zoom17pre;
                l = nearPoints.length-1;
                j = -1;
                clusterFound = false;

                while(j++ != l){
                    if(rawMapData[nearPoints[j]].cluster.preCluster17 != null && rawMapData[nearPoints[j]].showOnMap){
                        if(!clusterFound){
                            preCluster17[rawMapData[nearPoints[j]].cluster.preCluster17].data.push(rawMapData[i]);
                            rawMapData[i].cluster.preCluster17 = rawMapData[nearPoints[j]].cluster.preCluster17;
                            clusterFound = true;
                        }
                        else{
                            oldCluster = rawMapData[nearPoints[j]].cluster.preCluster17;
                            newCluster = rawMapData[i].cluster.preCluster17;
                            if(newCluster != oldCluster){
                                clusterData = preCluster17[oldCluster].data;
                                k = clusterData.length;
                                while(k--){
                                    clusterData[k].cluster.preCluster17 = newCluster;
                                    preCluster17[newCluster].data.push(clusterData[k]);
                                }
                                preCluster17[oldCluster].data = [];
                                preCluster17[oldCluster].hasData = false;
                            }
                        }
                    }
                }
                if(!clusterFound){
                    preCluster17.push({id:clusterIndex,point : {lat: null,lng: null},data:[rawMapData[i]],hasData : true,hasSingleData : false})
                    rawMapData[i].cluster.preCluster17 = clusterIndex;
                    clusterIndex++;
                }
            }
        }


        //--------------------------------------------------------------------------------------------------------------
        //------------------------------------------------preCluster18--------------------------------------------------

        clusterIndex = 0;
        i = rawMapData.length;
        while(i--){
            if(rawMapData[i].showOnMap){
                nearPoints = rawMapData[i].nearPoint.zoom18pre;
                l = nearPoints.length-1;
                j = -1;
                clusterFound = false;

                while(j++ != l){
                    if(rawMapData[nearPoints[j]].cluster.preCluster18 != null && rawMapData[nearPoints[j]].showOnMap){
                        if(!clusterFound){
                            preCluster18[rawMapData[nearPoints[j]].cluster.preCluster18].data.push(rawMapData[i]);
                            rawMapData[i].cluster.preCluster18 = rawMapData[nearPoints[j]].cluster.preCluster18;
                            clusterFound = true;
                        }
                        else{
                            oldCluster = rawMapData[nearPoints[j]].cluster.preCluster18;
                            newCluster = rawMapData[i].cluster.preCluster18;
                            if(newCluster != oldCluster){
                                clusterData = preCluster18[oldCluster].data;
                                k = clusterData.length;
                                while(k--){
                                    clusterData[k].cluster.preCluster18 = newCluster;
                                    preCluster18[newCluster].data.push(clusterData[k]);
                                }
                                preCluster18[oldCluster].data = [];
                                preCluster18[oldCluster].hasData = false;
                            }
                        }
                    }
                }
                if(!clusterFound){
                    preCluster18.push({id:clusterIndex,point : {lat: null,lng: null},data:[rawMapData[i]],hasData : true,hasSingleData : false})
                    rawMapData[i].cluster.preCluster18 = clusterIndex;
                    clusterIndex++;
                }
            }
        }


        //--------------------------------------------------------------------------------------------------------------
        //------------------------------------------------use when only pre clustering is done--------------------------

        var latSum,lngSum,pointCount;
        //---preCluster16
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
                if(pointCount == 1)  preCluster16[i].hasSingleData = true;
            }
        }
        //---preCluster17
        i = preCluster17.length;
        while(i--){
            if(preCluster17[i].hasData){
                latSum = lngSum = 0;
                var data = {concert : [],exhib: [], film: [], other: []};
                pointCount = preCluster17[i].data.length;
                j = pointCount;
                while(j--){
                    latSum += preCluster17[i].data[j].point.lat;
                    lngSum += preCluster17[i].data[j].point.lng;

                    data[preCluster17[i].data[j].type].push(preCluster17[i].data[j]);
                }
                preCluster17[i].point.lat = latSum/pointCount;
                preCluster17[i].point.lng = lngSum/pointCount;
                preCluster17[i].data = data;
                preCluster17[i].marker = null;
                if(pointCount == 1)  preCluster17[i].hasSingleData = true;
            }
        }
        //---preCluster18
        i = preCluster18.length;
        while(i--){
            if(preCluster18[i].hasData){
                latSum = lngSum = 0;
                var data = {concert : [],exhib: [], film: [], other: []};
                pointCount = preCluster18[i].data.length;
                j = pointCount;
                while(j--){
                    latSum += preCluster18[i].data[j].point.lat;
                    lngSum += preCluster18[i].data[j].point.lng;

                    data[preCluster18[i].data[j].type].push(preCluster18[i].data[j]);
                }
                preCluster18[i].point.lat = latSum/pointCount;
                preCluster18[i].point.lng = lngSum/pointCount;
                preCluster18[i].data = data;
                preCluster18[i].marker = null;
                if(pointCount == 1)  preCluster18[i].hasSingleData = true;
            }
        }
        //---

        return {preCluster16 : preCluster16, preCluster17 : preCluster17, preCluster18 : preCluster18};
    }

    this.calculateDistance = function(rawMapData){
        var i, j,dist;

        var preClusterDist = 40;
        var postClusterDist = 30;

        i = rawMapData.length;
        while(i--){
            j=i;
            while(j--){
                dist = Math.sqrt(Math.pow(rawMapData[i].pixel.zoom16.x-rawMapData[j].pixel.zoom16.x,2)+Math.pow(rawMapData[i].pixel.zoom16.y-rawMapData[j].pixel.zoom16.y,2));
                if(dist < preClusterDist){
                    rawMapData[i].nearPoint.zoom16pre.push(j);
                    rawMapData[j].nearPoint.zoom16pre.push(i);
                    if(dist < postClusterDist){
                        rawMapData[i].nearPoint.zoom16post.push(j);
                        rawMapData[j].nearPoint.zoom16post.push(i);
                    }
                }
                dist = Math.sqrt(Math.pow(rawMapData[i].pixel.zoom17.x-rawMapData[j].pixel.zoom17.x,2)+Math.pow(rawMapData[i].pixel.zoom17.y-rawMapData[j].pixel.zoom17.y,2));
                if(dist < preClusterDist){
                    rawMapData[i].nearPoint.zoom17pre.push(j);
                    rawMapData[j].nearPoint.zoom17pre.push(i);
                    if(dist < postClusterDist){
                        rawMapData[i].nearPoint.zoom17post.push(j);
                        rawMapData[j].nearPoint.zoom17post.push(i);
                    }
                }
                dist = Math.sqrt(Math.pow(rawMapData[i].pixel.zoom18.x-rawMapData[j].pixel.zoom18.x,2)+Math.pow(rawMapData[i].pixel.zoom18.y-rawMapData[j].pixel.zoom18.y,2));
                if(dist < preClusterDist){
                    rawMapData[i].nearPoint.zoom18pre.push(j);
                    rawMapData[j].nearPoint.zoom18pre.push(i);
                    if(dist < postClusterDist){
                        rawMapData[i].nearPoint.zoom18post.push(j);
                        rawMapData[j].nearPoint.zoom18post.push(i);
                    }
                }
            }

        }


    }

});

