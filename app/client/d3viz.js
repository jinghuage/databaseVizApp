//module: viz.d3Viz -- load d3 viz to vizdiv placeholder

//namespace: viz (window.viz)
var viz = viz || {};
console.log("name space viz is:", viz);

viz.d3Viz = function() {

  var width, height;
  var files;
  var vizDiv, markerSelectionDiv;

  var myapp = function(){

    console.log("init d3Viz");

    //var vizDiv = document.getElementById('viz');//$('#viz');
    var vizDivDom = document.getElementById(vizDiv);
    console.log(vizDivDom, vizDivDom.offsetWidth, vizDivDom.offsetHeight);

    //todo: embed viz in vizDivDom
    var s = vizBook.startwith;
    var dashboard = vizBook.dashboard[s];
    var vizURL = vizBook.url + dashboard.name + '.html';

    var iframe = '<iframe src="' + vizURL + '" width="' + width + '" height="'+ height + '"></iframe>';

    console.log(iframe);
    $("#"+vizDiv).html(iframe);

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