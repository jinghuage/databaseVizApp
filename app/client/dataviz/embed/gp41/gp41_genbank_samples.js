/*/////////////////////////////////////////////
Simplify the JSAPI example code to leave only two tabs
/////////////////////////////////////////////*/


////////////////////////////////////////////////////////////////////////////////
// Global Variables

var viz, workbook, activeSheet;

$(document).ready(function() {
	
	/*/////////////////////////////////////////////
	Embedding a viz using the JavaScript 8.0 API.
	/////////////////////////////////////////////*/
	var vizDiv = document.getElementById('viz');
	//var vizURL = "http://public.tableau.com/views/JSAPIExamples/LineChart";
        var vizURL = "https://public.tableau.com/views/sample_pivot_seq/DistRegion";
	isPublic = true;
	//var vizURL = "http://localhost/views/JSAPIExamples/LineChart";
	var options = {
		height: '1100px',
		width: '800px',
		hideTabs: true,
		hideToolbar: true,
		onFirstInteractive: function() {
                    workbook = viz.getWorkbook();
                    activeSheet = workbook.getActiveSheet();

                    //console.log('workbook:', workbook);
                    //console.log('activeSheetName:', activeSheet.getName());
                    //vizResize();
                    //utilitiesUI();
		    //utilitiesSetup();
                    $('#menu').append('<li class="nav-header">No Mark Selected</li>');
                    listenToMarksSelection();
		}
	}
	viz = new tableauSoftware.Viz(vizDiv, vizURL, options);
	
	
	
	/*//////////////////////////////////////////////////////
	Navigation Menu. This is the jQuery to build out the skeleton of the webpage.
	//////////////////////////////////////////////////////*/

	var distNav = $('<li class="active navButton"><a>Records Distribution in Regions</a></li>').appendTo('#navList');
	distNav.click( function() {
		$(".active").removeClass('active');
		$(this).addClass('active');
		$('#menu li, #entryBox').remove(); //Clear the menu of all the buttons and replace them w/ the relevant buttons
		
		//changeViewsSetup();
                workbook.activateSheetAsync("DistRegion");
                $('#menu').append('<li class="nav-header">No Mark Selected</li>');
	});


	var selectionNav = $('<li class="navButton"><a>Select Records and View Sequence</a></li>').appendTo('#navList');
	selectionNav.click( function() {
		$(".active").removeClass('active');
		$(this).addClass('active');
		$('#menu li, #entryBox').remove(); //Clear the menu of all the buttons and replace them w/ the relevant buttons
		
		//changeViewsSetup();

                //console.log('switch to stdEV:', workbook, workbook.getPublishedSheetsInfo());
                workbook.activateSheetAsync("selectSeqView");
                //workbook.activateSheetAsync("stdEV");
                $('#menu').append('<li class="nav-header">No Mark Selected</li>');
	});	



	var utilityNav = $('<li class="navButton"><a>Utilities</a></li>').appendTo('#navList');
	utilityNav.click( function() {
		$(".active").removeClass('active');
		$(this).addClass('active');
		$('#menu li, #entryBox').remove();
		utilitiesUI();
	});

});



function vizResize() {
    //var width = document.getElementById("resizeWidth").value;
    //var height = document.getElementById("resizeHeight").value;
    //var sheet = viz.getWorkbook().getActiveSheet();
    
    var width = 800; //$("#viz").width();
    var height = 1200; //$("#viz").height();
    activeSheet.changeSizeAsync(
        {"behavior": "EXACTLY", "maxSize": { "height": height, "width": width }})
        .then(viz.setFrameSize(parseInt(width, 10), parseInt(height, 10)));
}

// var utilitiesSetup = function() {
// 	workbook = viz.getWorkbook();
// 	if(workbook.getActiveSheet().getName() === 'Dashboard 1') {
// 		viz.getWorkbook().activateSheetAsync('LineChart').then(utilitiesUI);
// 	} else {
// 		utilitiesUI();
// 	}
// }

////////////////////////////////////////////////////////////////////////////////
// Events

function listenToMarksSelection() {
  viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
}

function onMarksSelection(marksEvent) {
  return marksEvent.getMarksAsync().then(reportSelectedMarks);
}

