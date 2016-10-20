//-----------------------------------------------------------------------------
// d3 techniques : tree (cluster) layout, radial projection
// dendrogram : http://bl.ocks.org/mbostock/4063570
// radial projection: http://bl.ocks.org/mbostock/4063550
//-----------------------------------------------------------------------------


//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);




d3.chart.dendrogramChart = function(){
    var margin = {top: 2, right: 2, bottom: 4, left: 4},
    width = 960,
    height = 540,
    selectedItems = [],
    labelField, // = function(d){ return d[0]; },
    //valueField = function(d){ return d[1]; },
    style = 'radial',
    collapsible = true,
    duration = 2000,
    root,
    i=0,
    format = d3.format(",d"),
    fill = d3.scale.category20c();

    console.log("hello from dendrogramchart");


    var chart = function(selection) {

        selection.each(function(data) {

            
            // data = data.map(function(d, i) {
            //     return {name: labelField.call(data, d, i), value: valueField.call(data, d, i)};
            // });

            // no data mapping here, assume data node has name attribute

            console.log(width, height);


            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);
            console.log("svg: ", svg[0][0]);

            // Otherwise, create the skeletal chart.
            if(svg[0][0] === null){ 
                svg = svg.enter().append("svg");
                console.log("new svg: ", svg);
            }

            svg.attr("width", width).attr("height", height);
     
            var g = svg.append("g");
            g.attr("transform", "translate(" + width/2 + "," + height/2 + ")");


            var radius = d3.min([width, height]) / 2;
            console.log(radius);

            // by default the tree layout creates a tree downward with depth
            // means d.x attribute is breadth, d.y attribute is depth
            // a radial project will bend the horizontal tree breadth into a circle
            // so d.x should have range [0, 360] to be perfectly bent into 360 degrees
            // and the d.y should have range [0, radius - textlength] to fit in the svg
            // this is why we set tree size to be [360, radius-120]
            var tree = d3.layout.tree()
                .size([360, radius-120])
                .separation(function(a, b) { return (a.parent == b.parent ? 1: 2) / a.depth; });

            // the radial projection projects [x, y] to [radius, angle] value
            var diagonal = d3.svg.diagonal.radial()
                .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });


            root = data;
            root.children.forEach(collapse);
            root.x0 = 0;
            root.y0 = 0;
            update(root);

            function update(source) {

                // re compute the tree layout
                var nodes = tree.nodes(root);


                // assign new data to g.node group, binding key is d.id
                var node = g.selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i);});
                // new nodes to add, at parent's previous position first, later will transit to new position
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { 
                        return "rotate(" + (source.x0 - 90) + ")translate(" + source.y0 + ")"; 
                    })
                    .on("click", click);
                    //.on("mouseover", function(d) { console.log(d); });

                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("stroke", "steelblue")
                    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; } );

                nodeEnter.append("text")
                    .attr("dy", ".31em")
                    .attr("text-anchor", "start")
                    .attr("transform", function(d) {
                        return source.x0 < 180 ? "translate(8)":"translate(8)";
                    })
                    //.attr("text-anchor", function(d) { return source.x0 < 180 ? "start" : "end"; })
                    // .attr("transform", function(d) { 
                    //     return source.x0 < 180 ? "translate(8)":"rotate(180)translate(-8)"; 
                    // })
                    .text(function(d) { return d[labelField]; })
                    .style("font", "10px sans-serif")
                    .style("fill-opacity", 1e-6);


                // all existing nodes (including new added nodes, since just added) to update (with transition)
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

                nodeUpdate.select("text")
                    //.attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                    //.attr("transform", function(d) { 
                    //    return d.x < 180 ? "translate(8)":"rotate(180)translate(-8)"; 
                    //})
                    .attr("transform", function(d) {
                        var l = d[labelField].length;
                        //console.log(l);
                        return d.x < 180 ? "translate(8)":"rotate(180)translate(" + (-8-l*5) +")";
                    })
                    .style("fill-opacity", 1.0);



                // old nodes to remove (with transition to the parents new position)
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) { 
                        return "rotate(" + (source.x - 90) + ")translate(" + source.y + ")"; 
                    })
                    .remove();

                // instead of sudden remove, let's add "remove gradually" effect
                nodeExit.select("circle")
                    .attr("r", 1e-6);

                // note: fill-opacity works, stroke-opacity doesn't
                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // do the same thing to the links (as nodes)
                // assign new data, binding key is d.target.id
                var link = g.selectAll("path.link").data(tree.links(nodes), function(d) { return d.target.id; });

                // new links, add. parent: at previous postion first, then transit to new position
                link.enter().append("path")
                    .attr("class", "link")
                    //.attr("d", diagonal)
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    })
                    .style("fill", "none")
                    .style("stroke", "#ccc");
                // all existing links (including newly added links), update
                link.transition().duration(duration).attr("d", diagonal);

                // old links, remove ( with transition to parents new position)
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });


            }

            // Toggle children on click.
            function click(d) {
                //console.log("click: ", d);

                //d.x0 = d.x;
                //d.y0 = d.y;

                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }


        });
    };


    function classes(root) {
        var classes = [];
        
        function recurse(name, node) {
            if(node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size});
        }

        recurse(null, root);
        return {children: classes};
    }

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

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

    chart.labelfield = function(_) {
        if(!arguments.length) return labelField;
        labelField = _;
        return chart;
    };

    chart.style = function(_) {
        if(!arguments.length) return style;
        style = _;
        return chart;
    };

    chart.collapsible = function(_) {
        if(!arguments.length) return collapsible;
        collapsible = _;
        return chart;
    };

    return chart;
};
