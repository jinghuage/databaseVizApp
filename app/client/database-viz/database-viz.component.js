'use strict';

// Register `databaseViz` component, along with its associated controller and template
angular.
  module('databaseViz').
  component('databaseViz', {
    templateUrl: 'database-viz/database-viz.template.html',
    controller: ['$http', '$routeParams', '$timeout',
      function databaseVizController($http, $routeParams, $timeout) {

        //console.log("databaseViz controller");

        var self = this;

        self.exportType = ["Image", "Data", "CrossTab", "PDF"];
        self.management = ["Revert", "Refresh", "Download", "Share"];
        //self.filters = [{'name':'filterName1', 'value':'filterVal1'}, {'name':'filterName2','value':'filterVal2'}];
        self.filters=[];
        self.selections = [];


        $http.get('database/' + $routeParams.databaseId + '.json').then(function(response) {
          self.vizBook = response.data;
          //console.log("get vizbook:", self.vizBook);

          self.myViz = self.initViz(self.vizBook.vizapi);
          self.myViz.vizBook(self.vizBook)
            .width(800)
            .height(1200)
            .vizDiv('viz')
            .markerSelectionDiv('infobox');
            //.filterAccessDiv('quickfilter');

          //console.log("create property myViz", self.vizBook.dbname);

          self.myViz();

          var start = self.vizBook.startwith;
          self.selectNav = self.vizBook.views[start];
          //self.filters = self.selectNav.filters;

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

        // self.$onChanges = function (changes) {
        //   console.log("onchanges:", changes);
        // }
        self.change = function(){

        }

        self.initViz = function(vizType){
          //console.log("initViz", vizType);

          if(vizType == 'tableau') return viz.tableauViz();
          else if(vizType == 'embed') return viz.embedViz();
        }

        self.setNavStyle = function(view){
          //console.log("setNavStyle");

          self.filters = self.selectNav.filters;
          self.selections = self.selectNav.selections;

          $(".viz-desc").text(view.desc);
          $(".active").removeClass('active');
          $("." + view.name).addClass('active');

        }


        //communcate self.filters to self.myViz.filters()
        //self.filters is array
        //self.myViz.filters() should return an dict object.

        self.getFilters = function(){
          var filters = self.myViz.filters();
          console.log("get filter from viz: ", filters);

          for(var i=0; i<self.filters.length; i++){
            var filter = self.filters[i];
            var filterName = filter.name;
            var filterVal = filter.value;
            var newval = filters[filterName];

            if(! _.isEqual(filterVal, newval)){
              filter.value = newval;
            }
            filter.id = jq(filterName);
            filter.text = JSON.stringify(filter.value);
          }
        }

        self.setFilters = function(){
          var newFilters = {};

          for(var i=0; i<self.filters.length; i++){
            var filter = self.filters[i];
            var filterName = filter.name;
            var filterVal = filter.value;

            var newtext = $('#'+filter.id).val();
            //console.log(newtext);
            var newval = JSON.parse(newtext);
            //console.log(filterVal, newval);

            if(! _.isEqual(filterVal, newval)){
              console.log('filter value changed from ', filterVal, 'to ', newval);
              filter.value = newval;
              newFilters[filterName] = newval;
            }
          }


          console.log('newFilters:', newFilters);

          if(! _.isEqual(newFilters, {})){
            //set the new filters
            self.myViz.filters(newFilters);
          }
        };

        self.getSelections = function() {
            var selections = self.myViz.marks();
            console.log("get selections from viz: ", selections);

            for (var i = 0; i < self.selections.length; i++) {
                var selection = self.selections[i];
                var selectionName = selection.name;
                var selectionVal = selection.value;

                $.each(selections, function(i, sel) {
                    var newval = sel[selectionName];

                    if (selectionVal.indexOf(newval) == -1) {
                        selectionVal.push(newval);
                    }
                });
                selection.value = selectionVal;
                selection.id = 'sel-' + jq(selectionName);
                selection.text = JSON.stringify(selection.value);
            }

        };


        self.setSelections = function(){
          var newSelections = {};

          for(var i=0; i<self.selections.length; i++){
            var selection = self.selections[i];
            var selName = selection.name;
            var selVal = selection.value;

            var newtext = $('#'+selection.id).val();
            //console.log(newtext);
            var newval = JSON.parse(newtext);
            //console.log(filterVal, newval);

            //if(! _.isEqual(selVal, newval)){
              //console.log('filter value changed from ', selVal, 'to ', newval);
              selection.value = newval;
              newSelections[selName] = newval;
            //}
          }

          console.log('newSelections:', newSelections);

          if(! _.isEqual(newSelections, {})){
            self.myViz.marks(newSelections);
          }

          //self.myViz.selectMarks({"Region":"1"});
        };

      }
    ]
  });
