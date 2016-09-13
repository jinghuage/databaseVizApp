'use strict';

// Register `databaseViz` component, along with its associated controller and template
angular.
  module('databaseViz').
  component('databaseViz', {
    templateUrl: 'database-viz/database-viz.template.html',
    controller: ['$http', '$routeParams',
      function databaseVizController($http, $routeParams) {

        console.log("databaseViz controller");

        var self = this;

        self.exportType = ["Image", "Data", "CrossTab", "PDF"];
        self.management = ["Revert", "Refresh", "Download", "Share"];


        $http.get('database/' + $routeParams.databaseId + '.json').then(function(response) {
          self.vizBook = response.data;
          console.log("get vizbook:", self.vizBook);

          self.myViz.vizBook(self.vizBook);
          self.myViz();

          var s = self.vizBook.startwith;
          self.selectNav = self.vizBook.dashboard[s];
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

        self.$postLink = function(){
          console.log("self.$postLink");

          self.myViz = viz.tableauViz()
            .width(800)
            .height(1200)
            .vizDiv(document.getElementById('viz'))
            .markerSelectionDiv('infobox');

          console.log("create property myViz");

        }

        self.setNavStyle = function(dashboard){
          console.log("setNavStyle");

          $(".viz-desc").text(dashboard.desc);
          $(".active").removeClass('active');
          $("." + dashboard.name).addClass('active');
        }

        self.checkme = function(){
          console.log("am checking");

          self.setNavStyle(self.selectNav);
          return 0;
        }
      }
    ]
  });
