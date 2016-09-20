//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);



//function timeSeriesChart() {
d3.chart.timeSeriesChart = function(){
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
    width = 760,
    height = 120,
    xValue = function(d) { return d[0]; },
    yValue = function(d) { return d[1]; },
    xScale = d3.time.scale(),
    yScale = d3.scale.linear(),
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
    yAxis = d3.svg.axis().scale(yScale).orient("left"),
    area = d3.svg.area().x(X).y1(Y),
    line = d3.svg.line().x(X).y(Y);

    // print to console -- debugging
    console.log("hello from timeSeriesChart");

    // private functions
    // The x-accessor for the path generator; xScale â   xValue.
    function X(d) {
        return xScale(d[0]);
    }

    // The x-accessor for the path generator; yScale â   yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    // public: will return this object
    var chart = function(selection) {
        selection.each(function(data) {

            // Convert data to standard representation greedily;
            // this is needed for nondeterministic accessors.
            data = data.map(function(d, i) {
                return [xValue.call(data, d, i), yValue.call(data, d, i)];
            });

            //console.log(data);

            // Update the x-scale.
            xScale
                .domain(d3.extent(data, function(d) { return d[0]; }))
                .range([0, width - margin.left - margin.right]);

            // Update the y-scale.
            yScale
                .domain([0, d3.max(data, function(d) { return d[1]; })])
                .range([height - margin.top - margin.bottom, 0]);


            

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);
            console.log("svg: ", svg[0][0]);

            // Otherwise, create the skeletal chart.
            if(svg[0][0] === null){ 
                svg = svg.enter().append("svg");
                console.log("new svg: ", svg);
            }

            var g = svg.append("g");
            g.append("path").attr("class", "tscarea");
            g.append("path").attr("class", "tscline");
            g.append("g").attr("class", "x tscaxis");
            g.append("g").attr("class", "y tscaxis");


            // Update the outer dimensions.
            svg .attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            //var g = svg.select("g")
            g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Update the area path.
            g.select(".tscarea")
                .attr("d", area.y0(yScale.range()[0]));

            // Update the line path.
            g.select(".tscline")
                .attr("d", line);

            // Update the x-axis.
            g.select(".x.tscaxis")
                .attr("transform", "translate(0," + yScale.range()[0] + ")")
                .call(xAxis);

            //console.log("update y axis");
            g.select(".y.tscaxis")
                .call(yAxis);

            var tooltip = d3.select("body").append("div")
                .style("visibility", "hidden")
                .attr("class", "infobox");

            var pos = [];
            var label = "";

            // Add mouse events to show tooltip
            g.on('mouseover', function() {
                //console.log(d3.mouse(this));
                pos = d3.mouse(this);

                //var d = d3.select(this).data()[0];
                var date = xScale.invert(pos[0]);
                var price = yScale.invert(pos[1]);
                label = "" + date + " has price " + price;
                //console.log(label);
                tooltip.style("visibility", "visible")
                    .text(label); })
            .on("mousemove", function(){
                tooltip.style("top", (d3.event.pageY-10)+"px")
                       .style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){
                tooltip.style("visibility", "hidden");});


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

    chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
    };

    return chart;
};
