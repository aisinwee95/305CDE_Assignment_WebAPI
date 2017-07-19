var app = angular.module('myApp', ['ngRoute']);

app.config( ['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/search', {
		  templateUrl: 'templates/search.html',
      controller: 'searchController'
		})
    .when('/detail/:id', {
      templateUrl: 'templates/detail.html',
      controller: 'detailController'
    })
    .when('/favourites', {
		  templateUrl: 'templates/favourites.html',
      controller: 'favouritesController'
		})
    .when('/places', {
		  templateUrl: 'templates/places.html',
      controller: 'placesController'
		})
		.otherwise({
		  redirectTo: 'search'
		})
	}])

app.controller('detailController', function($scope, $routeParams, $http) {
  $scope.message = 'This is the detail screen'
  $scope.id = $routeParams.id

  //var url = 'https://www.googleapis.com/books/v1/volumes/' + $scope.id
  //$http.get(url).success(function(rspPlace) {
   // console.log("found place" + $scope.id)
    //$scope.place = {}
    
   // $scope.place.title = rspPlace.volumeInfo.title
   // $scope.place.summary = rspPlace.volumeInfo.description
   // $scope.place.stars = rspPlace.volumeInfo.averageRating
   // $scope.place.cover = rspPlace.volumeInfo.imageLinks.large 
  //})

  $scope.addToFavourites = function(id, title) {
    console.log('adding: '+id+' to favourites.')
    localStorage.setItem(id, title)
  }
})

app.controller('favouritesController', function($scope) {
  console.log('fav controller')
  var init = function() {
    console.log('getting places')
    var items = new Array();		//alt: = []; for blank array obj
    //for (var key in localStorage) {	//for-in will include key, getItem, setItem, removeItem, clear & length
    for(var i = 0; i < localStorage.length; i++) {
    	var key = localStorage.key(i);	//native methods are ignored
    	var obj = {};
    	//items.push( {key: localStorage.getItem(key)} )  //TRY1 {key: ...} forced to hardcode key
    	//items.push(obj[key] = localStorage.getItem(key))	//TRY2 {dym-key: ...} hard to code in <ng-repeat>
    	items.push({id: key, title:localStorage.getItem(key)})  //TRY3 OK
      //alt: items[key] = localStorage[key]
    }
    console.log(items)
    $scope.place = items
  }
  init()

  $scope.delete = function(id) {
    console.log('deleting id '+id)
    localStorage.removeItem(id)
  }
  
  $scope.deleteAll = function(){ 
    localStorage.clear(); 
    init();
  }
  
})

app.service('Map', function($q) {
    
    this.init = function() {
        var options = {
            center: new google.maps.LatLng(40.7127837, -74.00594130000002),
            zoom: 13,
            disableDefaultUI: true    
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    }
    
    this.search = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results[0]);
            }
            else d.reject(status);
        });
        return d.promise;
    }
    
    this.addMarker = function(res) {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    }
    
});

app.controller('searchController', function($scope, Map) {

    $scope.place = {};
  
    $scope.search = function() {
        $scope.apiError = false;
        Map.search($scope.searchPlace)
        .then(
            function(res) { // success
                Map.addMarker(res);
                $scope.place.id= res.id;
                $scope.place.name = res.name;
                $scope.place.lat = res.geometry.location.lat();
                $scope.place.lng = res.geometry.location.lng();
                $scope.place.photos = res.photos[0].getUrl({ 'maxWidth': 450, 'maxHeight': 450 });
                $scope.place.types = res.types;
                $scope.place.rating = res.rating;
                
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    }
    
    $scope.send = function() {
        alert('ID' + ' : ' + $scope.place.id + '\n' + $scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng + '\n' + 'Types' + ' : ' + $scope.place.types + '\n' + 'Rating' + ' : ' + $scope.place.rating);    
    }
    
    Map.init();
});