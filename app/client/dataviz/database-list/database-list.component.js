'use strict';

// Register `databaseList` component, along with its associated controller and template
angular.
  module('databaseList').
  component('databaseList', {
    templateUrl: 'database-list/database-list.template.html',
    controller: ['$http', function databaseListController($http) {
      var self = this;
      self.orderProp = 'age';

      $http.get('database/databases.json').then(function(response) {
        self.databases = response.data;
      });
    }]
  });