function reportSelectedMarks(marks) {
  var html = [];
  if(marks.length==0) html.push('<li class="nav-header">No Mark Selected</li>'); //'<li id="data" class="well well-small">'];

  for (var markIndex = 0; markIndex < marks.length; markIndex++) {
    var pairs = marks[markIndex].getPairs();
    //html.push("<b>Mark " + markIndex + ":</b><ul>");
    html.push('<li class="nav-header"><b>Mark ' + markIndex + ':</b></li>');
    for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
      var pair = pairs[pairIndex];
      html.push("<li><b>fieldName:</b> " + pair.fieldName);
      html.push("<br/><b>formattedValue:</b> " + pair.formattedValue + "</li>");
    }
    //html.push("</ul>");
  }

  $('#menu li').remove();
  $('#menu').append(html.join(""));

  //var track = $("#track");
    //$("#data").remove();
    //$('#menu').append('<li id =  "data" class="well well-small">Sum of '+ fieldName + ': ' + sum + '</li>');
  //track.html(html.join(""));
  //dialog.dialog("open");
}

function removeMarksSelectionEventListener() {
  viz.removeEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
}




/*/////////////////////////////////////////////////////////////////
Utilites JS function
/////////////////////////////////////////////////////////////////*/

var exportImg = function() {
	viz.showExportImageDialog();
}
var exportData = function() {
	viz.showExportDataDialog();
}
var exportXtab = function() {
	viz.showExportCrossTabDialog();
}
var exportPdf = function() {
	viz.showExportPDFDialog();
}
var revert = function() {
	viz.revertAllAsync();
}
var refresh = function() {
	viz.refreshDataAsync();
}
var download = function() {
	viz.showDownloadWorkbookDialog();
}
var share = function() {
	viz.showShareDialog();
}

/*///////////////////////////////////////////////////////
Utilites UI 
/////////////////////////////////////////////////////////*/

var utilitiesUI = function() {

	$('#menu').append('<li class="nav-header">Export:</li>');
	var exportImgButton = $('<li><a>Image</a></li>').appendTo('#menu');
	exportImgButton.click( function () {
		exportImg();
		//$("#explText").text(displayText["exportImg"][0]); 
		//$("#JSText").text(displayText["exportImg"][1]);
	});
	var exportDataButton = $('<li><a>Data</a></li>').appendTo('#menu');
	exportDataButton.click( function () {
		exportData();
		//$("#explText").text(displayText["exportData"][0]); 
		//$("#JSText").text(displayText["exportData"][1]); 
	});
	var exportXtabButton = $('<li><a>CrossTab</a></li>').appendTo('#menu');
	exportXtabButton.click( function () {
		exportXtab();
		//$("#explText").text(displayText["exportXtab"][0]); 
		//$("#JSText").text(displayText["exportXtab"][1]); 
	});
	var exportPdfButton = $('<li><a>PDF</a></li>').appendTo('#menu');
	exportPdfButton.click( function () {
		exportPdf();
		//$("#explText").text(displayText["exportPdf"][0]); 
		//$("#JSText").text(displayText["exportPdf"][1]); 
	});
	
	// $('#menu').append('<li class="nav-header">Misc Utilities</li>');
	// var revertButton = $('<li><a>Revert</a></li>').appendTo('#menu');
	// revertButton.click( function () {
	// 	revert();
	// 	//$("#explText").text(displayText["revert"][0]); 
	// 	//$("#JSText").text(displayText["revert"][1]); 
	// });
	// var refreshButton = $('<li><a>Refresh</a></li>').appendTo('#menu');
	// refreshButton.click( function () {
	// 	refresh();
	// 	//$("#explText").text(displayText["refresh"][0]); 
	// 	//$("#JSText").text(displayText["refresh"][1]); 
	// });
	// var downloadButton = $('<li><a>Download Workbook</a></li>').appendTo('#menu');
	// downloadButton.click( function () {
	// 	download();
	// 	//$("#explText").text(displayText["download"][0]); 
	// 	//$("#JSText").text(displayText["download"][1]); 
	// });
	// var shareButton = $('<li><a>Show Share Dialog</a></li>').appendTo('#menu');
	// shareButton.click( function () {
	// 	share();
	// 	//$("#explText").text(displayText["share"][0]); 
	// 	//$("#JSText").text(displayText["share"][1]); 
	// });
}

	

