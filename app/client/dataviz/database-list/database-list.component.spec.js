'use strict';

describe('databaseList', function() {

  // Load the module that contains the `databaseList` component before each test
  beforeEach(module('databaseList'));

  // Test the controller
  describe('databaseListController', function() {
    var $httpBackend, ctrl;

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service and assign it to a variable with the same name
    // as the service while avoiding a name conflict.
    beforeEach(inject(function($componentController, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('database/databases.json')
                  .respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);

      ctrl = $componentController('databaseList');
    }));

    it('should create a `databases` property with 2 databases fetched with `$http`', function() {
      expect(ctrl.databases).toBeUndefined();

      $httpBackend.flush();
      expect(ctrl.databases).toEqual([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    });

    it('should set a default value for the `orderProp` property', function() {
      expect(ctrl.orderProp).toBe('age');
    });

  });

});
