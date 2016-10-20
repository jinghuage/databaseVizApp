
//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);




d3.chart.parallelCoordChart = function(){

    var margin = {top: 30, right: 10, bottom: 10, left: 30},
    width = 960,
    height = 540,
    selectedItems = [];

    var dataFields = ['all'];


    console.log("hello from parallelcoordchart");


    var chart = function(selection) {

        selection.each(function(data) {


            var keys = d3.keys(data[0]);
            var keyvarieties = [];
            var keypos = [];
            keys.forEach( function(d, i) {
                var possibles = d.split(' ');
                possibles.forEach(function(p, pi){
                    keyvarieties.push(p);
                    keypos.push(i);
                });
            });
            
            console.log(keys, keyvarieties, keypos);

            if(dataFields.indexOf('all') > -1) dataFields = keys;
            else{
                dataFields = dataFields.map(function(d, di){
                    var m = keyvarieties.indexOf(d);
                    if(m > -1) return keys[keypos[m]];
                    else return 'nonexist';
                });
                //console.log("all dataFields: ", dataFields);
                while((m = dataFields.indexOf('nonexist')) !== -1) {
                    dataFields.splice(m, 1);
                }
            }

            console.log('cleaned dataFields: ', dataFields);


            //-----------------------------------------------------------------------------

            var x = d3.scale.ordinal()
                .rangePoints([0, width - margin.left - margin.right], 2);

            var y = {};

            var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background,
            foreground;

            var svg = d3.select(this).selectAll("svg").data([data]);
            if(svg[0][0] === null) svg = svg.enter().append("svg");

            svg.attr("width", width)
                .attr("height", height);

            
            //-----------------------------------------------------------------------------

            // var zoom = d3.behavior.zoom()
            //     .scale(1)
            //     .scaleExtent([1, 8])
            //     //.translate([0, 0])
            //     .on("zoom", zoomed);

            // function zoomed() {
            //     //var zscale = zoom.scale();
            //     //var ztranslate = zoom.translate();
                
            //     gg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            // }
            
            var gg = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                //.call(zoom);

            //-----------------------------------------------------------------------------

            // Extract the list of dimensions and create a scale for each.
            //console.log(d3.keys(data[0]));

            x.domain(dimensions = dataFields.filter(function(d) {
                return d != "name" && (y[d] = d3.scale.linear()
                                       .domain(d3.extent(data, function(p) { return +p[d]; }))
                                       .range([height - margin.top - margin.bottom, 0]));
            }));

            // Add grey background lines for context.
            background = gg.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("d", path);


            var strokecolor = d3.scale.category20();
            var legends = {};

            // Add blue foreground lines for focus.
            foreground = gg.append("g")
                //.attr("class", "foreground")
                .style("fill", "none")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .style("stroke", function(d, i) {
                    //create a hash from name
                    var label = d["name"].split(" ")[0];
                    //var word = CryptoJS.MD5(label).words[0]; // take first 32-bit word
                    //var i = Math.abs(word % 20);
                    //console.log(d["name"], i);
                    legends[label] = i;
                    return strokecolor(label);
                    })
                .style("stroke-opacity", 0.85)
                .attr("d", path);

            foreground.append("svg:title")
                .text(function(d) { return d.name; });

            //console.log(legends);

            // Add a group element for each dimension.
            //console.log(dimensions);

            var g = gg.selectAll(".dimension")
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
                .text(function(d, i){ return d; });

            // add color legend
            var legenddata = [];
            for (var label in legends) { legenddata.push({label: label, id: legends[label]}); }
            //console.log(legenddata);

            var space = Math.floor((height - margin.top - margin.bottom) / legenddata.length);
            //console.log(space, legenddata.length);

            var legend = gg.append("g")
                .attr("class", "legend")
                .selectAll("g")
                .data(legenddata)
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * space + ")"; });

            legend.append("rect")
                .attr("width", space-2)
                .attr("height", space-2)
                .style("fill", function(d) { return strokecolor(d.label); });

            legend.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                //.text(function(d) { return d.label; });
                .text(function(d, i) { return d.label; });

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

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
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

    chart.selectedItems = function(_) {
        if(!arguments.length) return selectedItems;
        selectedItems = _;
        return chart;
    };

    chart.datafields = function(_) {
        if (!arguments.length) return dataFields;
        dataFields = _;
        return chart;
    };

    return chart;
};
