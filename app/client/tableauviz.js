//module: viz.tableauViz -- load tableau viz to vizdiv placeholder

//namespace: viz (window.viz)
var viz = viz || {};
console.log("name space viz is:", viz);

function jq( myid ) {
  return myid.replace(/[\])}[{(\s+]/g, '');
}

console.log(jq("SUM(Number of Records)"));

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
                console.log(type);
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
            console.log(s.getName());
            s.getFiltersAsync().then(onSuccess, onError);
        });

    };

    TableauWorkSheet.prototype.setFilters = function(newFilters) {

        this.forEach(function(s) {
            for(var filterName in newFilters) {
                    var filterValue = newFilters[filterName];

                    if (filterValue) {
                        console.log(typeof filterValue);
                        console.log($.isArray(filterValue));

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

    //these vars have access functions, such as getter/setters
    var vizBook, vizDiv;
    var width, height;
    var markerSelectionDiv;
    var filters = {};

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

                    //$('#' + filterAccessDiv + ' li').remove();
                    _worksheets = new TableauWorkSheet(wss);
                    filters = {};
                    _worksheets.getFilters(filters);
                    //console.log(filters);

                    //$("#" + filterAccessDiv).append(html.join(""));
                }
            }
            //comment out for layout debug only
        _viz = new tableauSoftware.Viz(vizDivDom, vizURL, options);
        myapp.listenToMarksSelection();
    };

    myapp.filters = function(newfilters) {
      if (!arguments.length) return filters;
      //filters = _;
      _worksheets.setFilters(newfilters);

      for(var f in newfilters){
        filters[f] = newfilters[f];
      }

      return myapp;
    }

    myapp.listenToMarksSelection = function() {
        _viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);


        function onMarksSelection(marksEvent) {
            return marksEvent.getMarksAsync().then(reportSelectedMarks);
        }

        function reportSelectedMarks(marks) {

            console.log("reportSelectedMarks");
            var html = [];

            if (marks.length == 0) {
                html = ["<li>None</li>"];
            }

            for (var markIndex = 0; markIndex < marks.length; markIndex++) {
                var pairs = marks[markIndex].getPairs();
                html.push('<li class="info-header"><b>Mark ' + markIndex + ':</b></li>');
                for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                    var pair = pairs[pairIndex];
                    //html.push("<li>" + pair.fieldName);
                    html.push("<li>" + pair.fieldName + ":" + pair.formattedValue + "</li>");
                }
                //console.log(html);
            }

            $('#' + markerSelectionDiv + ' li').remove();
            $("#" + markerSelectionDiv).append(html.join(""));

        }

        function removeMarksSelectionEventListener() {
            _viz.removeEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
        }
    };


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

    myapp.getSummeryData = function() {
        options = {
            maxRows: 0, // Max rows to return. Use 0 to return all rows
            ignoreAliases: false,
            ignoreSelection: true
        };
        current_sheet.getSummaryDataAsync(options).then(function(t) {
            console.log(t);
            console.log("Here's the row count");
            console.log(t.getTotalRowCount());
            console.log("Here them columns");
            columns = t.getColumns();
            console.log(columns);
            var field_position;
            // Find the position the desired field is in
            for (j = 0; j < columns.length; j++) {
                console.log(columns[j]);
                name = columns[j].getFieldName();
                if (name == field_name_with_values) {
                    index = columns[j].getIndex();
                    field_position = index;
                    console.log(name + " is in position " + index);
                }
            }
            data = t.getData();
            console.log("Here that data");
            console.log(data);

            var value_array = new Array();
            // Data is returned as Rows, then with with a second array of the columns
            for (var i = 0; i < data.length; i++) {
                if (value_type == 'value') {
                    value_array.push(data[i][field_position].value);
                }
                if (value_type == 'formatted value') {
                    value_array.push(data[i][field_position].formattedValue);
                }
            }

            console.log(value_array);
        });
    }


    myapp.getUnderlyingData = function() {
        options = {
            maxRows: 0,
            ignoreAliases: false,
            ignoreSelection: true,
            includeAllColumns: false
        };
        sheet = _viz.getWorkbook().getActiveSheet();
        sheet.getUnderlyingDataAsync(options).then(function(t) {
            //var data = t.getData();
            //the data returned from the tableau API
            var columns = table.getColumns();
            var data = table.getData();

            //convert to field:values convention
            function reduceToObjects(cols, data) {
                var fieldNameMap = $.map(cols, function(col) {
                    return col.$impl.$fieldName;
                });
                var dataToReturn = $.map(data, function(d) {
                    return d.reduce(function(memo, value, idx) {
                        memo[fieldNameMap[idx]] = value.formattedValue;
                        return memo;
                    }, {});
                });
                return dataToReturn;
            }
            var niceData = reduceToObjects(columns, data);
        });
    }

    myapp.changeView = function(view) {
        console.log(view.name);
        _workbook.activateSheetAsync(view.name).then(function(sheet) {
          var wss = myapp.getWorksheets(sheet);
          _worksheets = new TableauWorkSheet(wss);

          filters = {};
          _worksheets.getFilters(filters);

        });
    };



    myapp.selectSingleValue = function(markName, markValue) {
        _workbook.getActiveSheet().selectMarksAsync(
            markName, //"Region",
            markValue, //"Asia",
            tableau.SelectionUpdateType.REPLACE);
    }

    myapp.clearSelection = function() {
        _workbook.getActiveSheet().clearSelectedMarksAsync();
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

    myapp.filterAccessDiv = function(_) {
        if (!arguments.length) return filterAccessDiv;
        filterAccessDiv = _;
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
