//module: viz.tableauViz -- load tableau viz to vizdiv placeholder

//namespace: viz (window.viz)
var viz = viz || {};
//console.log("name space viz is:", viz);

function jq( myid ) {
  return myid.replace(/[\])}[{(\s+]/g, '');
}

//console.log(jq("SUM(Number of Records)"));

viz.tableauViz = function() {

    function TableauWorkSheet(wss) {
        for (var i = 0; i < wss.length; i++) {
            this[i] = wss[i];
        }
        this.length = wss.length;
    }
    // ========= UTILS =========
    TableauWorkSheet.prototype.forEach = function(callback) {
        this.map(callback);
        return this;
    };
    TableauWorkSheet.prototype.map = function(callback) {
        var results = [];
        for (var i = 0; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }
        return results; //.length > 1 ? results : results[0];
    };
    TableauWorkSheet.prototype.mapOne = function(callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };

    TableauWorkSheet.prototype.getFilters = function(myfilters) {

        //var filtersVal = '';
        var onSuccess = function(filters) {
            console.log("This worksheet has " + filters.length + " filter(s) associated with it.");

            $.each(filters, function(i, filter) {
                var filterVal;

                //console.log(filter);
                var filterName = filter.getFieldName();
                //$("#" + filterAccessDiv).append('<li>'+filterName+'</li>');

                var type = filter.$type;
                //console.log(type);
                switch (type) {
                    case 'quantitative':
                        filterVal = {};
                        filterVal['min'] = filter.$min.formattedValue;
                        filterVal['max'] = filter.$max.formattedValue;
                        break;
                    case 'categorical':
                        filterVal = [];
                        $.each(filter.$appliedValues, function(i, applied) {
                            filterVal.push(applied.value);
                        });
                        break;
                    default:

                }
                //console.log(filterVal);

                //$("#" + filterAccessDiv).append('<input type="text" id="' + jq(filterName) + '" value=' + JSON.stringify(filterVal) + '>');

                myfilters[filterName] = filterVal;
            });
        };

        var onError = function(err) {
            alert("Whoops");
        };


        this.forEach(function(s) {
            //console.log('worksheet ' + s.getName());
            s.getFiltersAsync().then(onSuccess, onError);
        });

    };

    TableauWorkSheet.prototype.setFilters = function(newFilters) {

        this.forEach(function(s) {
            for(var filterName in newFilters) {
                    var filterValue = newFilters[filterName];

                    if (filterValue) {
                        //console.log(typeof filterValue);
                        //console.log($.isArray(filterValue));

                        var vtype = typeof filterValue;

                        if (vtype == 'number' || vtype == 'string' || $.isArray(filterValue)) {
                          console.log('applyFilterAsync', filterName, filterValue);
                            s.applyFilterAsync(
                                filterName, //"Region",
                                filterValue, //"The Americas",
                                tableau.FilterUpdateType.REPLACE);
                        } else if (vtype == 'object') {
                          console.log('applyRangeFilterAsync', filterName, filterValue);

                          if(filterName.includes('Date')){
                            var mindate = filterValue['min'];
                            var maxdate = filterValue['max'];
                            filterValue['min'] = new Date(mindate);
                            filterValue['max'] = new Date(maxdate);
                          }

                            s.applyRangeFilterAsync(
                                filterName, //"Date",
                                filterValue, //{min: minvalue, max: maxvalue},
                                tableau.FilterUpdateType.REPLACE);
                        }
                    }
                }
        });
    };

    TableauWorkSheet.prototype.getSelectedMarks = function(myMarks) {

      var onSuccess = function(marks) {
          console.log("This worksheet has " + marks.length + " mark(s)  selected.");

          //myMarks.concat(marks);

          $.each(marks, function(i, mark){
            var am = {};
            var pairs = mark.getPairs();
            for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                var pair = pairs[pairIndex];
                var fieldName = pair.fieldName;
                var fieldValue = pair.value;
                am[fieldName] = fieldValue;
            }
            myMarks.push(am);
          });
      }

      var onError = function(err) {
          alert("Whoops");
      };

      this.forEach(function(s) {
          //console.log('worksheet '+s.getName());
          s.getSelectedMarksAsync().then(onSuccess, onError);
      });
    }

    TableauWorkSheet.prototype.selectMarks = function(newSelections) {
        this.forEach(function(s) {
            s.clearSelectedMarksAsync().then(function(){
                s.selectMarksAsync(newSelections,
                    tableau.SelectionUpdateType.REPLACE);
          });
        });
    };

    TableauWorkSheet.prototype.clearMarks = function() {
        this.forEach(function(s) {
            s.clearSelectedMarksAsync();
        });
    };

    //these vars have access functions, such as getter/setters
    var vizBook, vizDiv;
    var width, height;
    var markerSelectionDiv;
    var filters = {};
    var selectedMarks = [];

    //private to this module
    var _viz, _workbook, _worksheets;

    var myapp = function() {

        console.log("init tableauViz");

        //var vizDiv = document.getElementById('viz');//$('#viz');
        var vizDivDom = document.getElementById(vizDiv);
        console.log(vizDivDom, vizDivDom.offsetWidth, vizDivDom.offsetHeight);
        var s = vizBook.startwith;
        var view = vizBook.views[s];
        var vizURL = vizBook.url + view.name;
        var isPublic = true;
        var options = {
                height: width,
                width: height,
                hideTabs: true,
                hideToolbar: true,
                onFirstInteractive: function() {
                    _workbook = _viz.getWorkbook();
                    var sheet = _workbook.getActiveSheet();
                    var wss = myapp.getWorksheets(sheet);
                    _worksheets = new TableauWorkSheet(wss);

                    filters = {};
                    _worksheets.getFilters(filters);

                    seletedMarks = [];
                    _worksheets.getSelectedMarks(seletedMarks);

                }
            }
            //comment out for layout debug only
        _viz = new tableauSoftware.Viz(vizDivDom, vizURL, options);
        myapp.listenToMarksSelection();
    };

    myapp.listenToMarksSelection = function() {
        _viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);


        function onMarksSelection(marksEvent) {
            return marksEvent.getMarksAsync().then(reportSelectedMarks);
        }

        function reportSelectedMarks(marks) {

            console.log("reportSelectedMarks", marks);
            var nrec = 0;

            $.each(marks, function(i, mark){
              var am = {};
              var pairs = mark.getPairs();

              for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                  var pair = pairs[pairIndex];
                  var fieldName = pair.fieldName;
                  var fieldValue = pair.value;

                  am[fieldName] = fieldValue;
                  if(fieldName.includes('Number of Records')){
                    nrec += fieldValue;
                  }

              }

              selectedMarks.push(am);

            });

            if (selectedMarks.length > 0) {
                //var markerSelectionDiv = 'infobox';
                var html = [];
                html.push('<li><b>' + marks.length + '</b> mark(s) selected</li>');

                html.push('<li> total number of records <b>' + nrec + '</b></li>');

                $('#' + markerSelectionDiv + ' li').remove();
                $("#" + markerSelectionDiv).append(html.join(""));
            }
        }
    };

    myapp.filters = function(newfilters) {
      if (!arguments.length){
        return filters;
      }
      _worksheets.setFilters(newfilters);

      // TOdo: shouldn't this be moved into OnSucess function of
      // _worksheet.setFilters()??
      for(var f in newfilters){
        filters[f] = newfilters[f];
      }

      return myapp;
    };

    myapp.marks = function(newSelections) {
      if (!arguments.length){
        return selectedMarks;
      }

      selectedMarks = [];
      _worksheets.selectMarks(newSelections);

      return myapp;
    }

    myapp.getWorksheets = function(sheet) {
        console.log("getWorksheets!");

        switch (sheet.getSheetType()) {
            case 'worksheet':
                console.log('I am a worksheet');
                return [sheet];
            case 'dashboard':
                console.log('I am a dashboard');
                worksheets = sheet.getWorksheets();
                return worksheets;
            case 'story':
                console.log('I am a story, not going to do anything');
                return [];
        }
    };


    myapp.changeView = function(view) {
        console.log(view.name);
        _workbook.activateSheetAsync(view.name).then(function(sheet) {
            var wss = myapp.getWorksheets(sheet);
            _worksheets = new TableauWorkSheet(wss);
        });
    };

    /*/////////////////////////////////////////////////////////////////
    Utilites JS function
    /////////////////////////////////////////////////////////////////*/

    myapp.export = function(exp) {
        if (exp == "Image") {
            _viz.showExportImageDialog();
        } else if (exp == "Data") {
            _viz.showExportDataDialog();
        } else if (exp == "CrossTab") {
            _viz.showExportCrossTabDialog();
        } else if (exp == "PDF") {
            _viz.showExportPDFDialog();
        }
        return myapp;
    };


    myapp.management = function(mg) {
        if (mg == "Revert") {
            _viz.revertAllAsync();
        } else if (mg == "Refresh") {
            _viz.refreshDataAsync();
        } else if (mg == "Download") {
            _viz.showDownloadWorkbookDialog();
        } else if (mg == "Share") {
            _viz.showShareDialog();
        }
        return myapp;
    }


    myapp.vizBook = function(_) {
        if (!arguments.length) return vizBook;
        vizBook = _;
        return myapp;
    };

    myapp.vizDiv = function(_) {
        if (!arguments.length) return vizDiv;
        vizDiv = _;
        return myapp;
    };

    myapp.markerSelectionDiv = function(_) {
        if (!arguments.length) return markerSelectionDiv;
        markerSelectionDiv = _;
        return myapp;
    }

    myapp.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return myapp;
    };

    myapp.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return myapp;
    };


    return myapp;
};
