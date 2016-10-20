//-----------------------------------------------------------------------------
// d3 techniques: topojson, choropleth
// Bostock: let's make a map: http://bost.ocks.org/mike/map/
// choropleth: http://bl.ocks.org/mbostock/4060606
//-----------------------------------------------------------------------------

//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);

// produce a choropleth chart, following the d3 example here: 
// http://bl.ocks.org/mbostock/5925375
// see Bostock's Makefile how to convert topojson files from USGS data
// the us county code is using the FIPS system
// more about using topojson: 
// http://bl.ocks.org/mbostock/5557726


d3.chart.choroplethChart = function(){

    //var chorodata; 
    var width = 960,
    height = 540,
    selectedItems = [],
    margin = {top: 20, right: 10, bottom: 10, left: 40};

    var colorField = 'rate';
    var areaField = 'countyId';
    var legend = true; //'name'
    var graphStyle = 'us-country';

    console.log("hello from choroplethchart");


    var chart = function(selection) {

        selection.each(function(data) {

            var chorodata = data;
            var legends = {};
            var path = d3.geo.path().projection(null);

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            if(svg[0][0] === null) svg = svg.enter().append("svg");

            
            svg.attr("width", width)
                .attr("height", height);

            svg.append("text") 
                .attr("x", width/2)
                .attr("y", 16)
                .attr("text-anchor", "middle")
                .attr("dy", ".35em")
                .style("font", "18px sans-serif")
                .text("Title Goes Here");

            //-----------------------------------------------------------------------------

            var zoom = d3.behavior.zoom()
                .scale(1)
                .scaleExtent([1, 8])
                .translate([0, 0])
                .on("zoom", zoomed);

            function zoomed() {
                //var zscale = zoom.scale();
                //var ztranslate = zoom.translate();
                
                graphg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            var graphg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")")
            .call(zoom);

            //this invisible rect will receive all mouse events in its area
            //so mouse events will work not only just in "real" graph area
            var w = width - margin.left - margin.right,
                h = height - margin.top - margin.bottom;
            graphg.append("rect").attr("width", w).attr("height", h).attr("class", "overlay");

            graphg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", w)
                .attr("height", h);

            //-----------------------------------------------------------------------------
            var legenddata = [];
            var quantizeScale = d3.scale.quantize()
                .domain([0, 15])
                .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));



            d3.json("data/us.json", function(us) {

                console.log("us state and county shape file loaded");
                graphg.append("g")
                    .attr("class", "counties")
                    .selectAll("path")
                    .data(topojson.feature(us, us.objects.counties).features)
                    .enter().append("path")
                    //.attr("class", function(d) { return quantize(d.properties.rate); })
                    //.attr("class", "q8-9")
                    .attr("class", chorodata ? quantize : null)
                    .attr("d", path);
                
                graphg.append("path")
                    .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a.id / 1000 ^ b.id / 1000; }))
                    .attr("class", "state-borders")
                    .attr("d", path);

                

                function quantize(d) {
                    //console.log(d.id);
                    var rate = chorodata.filter(function(cd){
                        //console.log(cd, cd[areaField], cd[colorField]);
                        return cd[areaField] == d.id;
                    })[0][colorField];
                    //console.log(rate);

                    var classname = quantizeScale(rate);
                    //console.log(d.id, rate, classname);
                    legends[classname] = rate;
                    return classname;
                }

                for (var label in legends) { legenddata.push({label: label, value: legends[label]}); }
                legenddata.sort(function(obj1, obj2) {
	            // Ascending: first value less than the previous
	            return obj1.value - obj2.value;
                });

                //var space = Math.floor(height / (legenddata.length + 1));
                var legend = graphg.append("g")
                    //.attr("class", "Blues") // use the Blues serires of colorbrew class
                    .selectAll("g")
                    .data(legenddata)
                    .enter().append("g")
                    .attr("transform", function(d, i) {
                        return "translate(0," + (i*16) + ")"; 
                    });

                legend.append("rect")
                    .attr("width", 14)
                    .attr("height", 14)
                    .attr("class", function(d) { return d.label; });
                
                legend.append("text")
                    .attr("x", 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .text(function(d, i){ return "<=" + d.value + "%"; });

            });    

        });
    };


    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.selectedItems = function(_) {
        if(!arguments.length) return selectedItems;
        selectedItems = _;
        return chart;
    };

    chart.colorfield = function(_) {
        if (!arguments.length) return colorField;
        colorField = _;
        return chart;
    };

    chart.legend = function(_) {
        if (!arguments.length) return legend;
        legend = _;
        return chart;
    };

    chart.areafield = function(_) {
        if (!arguments.length) return areaField;
        areaField = _;
        return chart;
    };

    chart.graphstyle = function(_) {
        if(!arguments.length) return graphStyle;
        graphStyle = _;
        return chart;
    };

    return chart;
};
