angular.
  module('core.restful').
  factory('Restful', ['$resource',
    function($resource) {
      return $resource(':itemDir/:itemId.json', {}, {
        query: {
          method: 'GET',
          params: {itemId: 'items'},
          isArray: true
        }
      });
    }
  ]);
