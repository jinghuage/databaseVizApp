//-----------------------------------------------------------------------------
// d3 techniques : force layout
// labeled force chart : http://bl.ocks.org/MoritzStefaner/1377729
//-----------------------------------------------------------------------------


//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);



d3.chart.networkChart = function() {

    var width = 960,
    height = 200,
    selectedItems = [],
    margin = {top: 10, right: 20, bottom: 10, left: 20},
    padding = 10;

    var nodesField = "nodes",
        linksField = "links",
        labelField = "name",  //attribute in nodes array
        valueField = "value"; //attribute in links array 

    console.log("hello from networkChart");


    //function compute_data_structure(){}

    var chart = function(selection) {
        
        selection.each(function(data) {


            var nodes = data[nodesField],
                links = data[linksField],
                labelAnchors = [],
                labelAnchorLinks = [];

            // nodes and links must be ARRAY instances

            //console.log(nodes);
            //console.log(links);

            // for each real node, insert a pair of anchor nodes for its label placement, 
            // add a link between each pair of anchors
            // by using a force layout on the anchor nodes, the pairs will be repelling each other
            // while each pair will maintain a close distance between the two
            // 
            nodes.forEach(function(d,i){
                labelAnchors.push({node: d});
                labelAnchors.push({node: d});
                labelAnchorLinks.push({source: i*2, target: i*2+1, value: 1});
            });

            var labelDistance = 0;

            var w = width-margin.left-margin.right;
            var h = height-margin.top-margin.bottom;
         
            var force = d3.layout.force()
                .size([w, h])
                .nodes(nodes)
                .links(links)
                .gravity(1)
                .linkDistance(50)
                .charge(-3000)
                //.linkStrength(function(x) {return x[valueField] * 10;	});
                .linkStrength(10);


	    force.start();

	    var force2 = d3.layout.force()
                .nodes(labelAnchors)
                .links(labelAnchorLinks)
                .gravity(0)
                .linkDistance(0)
                .linkStrength(8)
                .charge(-100)
                .size([w, h]);

	    force2.start();


            //-----------------------------------------------------------------------------

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            if(svg[0][0] === null) svg = svg.enter().append("svg");

            //console.log(svg.node());            
            svg.attr("width", width)
                .attr("height", height);

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
            //var w = width - margin.left - margin.right,
            //    h = height - margin.top - margin.bottom;
            graphg.append("rect").attr("width", w).attr("height", h).attr("class", "overlay");

            graphg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", w)
                .attr("height", h);

            // define arrow markers for graph links
            graphg.append('defs').append('marker')
                .attr('id', 'end-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 36)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#000');

            graphg.append('defs').append('marker')
                .attr('id', 'start-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 4)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M10,-5L0,0L10,5')
                .attr('fill', '#000');

            //-----------------------------------------------------------------------------
            // begin to draw the network

	    var link = graphg.selectAll("line.link").data(links)
                .enter().append("svg:line")
                .attr("class", "link")
                .style("stroke", "#CCC")
                .style('stroke-width', 1)
                .style('marker-end', 'url(#end-arrow)');
                //.style('marker-start', 'url(#start-arrow)');

	    var node = graphg.selectAll("g.node").data(force.nodes())
                .enter().append("svg:g")
                .attr("class", "node");
	    node.append("svg:circle")
                .attr("r", 5)
                .style("fill", "#555")
                .style("stroke", "#FFF")
                .style("stroke-width", 3);

	    node.call(force.drag); //todo: this interfere with global pan


	    var anchorLink = graphg.selectAll("line.anchorLink").data(labelAnchorLinks)//.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

	    var anchorNode = graphg.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
	    anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
	    anchorNode.append("svg:text").text(function(d, i) {
		return i % 2 == 0 ? "" : d.node[labelField];
	    }).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

	    var updateLink = function() {
		this.attr("x1", function(d) {
		    return d.source.x;
		}).attr("y1", function(d) {
		    return d.source.y;
		}).attr("x2", function(d) {
		    return d.target.x;
		}).attr("y2", function(d) {
		    return d.target.y;
		});

	    }

	    var updateNode = function() {
		this.attr("transform", function(d) {
		    return "translate(" + d.x + "," + d.y + ")";
		});

	    }

	    force.on("tick", function() {

		force2.start();

		node.call(updateNode);

		anchorNode.each(function(d, i) {
                    //anchor one of the anchorNode to the real node, then the other will be short distance away 
		    if(i % 2 == 0) {
			d.x = d.node.x;
			d.y = d.node.y;
		    } else {
                        // the text node
			var b = this.childNodes[1].getBBox();

			var diffX = d.x - d.node.x;
			var diffY = d.y - d.node.y;

			var dist = Math.sqrt(diffX * diffX + diffY * diffY);

			var shiftX = b.width * (diffX - dist) / (dist * 2);
			shiftX = Math.max(-b.width, Math.min(0, shiftX));
			var shiftY = 5;
			this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
		    }
		});


		anchorNode.call(updateNode);

		link.call(updateLink);
		anchorLink.call(updateLink);

	    });


            
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
