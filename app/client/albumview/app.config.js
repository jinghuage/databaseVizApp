'use strict';

angular.
  module('albumViewApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/album', {
          template: '<album-list></album-list>'
        }).
        when('/album/:albumId', {
          template: '<album-view></album-view>'
        }).
        otherwise('/album');
    }
  ]);
