//module: viz.embedViz -- load embed viz to vizdiv placeholder

//namespace: viz (window.viz)
var viz = viz || {};
//console.log("name space viz is:", viz);

viz.embedViz = function() {

  var width, height;
  var files;
  var vizDiv, markerSelectionDiv;

  var filters = {};
  var selectedMarks = [];

  var myapp = function(){

    console.log("init embedViz");

    //var vizDiv = document.getElementById('viz');//$('#viz');
    var vizDivDom = document.getElementById(vizDiv);
    //console.log(vizDivDom, vizDivDom.offsetWidth, vizDivDom.offsetHeight);

    //todo: embed viz in vizDivDom
    var s = vizBook.startwith;
    var view = vizBook.views[s];
    var vizURL = vizBook.url + view.name + '.html';

    var iframe = '<iframe src="' + vizURL + '" width="' + width + '" height="'+ height + '"></iframe>';

    //console.log(iframe);
    $("#"+vizDiv).html(iframe);

  };

  myapp.filters = function(newfilters) {
    if (!arguments.length){
      filters = {'f1':['v1'], 'f2':['v2'], 'f3':['v3']};
      return filters;
    }
    myapp.setFilters(newfilters);
    return myapp;
  };

  myapp.marks = function(newSelections) {
    if (!arguments.length){
      selectedMarks = [{'s1':'m1v1', 's2':'m1v2', 's3':'m1v3'},
      {'s1':'m2v1', 's2':'m2v2', 's3':'m2v3'}];
      return selectedMarks;
    }
    myapp.selectMarks(newSelections);
    return myapp;
  };

  myapp.setFilters = function(filters){

  };

  myapp.selectMarks = function(selections){

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
