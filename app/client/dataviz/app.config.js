'use strict';

angular.
  module('databaseVizApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/database', {
          template: '<database-list></database-list>'
        }).
        when('/database/:databaseId', {
          template: '<database-viz></database-viz>'
        }).
        otherwise('/database');
    }
  ]);
