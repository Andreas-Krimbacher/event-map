'use strict';

/* Filters */

archWalk.filter('pageNameTitle', function() {
  return function(input) {
      if(input){
          return input.replace(/ /g,"_");
      }
      else{
          return 'xxx';
      }
  };
});

archWalk.filter('pageNameLocation', function() {
    return function(input) {
        var postalCode = null;
        var country = null;
        if( input.address_components){
            for(var x in input.address_components){
                if(input.address_components[x].types[0] == 'country'){
                    country = input.address_components[x].short_name;
                }
                if(input.address_components[x].types[0] == 'postal_code'){
                    postalCode = input.address_components[x].short_name;
                }
            }

            if(country){
                if(postalCode){
                    return country.replace(/ /g,"_")+'_'+postalCode.replace(/ /g,"_");
                }
                else{
                    return country.replace(/ /g,"_")
                }
            }
            else{
                return 'NML'
            }
        }
        else{
            return 'xxx';
        }

    };
});

archWalk.filter('pageNameLanguage', function() {
    return function(input) {
        if(input == 'English') return 'EN';
        if(input == 'German') return 'DE';
    };
});

