(function(){
  'use strict';
  var app = angular.module('Express.services',[]);
    app.service('Cotizacion', function ($http) {
      var self = this;
      self.all = function(){
        return $http.get("http://192.168.0.114:8000/api/v1/mueble/?format=json").then(function(data){
          console.log(data.data);
        });
      }
    });


})();
