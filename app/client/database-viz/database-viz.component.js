'use strict';

// Register `databaseViz` component, along with its associated controller and template
angular.
  module('databaseViz').
  component('databaseViz', {
    templateUrl: 'database-viz/database-viz.template.html',
    controller: ['$http', '$routeParams', '$timeout',
      function databaseVizController($http, $routeParams, $timeout) {

        console.log("databaseViz controller");

        var self = this;

        self.exportType = ["Image", "Data", "CrossTab", "PDF"];
        self.management = ["Revert", "Refresh", "Download", "Share"];


        $http.get('database/' + $routeParams.databaseId + '.json').then(function(response) {
          self.vizBook = response.data;
          console.log("get vizbook:", self.vizBook);

          self.myViz = self.initViz(self.vizBook.vizapi);
          self.myViz.vizBook(self.vizBook)
            .width(800)
            .height(1200)
            .vizDiv('viz')
            .markerSelectionDiv('infobox')
            .filterAccessDiv('quickfilter');

          console.log("create property myViz", self.vizBook.dbname);

          self.myViz();

          var start = self.vizBook.startwith;
          self.selectNav = self.vizBook.views[start];

          $timeout(function () {
            self.setNavStyle(self.selectNav);
            //self.applyNav(self.selectNav);
          }, 10);
        });

        self.applyNav = function(view){
          self.myViz.changeView(view);

          self.selectNav = view;
          self.setNavStyle(self.selectNav);
        }

        self.applyManagment = function(mg){
          self.myViz.management(mg);
        }

        self.applyUtil = function(exp){
          self.myViz.export(exp);
        }

        self.$onChanges = function (changes) {
          console.log("onchanges:", changes);
        }

        self.initViz = function(vizType){
          console.log("initViz", vizType);

          if(vizType == 'tableau') return viz.tableauViz();
          else if(vizType == 'embed') return viz.embedViz();
        }

        self.setNavStyle = function(view){
          console.log("setNavStyle");

          $(".viz-desc").text(view.desc);
          $(".active").removeClass('active');
          $("." + view.name).addClass('active');

        }

        self.setFilters = function(){
          var filters = self.myViz.filters();
          //console.log(filters);
          var newFilters = {};

          for(var filter in filters){
            //console.log(filter, jq(filter));
            var filterVal = filters[filter];
            var newval = JSON.parse($('#'+jq(filter)).val());

            if(! _.isEqual(filterVal, newval)){
              console.log('filter value changed from ', filterVal, 'to ', newval);
              newFilters[filter] = newval;
            }
          }

          //set the new filters
          console.log(newFilters);
          self.myViz.filters(newFilters);
        }

      }
    ]
  });
