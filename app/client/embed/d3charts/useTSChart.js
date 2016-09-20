//use the re-useable chart timeSeriesChart
//http://bost.ocks.org/mike/chart/


var chart = timeSeriesChart()
    .x(function(d) { return formatDate.parse(d.date); })
    .y(function(d) { return +d.price; });

var formatDate = d3.time.format("%b %Y");

d3.csv("sp500.csv", function(data) {
  d3.select("#example")
      .datum(data)
      .call(chart);
});
