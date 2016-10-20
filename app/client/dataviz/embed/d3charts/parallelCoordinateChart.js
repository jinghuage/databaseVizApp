
//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);




d3.chart.parallelCoordChart = function(){

    var margin = {top: 30, right: 10, bottom: 10, left: 30},
    width = 960,
    height = 540;


    console.log("hello from parallelcoordchart");


    var chart = function(selection) {

        selection.each(function(data) {

            var x = d3.scale.ordinal()
                .rangePoints([0, width - margin.left - margin.right], 2);

            var y = {};

            var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background,
            foreground;

            var svg = d3.select(this).selectAll("svg").data([data])
                .enter().append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            // Extract the list of dimensions and create a scale for each.
            //console.log(d3.keys(data[0]));

            x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
                return d != "name" && (y[d] = d3.scale.linear()
                                       .domain(d3.extent(data, function(p) { return +p[d]; }))
                                       .range([height - margin.top - margin.bottom, 0]));
            }));

            // Add grey background lines for context.
            background = svg.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("d", path);


            var strokecolor = d3.scale.category20();
            var legends = {};

            // Add blue foreground lines for focus.
            foreground = svg.append("g")
                //.attr("class", "foreground")
                .style("fill", "none")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .style("stroke", function(d) {
                    //create a hash from name
                    var label = d["name"].split(" ")[0];
                    var word = CryptoJS.MD5(label).words[0]; // take first 32-bit word
                    var i = Math.abs(word % 20);
                    //console.log(d["name"], i);
                    legends[label] = i;
                    return strokecolor(i);
                    })
                .style("stroke-opacity", 0.85)
                .attr("d", path);

            foreground.append("svg:title")
                .text(function(d) { return d.name; });

            //console.log(legends);

            // Add a group element for each dimension.
            //console.log(dimensions);

            var g = svg.selectAll(".dimension")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "dimension")
                .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

            // Add an axis and title.
            g.append("g")
                .attr("class", "axis")
                .each(function(d) { 
                    //console.log("each y axis: ", d);
                    d3.select(this).call(axis.scale(y[d])); 
                 })
                .append("text")
                .attr("text-anchor", "middle")
                .attr("y", -9)
                //.text(String);
                .text(function(d, i){ return "measure " + i; });

            // add color legend
            var legenddata = [];
            for (var label in legends) { legenddata.push({label: label, id: legends[label]}); }
            //console.log(legenddata);

            var space = Math.floor((height - margin.top - margin.bottom) / legenddata.length);
            //console.log(space, legenddata.length);

            var legend = svg.append("g")
                .attr("class", "legend")
                .selectAll("g")
                .data(legenddata)
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * space + ")"; });

            legend.append("rect")
                .attr("width", space-2)
                .attr("height", space-2)
                .style("fill", function(d) { return strokecolor(d.id); });

            legend.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                //.text(function(d) { return d.label; });
                .text(function(d, i) { return "Subject " + i; });

            // Add and store a brush for each axis.
            g.append("g")
                .attr("class", "brush")
                .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);

            // Returns the path for a given data point.
            function path(d) {
                return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            }

            // Handles a brush event, toggling the display of foreground lines.
            function brush() {
                var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
                extents = actives.map(function(p) { return y[p].brush.extent(); });
                foreground.style("display", function(d) {
                    return actives.every(function(p, i) {
                        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                    }) ? null : "none";
                });
            }

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

    return chart;
};
