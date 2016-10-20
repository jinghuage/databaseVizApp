
//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);




d3.chart.radialTreeChart = function(){
    var margin = {top: 2, right: 2, bottom: 4, left: 4},
    width = 960,
    height = 540,
    labelField = function(d){ return d[0]; },
    valueField = function(d){ return d[1]; },
    format = d3.format(",d"),
    fill = d3.scale.category20c();

    console.log("hello from radialtreechart");


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

            var tree = d3.layout.tree()
                .size([width-margin.left-margin.right, height-margin.top-margin.bottom])
                .separation(function(a, b) { return (a.parent == b.parent ? 1: 2) / a.depth; });

            var diagonal = d3.svg.diagonal.radial()
                .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

            //var nodes = tree.nodes(data);
            var node = g.selectAll("g.node").data(tree.nodes)
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

            node.append("circle")
                .attr("r", 4.5);

            node.append("text")
                .attr("dy", ".31em")
                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .attr("transform", function(d) { return d.x < 180 ? "translate(8)":"rotate(180)translate(-8)"; })
                .text(function(d) { return d.name; });


            //var link = g.selectAll("path.link").data(tree.links(nodes))

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
