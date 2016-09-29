//module: viz.tableauViz -- load tableau viz to vizdiv placeholder

//namespace: viz (window.viz)
var viz = viz || {};
console.log("name space viz is:", viz);

viz.tableauViz = function() {

    //these vars have access functions, such as getter/setters
    var vizBook, vizDiv;
    var width, height;
    var markerSelectionDiv;

    //private to this module
    var _viz, _workbook, _activeSheet;

    var myapp = function() {

        console.log("init tableauViz");

        //var vizDiv = document.getElementById('viz');//$('#viz');
        var vizDivDom = document.getElementById(vizDiv);
        console.log(vizDivDom, vizDivDom.offsetWidth, vizDivDom.offsetHeight);
        var s = vizBook.startwith;
        var dashboard = vizBook.dashboard[s];
        var vizURL = vizBook.url + dashboard.name;
        var isPublic = true;
        var options = {
                height: width,
                width: height,
                hideTabs: true,
                hideToolbar: true,
                onFirstInteractive: function() {
                    _workbook = _viz.getWorkbook();
                    _activeSheet = _workbook.getActiveSheet();
                    //listenToMarksSelection();
                }
            }
            //comment out for layout debug only
        _viz = new tableauSoftware.Viz(vizDivDom, vizURL, options);
        listenToMarksSelection();


        function listenToMarksSelection() {
            _viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
        }

        function onMarksSelection(marksEvent) {
            return marksEvent.getMarksAsync().then(reportSelectedMarks);
        }

        function reportSelectedMarks(marks) {

          console.log("reportSelectedMarks");
          var html=[];

            if(marks.length==0){
              html=["<li>None</li>"];
            }

            for (var markIndex = 0; markIndex < marks.length; markIndex++) {
                var pairs = marks[markIndex].getPairs();
                html.push('<li class="info-header"><b>Marker ' + markIndex + ':</b></li>');
                for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                    var pair = pairs[pairIndex];
                    //html.push("<li>" + pair.fieldName);
                    html.push("<li>" + pair.formattedValue + "</li>");
                }
                //console.log(html);
            }

            $('#'+markerSelectionDiv+' li').remove();
            $("#"+markerSelectionDiv).append(html.join(""));

        }

        function removeMarksSelectionEventListener() {
            viz.removeEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
        }
    };



    /*/////////////////////////////////////////////////////////////////
    Utilites JS function
    /////////////////////////////////////////////////////////////////*/

    myapp.export = function(exp) {
      if(exp=="Image"){
        _viz.showExportImageDialog();
      }
      else if (exp == "Data") {
        _viz.showExportDataDialog();
      }
      else if (exp=="CrossTab") {
        _viz.showExportCrossTabDialog();
      }
      else if (exp=="PDF") {
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


    myapp.changeView = function(dashboard) {
        console.log(dashboard.name);
        _workbook.activateSheetAsync(dashboard.name);
    };

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
