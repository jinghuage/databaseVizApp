'use strict';

// Register `databaseViz` component, along with its associated controller and template
angular.
  module('databaseViz').
  component('databaseViz', {
    templateUrl: 'database-viz/database-viz.template.html',
    controller: ['$http', '$routeParams',
      function databaseVizController($http, $routeParams) {
        var self = this;

        self.exportType = ["Image", "Data", "CrossTab", "PDF"];
        self.management = ["clear selection", "refresh", "revert", "download workbook"];
        self.selectMarker = ["none"];

        $http.get('database/' + $routeParams.databaseId + '.json').then(function(response) {
          self.vizbook = response.data;
          self.initViz();
          //self.changeView(self.vizbook.dashboard[0].name);
        });

        self.initViz = function(){
          console.log("initViz");

          var vizDiv = document.getElementById('viz');//$('#viz');
          console.log(vizDiv, vizDiv.offsetWidth, vizDiv.offsetHeight);

          var dashboard = self.vizbook.dashboard[0];
          var vizURL = self.vizbook.url + dashboard.name;
          var isPublic = true;
          var options = {
            height: "800px",
            width: "1200px",
            hideTabs: true,
            hideToolbar: true,
            onFirstInteractive: function() {
              self.workbook = self.viz.getWorkbook();
              self.activeSheet = self.workbook.getActiveSheet();
              //listenToMarksSelection();
              $("#desc").text(dashboard.desc);
              //var navname = $("#"+dashboard.name);
              //console.log(navname[0]);
              $("#"+dashboard.name).addClass('active');
            }
          }
          //comment out for layout debug only
          //self.viz = new tableauSoftware.Viz(vizDiv, vizURL, options);
        };


        self.changeView = function(dashboard){
          console.log(dashboard.name);
          self.workbook.activateSheetAsync(dashboard.name);
          $("#desc").text(dashboard.desc);
          $(".active").removeClass('active');
      		$("#"+dashboard.name).addClass('active');
        };

      }
    ]
  });
