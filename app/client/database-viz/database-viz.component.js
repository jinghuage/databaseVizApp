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
            .markerSelectionDiv('infobox');

          console.log("create property myViz", self.vizBook.dbname);

          self.myViz();

          var start = self.vizBook.startwith;
          self.selectNav = self.vizBook.dashboard[start];

          $timeout(function () {
            self.setNavStyle(self.selectNav);
          }, 10);
        });

        self.applyNav = function(dashboard){
          self.myViz.changeView(dashboard);
          self.selectNav = dashboard;
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
          else if(vizType == 'd3') return viz.d3Viz();
          else if(vizType == 'python') return viz.pythonViz();

        }

        self.setNavStyle = function(dashboard){
          console.log("setNavStyle");

          $(".viz-desc").text(dashboard.desc);
          $(".active").removeClass('active');
          $("." + dashboard.name).addClass('active');
        }

      }
    ]
  });
