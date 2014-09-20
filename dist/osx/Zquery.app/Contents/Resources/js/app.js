//Create a database
var db = Ti.Database.openFile(Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'zipcodes.db'));

var app = angular.module('zquery', ['ngChecklist', 'ngTable', 'ui.bootstrap', 'ngAnimate']);

app.animation('.slide', ['$rootScope', function($rootScope) {
  return { 
    removeClass: function(el, className, done) {
      el.hide().slideDown(200, done);
    },
    addClass: function(el, className, done) {
      setTimeout(function() {
        el.slideUp(200, done);
      }, 1000);
    }
  };
}]);

app.controller('ZqueryController', ['$scope', '$filter', 'queryService', 'ngTableParams', function($scope, $filter, queryService, ngTableParams) {
  $scope.searchResults = [
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
    { listPrice: 1 },
  ];

  // Setup search parameters, homeType's selected by default
  $scope.searchParams = {
    city: 'Oakland',
    state: 'CA',
    collate: true,
    homeType: ['house', 'apartment,duplex', 'condo', 'townhouse_type']
  };
  // Only allow search by city/state OR by zip, disable other fields
  $scope.$watchGroup(['searchParams.city','searchParams.state','searchParams.zip'], function(values) {
    $scope.disableZip = (values[0] || values[1]);
    $scope.disableCityState = (!!values[2]);
  });


  // Setup progress bar
  $scope.queryTotal = $scope.queryComplete = 1;
  $scope.showProgress = false;

  $scope.$watchGroup(['queryTotal', 'queryComplete'], function(values) {
    $scope.showProgress = (values[0] != values[1]);
  });


  $scope.tableParams = new ngTableParams({
    page: 1,            // show first page
    count: 50,          // count per page
    sorting: {
        listPrice: 'desc'     // initial sorting
    }
  }, {
    counts: [],
    total: $scope.searchResults.length,
    getData: function($defer, params) {
      if(params.sorting() && $scope.order != params.orderBy()[0]) {
        console.log($scope.order, params.orderBy())
        $scope.searchResults = $filter('orderBy')($scope.searchResults, params.orderBy())
        $scope.order = params.orderBy()[0];
        params.page(1);
      }

      document.body.scrollTop = document.documentElement.scrollTop = 0;

      params.total($scope.searchResults.length);
      $defer.resolve($scope.searchResults.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  

  $scope.submit = function() {
    var searchParams = $scope.searchParams,
        params = [], locations = [];

    if (searchParams.zip == '' && searchParams.state == '' && searchParams.city == '') {
      alert('You must enter a State and City/County, or Zip');
      return;
    }

    if(searchParams.homeType && searchParams.homeType.length > 0) {
      params.push(searchParams.homeType.join(','));
    } else {
      alert('You need to select at least one Home Type');
      return;
    }

    if (searchParams.baths && searchParams.baths.length > 0) {
      console.log('test')
      params.push(searchParams.baths);
    }

    if (searchParams.minSqFt || searchParams.maxSqFt) {
      params.push(searchParams.minSqFt + '-' + searchParams.maxSqFt + '_size');
    }

    if (searchParams.minLotSize || searchParams.maxLotSize) {
      params.push(searchParams.minLotSize + '-' + searchParams.maxLotSize + '_lot');
    }

    if (searchParams.minYear || searchParams.maxYear) {
      params.push(searchParams.minYear + '-' + searchParams.maxYear + '_built');
    }

    if (searchParams.daysOnZillow && searchParams.daysOnZillow.length > 0) {
      params.push(searchParams.daysOnZillow);
    }

    if (searchParams.keywords && searchParams.keywords.length > 0) {
      params.push(searchParams.keywords + '_akk');
    }

    if(searchParams.showOnly && searchParams.showOnly.length > 0) {
      params.push(searchParams.showOnly.join('/'));
    }

    if (searchParams.collate && !searchParams.zip) {
      var searchParams = $scope.searchParams,
          city = searchParams.city.replace(/\s/g, '').toUpperCase(),
          state = searchParams.state;

      zips = db.execute('SELECT zip FROM zips WHERE state="' + state + '" AND (UPPER(primary_city)="' + city + '" OR UPPER(acceptable_cities) LIKE "%' + city + '%" OR UPPER(county)="' + city + '")');

      while(zips.isValidRow()) {
        locations.push(zips.field(0));
        zips.next();
      }
    } else {
      if(searchParams.zip) {
        if(searchParams.zip.length != 5) {
          alert('Zipcode must be 5 characters.');
          return;
        }

        locations.push(searchParams.zip);
      }

      if(searchParams.state && searchParams.city) {
        locations.push(searchParams.city.replace(/\s/g, '') + '-' + searchParams.state.replace(/\s/g, ''));
      } else if (searchParams.state) {
        locations.push(searchParams.state);
      } else if (searchParams.city) {
        alert('You need to enter a city AND a state.');
        return;
      }
    } 

    
    $scope.queryComplete = 0;
    $scope.queryTotal = locations.length;
    $scope.searchResults.length = 0; 

    search(locations, params, 1);
  }

  function search(locations, params, page) {
    queryService.sendQuery(locations[0], params, page).then(function(webdata) {
      scrape(webdata)
      $scope.order = null;
      $scope.tableParams.reload();

      if(webdata.search('Next page') != -1) {
        search(locations, params, page+1);
      } else {
        locations.shift();
        $scope.queryComplete++;

        setTimeout(function() {
          if(locations.length > 0) search(locations, params, 1);
        }, (Math.random() * 3000 + 3000))
      }
    });
  }

  function scrape(webdata){
    var items;

    if(items = webdata.match(/<article.*?property-listing-large.*?>.*?<\/article>/g)) {
      $.each(items, function(index, item) {
        if(item.search('price-large') != -1) {
          var listPrice = item.match(/<dt class="price-large">[\s\S]*<\/dt>/)[0].match(/\$[0-9.,K]+(\/mo)?/)[0];
        } else {
          var listPrice = -1;
        }

        if(item.search('zestimate') != -1) {
          var zestimate = item.match(/<div class="zestimate">[\s\S]*<\/div>/)[0].match(/\$[0-9.,K]+(\/mo)?/)[0];
        } else {
          var zestimate = -1;
        }

        if(item.search('property-address') != -1) {
          var address = item.match(/<dt class="property-address".*?>.+?<\/dt>/)[0].replace('<span itemprop="postalCode" class="hide">', ' ').replace(/<.*?>/g, '');
        } else if (item.search('building-name-address') != -1) {
          var address = item.match(/<dt class="building-name-address".*?>.+?<\/dt>/)[0].replace('<span itemprop="postalCode" class="hide">', ' ').replace(/<.*?>/g, '');
        } else {
          var address = "N/A";
        }

        if (listPrice != -1) {
          var listPrice = +listPrice.replace(/[$,.\/mo]/g, '');
        }

        if (zestimate != -1) {
          var zestimate = (zestimate.indexOf('K') != -1) ? zestimate.replace(/[$,K]/g, '') * 1000 : zestimate.replace(/[$,.]/g, '');
          var ratio = zestimate / (+listPrice);
        } else {
          var ratio = -1;
        }

        $scope.searchResults.push({
          listPrice: listPrice,
          zestimate: zestimate,
          ratio: ratio,
          address: address
        });
      });
    }
  }
}]);

app.service('queryService', function($http, $q) {
  return ({
    sendQuery: sendQuery
  });

  function sendQuery(location, params, page) {
    console.log('http://www.zillow.com/homes/for_rent/' + location + '/' + params.join('/') + '/' + page + '_p')
    var request = $http({
      method: 'get',
      url: 'http://www.zillow.com/homes/for_rent/' + location + '/' + params.join('/') + '/' + page + '_p'
    });

    return(request.then(handleSuccess, handleError));
  }

  function handleError(response) {
 
    if (! angular.isObject( response.data ) || ! response.data.message) {
        return ($q.reject("An unknown error occurred."));
    }

    return ($q.reject(response.data.message));

  }

  function handleSuccess(response) {
 
    return (response.data);

  }
});