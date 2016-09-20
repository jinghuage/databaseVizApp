//-----------------------------------------------------------------------------
// d3 techniques : area and line chart, brush, stacked graph
// Bostock's guidance toward reuseable charts: http://bost.ocks.org/mike/chart/
// Stacked area chart : http://bl.ocks.org/mbostock/3885211
// Brushing : http://bl.ocks.org/mbostock/1667367
//-----------------------------------------------------------------------------

//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);


//function timeSeriesChart() {
d3.chart.seriesChart = function(){

    var width = 960,
    height = 500,
    selectedItems = [],
    margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 10, right: 10, bottom: 10, left: 40};

    var plotFields = ['economy'];
    var xField = {'name': 'Default', 'time': false};
    var legendField = 'date'; //'name'
    var graphStyle = 'bar';
    var stack = false;
    
 
    // print to console -- debugging
    console.log("hello from seriesChart");


    // public: will return this object
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

            if(plotFields.indexOf('all') > -1) plotFields = keys;
            else{
                plotFields = plotFields.map(function(d, di){
                    var m = keyvarieties.indexOf(d);
                    if(m > -1) return keys[keypos[m]];
                    else return 'nonexist';
                });
                //console.log("all plotFields: ", plotFields);
                while((m = plotFields.indexOf('nonexist')) !== -1) {
                    plotFields.splice(m, 1);
                }
            }
            console.log('cleaned plotFields: ', plotFields);
            
            var m = keyvarieties.indexOf(xField.name);
            if(m > -1) xField.name = keys[keypos[m]];
            else xField.name = 'Default';
            console.log('xField: ', xField);



            // add a 'Default' attribute to data, as data item natural id
            data = data.map(function(d, i){d['Default'] = i; return d;});


            //-----------------------------------------------------------------------------
            var w = width - margin.left - margin.right,
                h = height - margin.top - margin.bottom,
                h2 = margin.bottom - margin2.top - margin2.bottom;

            margin2.top = height - margin.bottom + margin2.top;
            

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            if(svg[0][0] === null) svg = svg.enter().append("svg");

            
            svg.attr("width", width)
                .attr("height", height);

            var graphg = svg.append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //this invisible rect will receive all mouse events in its area
            //so mouse events will work not only just in "real" graph area
            graphg.append("rect").attr("width", w).attr("height", h).attr("class", "overlay");

            graphg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", w)
                .attr("height", h);


            //-----------------------------------------------------------------------------


            var seriesScale;
            if(xField.time) seriesScale = d3.time.scale().range([0, w]);
            else seriesScale = d3.scale.linear().range([0, w]);
            seriesScale.domain(d3.extent(data, function(d, i){
                return +d[xField.name];
            }));

            console.log(seriesScale.domain());

            var seriesAxis = d3.svg.axis().scale(seriesScale).orient('top').tickSize(6, 0);

            function X(d) {
                return seriesScale(+d[xField.name]);
            }

            //-----------------------------------------------------------------------------

            var inpadding = 0.3;
            var outpadding = 0.2;
            if(stack === true) inpadding = 0.1;

            var base = d3.scale.ordinal()
                   .rangeBands([h, 0], inpadding, outpadding)
                   .domain(plotFields);

            console.log(base.rangeBand(), base.rangeExtent());

            plotFields.forEach(function(d,i){
                console.log(d, base(d));
            });


            var graphs = [];
            var yScales = [];
            //var Ys = [];
            var legend;
            var color = d3.scale.category20();

            //-----------------------------------------------------------------------------

            draw_graphs();
            draw_legend();
            add_slider();


            function draw_graphs() {
                plotFields.forEach(function(d, i){

                    var fieldname = d;
                    var fieldnum = i;
                    var s = base(d);
                    var band = base.rangeBand();
                    var e = s + band;
                    console.log(d, s, band, e);

                    var graphbase, basediff;
                    if(stack === false){
                        graphbase = s;
                        basediff = 0;
                    }
                    else {
                        graphbase = base(plotFields[plotFields.length-1]);
                        basediff = s - graphbase;
                    }
                    console.log(graphbase, basediff);

                    var yScale = d3.scale.linear()
                        .range([band, 0])
                        .domain(d3.extent(data, function(p) { return +p[d]; }));

                    console.log(yScale.domain());


                    yScales.push(yScale);
                    //console.log("check yScales array: ", 
                    //            yScales[0].domain(), yScales[0].range());

                    var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(band/20);


                    // var graphdata = data.map(function(p, pi){
                    //     return [+p[series.name], +p[d]];
                    // });

                    // create a group for this subgraph
                    var g = graphg.append("g")
                        .attr("transform", "translate(0," + graphbase + ")");

                    //g.append("text").attr("text-anchor", "middle").attr("y", -9).text(d);
                    //g.append("g").attr("class", "x axis");
                    g.append("g").attr("class", "y axis");

                    //g.select(".x.axis").call(seriesAxis); 
                    g.select(".y.axis")
                        .attr("transform", "translate(0," + basediff + ")")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", -36) //coordinate has rotated
                        .attr("x", -band/2)
                        .attr("dy", ".71em")
                        .style("text-anchor", "middle")
                        .text(d);

                    var graphbody = g.append("g").attr("class", "graphbody").attr("clip-path", "url(#clip)");
                    var bars;
                    if(graphStyle == 'area') {
                        graphbody.append("path").attr("class", "area");//.attr("clip-path", "url(#clip)");
                        graphbody.append("path").attr("class", "line");//.attr("clip-path", "url(#clip)");
                    }
                    else if(graphStyle == 'bar') {
                        bars = graphbody.selectAll("g.bar").data(function(d){ return d; })
                            .enter().append("g")
                            .attr("class", "bar");
                            //.attr("clip-path", "url(#clip)");
                    }


                    // function X(d) {
                    //     return seriesScale(+d[series.name]);
                    // }

                    // variables fieldname and fieldnum and basediff will be remembered by closure
                    function Y(d) {
                        if(stack === false) return yScale(+d[fieldname]);
                        else{
                            var result = 0;

                            //yScales.forEach(function(ys,yi){ 
                            for(var yi=0; yi<=fieldnum; yi++){
                                var fn = plotFields[yi];
                                var ys = yScales[yi];
                                result += ys(+d[fn]);
                            }

                            return basediff + result;
                        }
                    }

                    function H(d){
                        return band - yScale(+d[fieldname]);
                    }

                    function Y0(d){ 
                        if(stack === false) return band;
                        else {
                            return Y(d) + H(d); 
                            //Ys.forEach(function(y,i){ result += y(d); });
                        }
                    }

                    //Ys.push(Y);

                    var area = d3.svg.area().x(X).y0(Y0).y1(Y);
                    var line = d3.svg.line().x(X).y(Y);

                    

                    if(graphStyle == 'area'){
                        graphbody.select(".area").attr("d", area)
                            .style("fill", color(fieldname));
                        graphbody.select(".line").attr("d", line)
                            .style("stroke", "none");
                    }
                    else if(graphStyle == 'bar') {
                        var space = w / data.length;
                        //g.selectAll("g.bar rect")
                        bars.append("rect")
                         .attr("width", space)
                         .attr("x", X)
                         .attr("y", Y)
                         .attr("height", H)
                         .style("fill", function(d){return color(fieldname);});

                        //bars.append("text").text(d);
                    }


                    graphs.push({'graphname': d, 'graphbody': graphbody, 'area': area, 'line': line});
                });
            }

            //-----------------------------------------------------------------------------
            function draw_legend() {


                var g = graphg.append("g").attr("clip-path", "url(#clip)")
                    .attr("transform", "translate(0," + h + ")");

                legend = g.selectAll(".legend").data(function(d){ return d; })
                    .enter().append("g").attr("class", "legend");

                var space = w / data.length;
                //legend.selectAll("rect").data(function(d){return d;})
                   //.enter()

                // todo: bug fix: assuming data has "name" attribute!
                legend.append("rect")
                   //.attr("x", function(d,i){return space*i;})
                   .attr("x", X)
                   .attr("y", 0)
                   .attr("width", space)
                   .attr("height", 12)
                   .style("fill", function(d){ return color(d[legendField].split(' ')[0]); });

                legend.append("text")
                   .attr("x", X)
                   .attr("y", 7)
                   .attr("dy", ".35em")
                   .text(function(d){
                       if(space > 6) return d[legendField].substring(0,1);
                       else return '';
                   });
            };

            //-----------------------------------------------------------------------------
            function add_slider() {

                var brushScale = seriesScale.copy();

                var brush = d3.svg.brush()
                    .x(brushScale)
                    .on("brush", brushed);


                var extent=[0,0];

                function brushed() {
                    if(brush.empty()) return; //must check empty otherwise extent() return infinity

                    extent = brush.extent();
                    var space = w / (extent[1] - extent[0]);

                    //don't just use selectAll("text") -- use a specific class to identify
                    //so not other text are selected instead
                    slider.selectAll("text.range").data(extent)
                        .attr("x", function(d){ return brushScale(d);})
                        .attr("y", 15)
                        .style("stroke", "steelblue")
                        .style("text-anchor", "middle")
                        .text(function(d){return d.toString().substring(0,3);});


                    //console.log(extent);
                    seriesScale.domain(brush.empty() ? seriesScale.domain() : extent);

                    graphs.forEach(function(g,i){
                        var graph = g.graphbody;
                        //graph.select(".x.axis").call(seriesAxis);
                        
                        if(graphStyle == 'area'){
                            graph.select("path.area").attr("d", g.area);
                            graph.select("path.line").attr("d", g.line);
                        }
                        else if (graphStyle == 'bar'){
                            graph.selectAll("g.bar rect").attr("width", space).attr("x", X);
                        }

                    });

                    legend.selectAll("rect")
                        .attr("x", X)
                        .attr("width", space);
                    legend.selectAll("text").attr("x", X)
                        .text(function(d){
                            if(space > 6) return d[legendField].substring(0, space/8);
                            else return '';
                        });
                }

                //d3.selectAll(".brush").call(brush.clear());
                //-----------------------------------------------------------------------------
                //now we implement direct on-graph pan (not using the slider)
                //which will update slider correspondingly

                var pextent = [0,0]; //cache brush extent when zoom start
                var zoom = d3.behavior.zoom()
                    //.scale(1)
                    //.scaleExtent([1, 8])
                    .translate([0, 0])
                    .on("zoom", zoomed,false)
                    .on("zoomstart", function(){ 
                        pextent[0] = extent[0]; pextent[1] = extent[1]; 
                    });

                function zoomed() {
                    //var zscale = zoom.scale();
                    //var ztranslate = zoom.translate();                   
                    var ntrl = d3.event.translate;
                    //console.log("translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

                    if(brush.empty()) return;
                    //var extent = brush.extent();
                    var xpan = ntrl[0] / 10;

                    var domain = brushScale.domain();
                    //console.log(pextent, xpan, domain);
                    if((pextent[0] + xpan) < domain[0]) xpan = domain[0]-pextent[0];
                    if((pextent[1] + xpan) > domain[1]) xpan = domain[1]-pextent[1];
                    //console.log("xpan: ", xpan);

                    var newextent = [pextent[0]+xpan, pextent[1]+xpan];
                    //console.log("p and n extent: ", pextent, newextent);
                    d3.selectAll(".brush").call(brush.extent(newextent));
                    brushed();
                    
                }
                
                
                graphg.call(zoom);



                //-----------------------------------------------------------------------------           


                var top = margin2.top + 30;
                var slider = svg.append("g")
                    .attr("transform", "translate(" + margin2.left + "," + top + ")");


                slider.append("g")
                    .attr("class", "x axis")
                    .call(seriesAxis);               


                // add a brush for the slider graph
                slider.append("g")
                    .attr("class", "x brush")
                    .call(brush)
                    .selectAll("rect")
                    .style("stroke", "black")
                    .style("fill", "yellow")
                    .style("fillopacity", 0.5)
                    .attr("y", -6)
                    .attr("height", 12);

                slider.selectAll("text.range").data([0,0])
                    .enter().append("text").attr("class", "range");
                //slider.append("text").attr("class", "left");
                //slider.append("text").attr("class", "right");
            }
            //-----------------------------------------------------------------------------
 
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

    chart.xfield = function(_) {
        if (!arguments.length) return xField;
        xField = _;
        return chart;
    };

    chart.legendfield = function(_) {
        if (!arguments.length) return legendField;
        legendField = _;
        return chart;
    };

    chart.plotfields = function(_) {
        if (!arguments.length) return plotFields;
        plotFields = _;
        return chart;
    };

    chart.graphstyle = function(_) {
        if(!arguments.length) return graphStyle;
        graphStyle = _;
        return chart;
    };

    chart.stack = function(_) {
        if(!arguments.length) return stack;
        stack = _;
        return chart;
    };

    return chart;
};
