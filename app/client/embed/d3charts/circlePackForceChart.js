
//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);




d3.chart.circlePackForceChart = function(){
    var margin = {top: 2, right: 2, bottom: 4, left: 4},
    width = 960,
    height = 540,
    labelField = function(d){ return d[0]; },
    valueField = function(d){ return d[1]; },
    format = d3.format(",d"),
    fill = d3.scale.category20c();

    console.log("hello from circlepackforcechart");


    var chart = function(selection) {

        selection.each(function(data) {


            data = data.map(function(d, i) {
                return {name: labelField.call(data, d, i), value: valueField.call(data, d, i)};
            });

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
            g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            var force = d3.layout.force()
                .gravity(0.05)
                .charge(-20)
                .nodes(data)
                .size([width-margin.left-margin.right, height-margin.top-margin.bottom]);

             force.start();
            //console.log(force.nodes());
            
            // attention: let's always add css class to div, not element itself
            var node = g.selectAll("g.node")
                .data(function(d){ return d;})
                .enter().append("g")
                .attr("class", "leaf node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            
            node.append("circle")
                .attr("r", function(d) { return d.value / 150; })
                .style("fill", function(d) { return fill(d.name); })
                .call(force.drag);

            node.append("title")
                .text(function(d) { return d.name + ":" + d.value; });


            force.on("tick", function(e) {
                // g.selectAll("circle.leaf")
                //     .attr("cx", function(d) { return d.x; })
                //     .attr("cy", function(d) { return d.y; });
                node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            });
 
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

    return chart;
};
