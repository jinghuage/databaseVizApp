//-----------------------------------------------------------------------------
// d3 techniques: circle pack layout
// circle pack: http://bl.ocks.org/mbostock/4063530
//-----------------------------------------------------------------------------


//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);



// the namespace

d3.chart.circlePackChart = function(){

    // private attributes enabled by closure

    var margin = {top: 2, right: 2, bottom: 4, left: 4},
    width = 960,
    height = 540,
    selectedItems = [],
    labelField = function(d){ return d[0]; },
    valueField = function(d){ return d[1]; },
    format = d3.format(",d"),
    fill = d3.scale.category20c();

    console.log("hello from circlepackchart");


    // the module body: self callable since is function

    var chart = function(selection) {

        selection.each(function(data) {


            //console.log("data to circlepack: ", data);

            // data = data.map(function(d, i) {
            //     return {name: labelField.call(data, d, i), value: valueField.call(data, d, i)};
            // });

            //console.log(data);
            if(Array.isArray(data))
                data = {name: "root", children: data};

            //data = flatten_classes(data);
            //console.log("classed data:", data);

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);
            console.log("svg: ", svg[0][0]);

            // Otherwise, create the skeletal chart.
            if(svg[0][0] === null){ 
                svg = svg.enter().append("svg");
                console.log("new svg: ", svg);
            }

            svg.attr("width", width).attr("height", height);


            //-----------------------------------------------------------------------------

            var zoom = d3.behavior.zoom()
                .scale(1)
                .scaleExtent([1, 8])
                //.translate([0, 0])
                .on("zoom", zoomed);

            function zoomed() {
                //var zscale = zoom.scale();
                //var ztranslate = zoom.translate();
                
                g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(zoom)
                .append("g");

            //-----------------------------------------------------------------------------

            var chartsize = [width-margin.left-margin.right, height-margin.top-margin.bottom];

            g.append("rect")
                .attr("width", chartsize[0])
                .attr("height", chartsize[1])
                .attr("class", "overlay");
                



            var layout = d3.layout.pack()
                .sort(null)
                .size(chartsize)
                .value(valueField)
                .padding(1.5);

            var nodes = layout.nodes(data);
            var node = g.selectAll("g.node")
                //.data(layout.nodes(classes(data)).filter(function(d){ return !d.children; }))
                .data(nodes)
                .enter().append("g")
                //.attr("class", "node")
                .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
                .attr("transform", function(d) { 
                    return "translate(" + d.x + "," + d.y + ")"; 
                })
                .on("click", function(d){ 
                    selectedItems[0] = d.name; 
                    draw_selection();
                });

            var circle = node.append("circle")
                .attr("r", function(d) { return d.r; })
                .style("fill", function(d) { return fill(d.name); })
                .style("opacity", 1.0);

            // node.append("title")
            //     .text(function(d) { return d.name + ":" + d.value; });
            
            // node.append("text")
            //     .attr("text-anchor", "middle")
            //     .attr("dy", ".3em")
            //     .text(function(d) { return d.className; }); //d.className.substring(0, d.r / 3); });

            var selectednodes = null;
            draw_selection();

            function draw_selection() {

                if( selectednodes) {
                    selectednodes.remove();
                }

                if( selectedItems[0] != "none" ) {
                    node.transition().style("opacity", 0.5);
                    
                    selectednodes = g.selectAll("g.selected")
                        .data(nodes.filter(function(d){ return selectedItems.indexOf(d.name) > -1; }))
                        .enter().append("g")
                        .attr("class", "selected")
                        .attr("transform", function(d) { 
                            return "translate(" + d.x + "," + d.y + ")"; 
                        });

                    selectednodes.append("circle")
                        .attr("r", function(d) { return d.r; })
                        .style("fill", function(d) { return fill(d.name); })
                        .transition()
                        .duration(2000)
                        .attr("r", function(d){ return 1.2 * d.r; })
                        .style("fill", function(d) { return "red"; });

                    selectednodes.append("text")
                        .attr("text-anchor", "middle")
                        .attr("dy", ".3em")
                        .text(function(d) { return d.name; }); //d.className.substring(0, d.r / 3); });

                }
            }

            //zoomed();



        });
    };


    // private function

    function flatten_classes(root) {
        var classes = [];
        
        function recurse(name, node) {
            if(node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else {
                var nodename = labelField(node);
                var nodevalue = valueField(node);
                classes.push({packageName: name, className: nodename, value: nodevalue});
                //classes.push({packageName: name, className: node.name, value: node.size});
            }
        }

        recurse(null, root);
        return {children: classes};
    }

    // public attributes of module 

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

    chart.label = function(_) {
        if(!arguments.length) return labelField;
        labelField = _;
        return chart;
    };

    chart.value = function(_) {
        if(!arguments.length) return valueField;
        valueField = _;
        return chart;
    };


    // return the module when invoke the namespace

    return chart;
};
