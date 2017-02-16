angular.module('services').factory('FakeDataService', ['$q', '$http', function($q, $http){
  var data = null;
  return {
    getData: function(){
      if(!data){
        return $http.get('data/devfest-2015.json').then(result => result.data);
      }
      return $q.resolve(data);
    }
  }
}])
