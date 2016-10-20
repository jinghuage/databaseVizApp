//-----------------------------------------------------------------------------
// d3 techniques : force layout, sorted nodes, tooltip
// Bostock's example : http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html?_r=0
//-----------------------------------------------------------------------------


//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);




d3.chart.forceChart = function(){
    var margin = {top: 2, right: 2, bottom: 4, left: 4},
    width = 960,
    height = 540,
    selectedItems = [],
    labelField, // = function(d){ return d[0]; },
    valueField, // = function(d){ return d[1]; },
    sortField,
    colorField,
    format = d3.format(",d"),
    //fill = d3.scale.category20c();
    fillColor = d3.scale.ordinal().domain([-3,-2,-1,0,1,2,3]).range(["#d84b2a", "#ee9586","#e4b7b2","#AAA","#beccae", "#9caf84", "#7aa25c"]),
    strokeColor = d3.scale.ordinal().domain([-3,-2,-1,0,1,2,3]).range(["#c72d0a", "#e67761","#d9a097","#999","#a7bb8f", "#7e965d", "#5a8731"]);


    console.log("hello from forcechart");


    var chart = function(selection) {

        selection.each(function(data) {


            // -------------- Pre-process data -----------------

            if(d3.keys(data[0]).indexOf('value') == -1){
                data = data.map(function(d, i) {
                    console.log(d, valueField, d[valueField]);
                    d.value = +d[valueField];
                    return d;
                });
            }

            var radiusScale = d3.scale.pow().exponent(3).domain([0,1500]).range([1,20]);
            var total = 0;
            data.forEach(function(d,i){
                total += d.value; });
            var average = total / data.length;

            var w = width-margin.left-margin.right,
                h = height-margin.top-margin.bottom;

            var bound = 150;
            //console.log("bound: ", bound);
            var sortScale = d3.scale.linear().range([h/2 - bound, h/2 + bound]);
            sortScale.domain(d3.extent(data, function(d,i){
                return +d[sortField];
            }));

            data = data.map(function(d,i) {
                d.radius = radiusScale(d.value);
                //d.aboveAverage = (d.value > average);
                d.changeCategory = categorizeChange((d.value-average)/average);
                d.x = Math.random() * w;
                //d.y = Math.random() * h;
                d.y = sortScale(+d[sortField]);
                return d;
            });
            //console.log(data);


            console.log(width, height);


            // ----------------- setup SVG ----------------

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

            // --------------- force layout  ------------------

            var defaultGravity = 0.1;
            function defaultCharge(d){
                if (d.value < 0) {
                    return 0
                } else {
                    return -Math.pow(d.radius,2.0)/8 
                };
            }

            var force = d3.layout.force()
                .gravity(defaultGravity)
                .charge(defaultCharge)
                .friction(0.9)
                .nodes(data)
                .size([width-margin.left-margin.right, height-margin.top-margin.bottom]);

             force.start();
            //console.log(force.nodes());

            // -------------------- draw nodes (circles) -----------------
            
            // attention: let's always add css class to div, not element itself
            var node = g.selectAll("circle.node")
                .data(data)
                .attr("class", "node");

            var that = this;
      
            node.enter().append("circle")
                .attr("r", function(d) { return d.radius; })
                .style("fill", function(d) { 
                    return fillColor(d.changeCategory);
                })
                .style("stroke-width",1)
                .style("stroke", function(d){
                    return strokeColor(d.changeCategory);
                })
                .call(force.drag)
                .on("mouseover",function(d,i) { 
                    var el = d3.select(this);
                    //var xpos = Number(el.attr('cx'))
                    //var ypos = (el.attr('cy') - d.radius - 10)
                    //console.log(xpos, ypos);

                    //pos = d3.mouse(this);

                    el.style("stroke","#000").style("stroke-width",3);
                    d3.select("#x-item-tooltip")
                        .style('top', (d3.event.pageY-10)+"px")
                        .style('left', (d3.event.pageX+10)+"px")
                        .style('display','block')
                        .classed('value-plus', (d.changeCategory > 0))
                        .classed('value-minus', (d.changeCategory < 0));
                    d3.select("#x-item-tooltip .x-item-name").html(d[labelField])
                    d3.select("#x-item-tooltip .x-item-value").html("$"+d.value)
                })
                .on("mouseout",function(d,i) { 
                    d3.select(this)
                        .style("stroke-width",1)
                        .style("stroke", function(d){ return strokeColor(d.changeCategory); })
                    d3.select("#x-item-tooltip").style('display','none');
                });


            function totalSort(alpha) {
                return function(d){
                    var targetX = w / 2; //Math.random() * bounding;
                    var targetY = h / 2; //sortScale(+d[sortField]);
                    
                    //var r = Math.max(5, d.radius);
                    d.x = d.x + (targetX - d.x) * defaultGravity * alpha;
                    d.y = d.y + (targetY - d.y) * defaultGravity * alpha;
                };
            }

            force.on("tick", function(e) {
                node
                    //.each(that.totalSort(e.alpha))
                    //.each(that.buoyancy(e.alpha))
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });

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


    function categorizeChange(c){
                        if (isNaN(c)) { return 0;
                        } else if ( c < -0.25) { return -3;
                        } else if ( c < -0.05){ return -2;
                        } else if ( c < -0.001){ return -1;
                        } else if ( c <= 0.001){ return 0;
                        } else if ( c <= 0.05){ return 1;
                        } else if ( c <= 0.25){ return 2;
                        } else { return 3; }
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

    chart.sort = function(_) {
        if(!arguments.length) return sortField;
        sortField = _;
        return chart;
    };

    chart.color = function(_) {
        if(!arguments.length) return colorField;
        colorField = _;
        return chart;
    };


    return chart;
};
