//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);



d3.chart.sankeyFlowChart = function() {

    var width = 960,
    height = 200,
    selectedItems = [],
    margin = {top: 10, right: 20, bottom: 10, left: 20},
    padding = 10;

    var nodesField = "nodes",
        linksField = "links",
        labelField = "name",  //attribute in nodes array
        valueField = "value"; //attribute in links array 

    console.log("hello from sankeyFlowChart");


    //function compute_data_structure(){}

    var chart = function(selection) {
        
        selection.each(function(data) {

            //var nodes = [],
            //    links = [];


            // each link must have attributes: 
            //      source - reference to the source node
            //      target - reference to the target node
            //      value - how many readings follow this link


            var nodes = data[nodesField],
                links = data[linksField];

            // nodes and links must be ARRAY instances

            //console.log(nodes);
            //console.log(links);

            // make sure links array has attribute value -- d3.sankey assumes
            // if( d3.keys(links[0]).indexOf("value") == -1){
            //     links = links.map(function(d,i){ 
            //         d.value = d[valueField];
            //         return d;
            //     });
            // }


            var sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .size([width-margin.left-margin.right, height-margin.top-margin.bottom]);

            var path = sankey.link();
            path.curvature(0.6); // default curvature is 0.5

            var formatNumber = d3.format(",.0f"),
                format = function(d) { return formatNumber(d) + " P"; },
                color = d3.scale.category20();

            //var fillcolor = d3.scale.category20();
            //var strokecolor = d3.scale.category20c();


            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            if(svg[0][0] === null) svg = svg.enter().append("svg");

            
            svg.attr("width", width)
                .attr("height", height);

            var graphg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");

            //console.log(svg.node());

            // begin to draw sankey graph
            sankey.nodes(nodes)
            .links(links)
            .layout(32);

            //console.log(nodes);
            //console.log(links);

            var link = graphg.append("g").selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });

            link.append("title")
            .text(function(d){ return d.source[labelField] + " -> " + d.target[labelField] + "\n" + format(d.value); });

            var node = graphg.append("g").selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.behavior.drag()
                  .origin(function(d) { return d; })
                  .on("dragstart", function(){ return this.parentNode.appendChild(this); })
                  .on("drag", dragmove));

            node.append("rect")
            .attr("height", function(d){ return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d){ return d.color = color(d[labelField].replace(/ .*/, "")); })
            .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
            .append("title")
            .text(function(d){ return d.name + "\n" + format(d.value); });

            node.append("text")
            .attr("x", -6)
            .attr("y", function(d){ return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "center")
            .attr("transform", null)
            .text(function(d){ return d[labelField]; });
            //.filter(function(d){ return d.x < width / 2; })
            //.attr("x", 6 + sankey.nodeWidth())
            //.attr("text-anchor", "start");

            
            function dragmove(d) {
                d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.min(height-margin.top-d.dy, Math.max(-margin.top, Math.min(height - d.dy, d3.event.y)))) + ")");
                sankey.relayout();
                link.attr("d", path);
            }

            
        });                     

    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.selectedItems = function(_) {
        if(!arguments.length) return selectedItems;
        selectedItems = _;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.padding = function(value) {
        if (!arguments.length) return padding;
        padding = value;
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

    chart.nodes = function(_) {
        if(!arguments.length) return nodesField;
        nodesField = _;
        return chart;
    };

    chart.links = function(_) {
        if(!arguments.length) return linksField;
        linksField = _;
        return chart;
    };

    return chart;
};
