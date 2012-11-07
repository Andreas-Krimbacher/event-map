'use strict';

/* Provider */

archWalk.provider('Leaflet', function() {
    var Leaflet = L;

    this.$get = function() {
        return Leaflet;
    };
});

/* Service */

archWalk.factory('MediaWiki', ['$http',function($http) {
    var MWFactory = {};
    var APIUrl = 'http://n.ethz.ch/student/andrekri/api.php';

    var options={method:'GET',
                   url:APIUrl,
                    params:null};

    MWFactory.checkPageName = function(name,callback){

        options.params={action:'query',
                        prop:'info',
                        titles:name,
                        format:'json'};

        var callback = callback;

        $http(options).success(function(data, status, headers, config) {
            if(data.query.pages[-1]){
                    callback(true,options.params.titles);
            }
            else{
                alert('Site already exists. Please, check in the MediaWiki.');
                callback(false);
            }
        }).
        error(function(data, status, headers, config) {
                alert('MediaWiki connection failed: ' + status);
                callback(false);
        });
    }

    MWFactory.createPage = function(siteData,callback){

        var wikiText = '';

        wikiText += siteData.information;
        wikiText += '\n\n[[Category:'+siteData.mainCategory+']]\n\n';
        for(var x in siteData.otherCategories){
            wikiText += '[[Category:'+siteData.otherCategories[x]+']]\n\n'
        }
        wikiText += 'Title: [[Title::'+siteData.title+']]\n\n';
        wikiText += 'WKT: [[WKT::'+siteData.wkt+']]\n\n';
        wikiText += 'Language: [[Language::'+siteData.language+']]\n\n';
        wikiText += 'Location: [[Location::'+siteData.lat+','+siteData.lng+']]\n\n';
        wikiText += 'Address: [[Address::'+siteData.formatted_address+']]\n\n';
        wikiText += 'Street Number: [[StreetNumber::'+siteData.street_number+']]\n\n';
        wikiText += 'Street: [[Street::'+siteData.route+']]\n\n';
        wikiText += 'City: [[City::'+siteData.locality+']]\n\n';
        wikiText += 'Country: [[Country::'+siteData.country+']]\n\n';
        wikiText += 'Postal Code: [[PostalCode::'+siteData.postal_code+']]';


        options.params={action:'query',
            prop:'info',
            titles:siteData.pageName,
            intoken:'edit',
            format:'json'};

        options.wikiText = wikiText;

        options.callback = callback;


        $http(options).success(function(data, status, headers, config) {
            var a=1;

            if(data.query && data.query.pages[-1] && data.query.pages[-1].edittoken){

                options.params={action:'edit',
                    prop:'info',
                    title:options.params.titles,
                    text:options.wikiText,
                    token:data.query.pages[-1].edittoken,
                    format:'json'};

                options.method = 'POST';

                $http(options).success(function(data, status, headers, config) {
                    if(data.edit.result == 'Success'){
                        options.callback(true,data.edit.title);
                    }
                    else{
                        alert('Can not write to MediaWiki:' + data.edit.result);
                        options.callback(false);
                    }
                }).
                error(function(data, status, headers, config) {
                    alert('MediaWiki connection failed: ' + status);
                    options.callback(false);
                });
            }
            else{
                alert('Can not write to MediaWiki.');
                options.callback(false);
            }
        }).
        error(function(data, status, headers, config) {
            alert('MediaWiki connection failed: ' + status);
            options.callback(false);
        });
    }


    return MWFactory;
}]);
