//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);




d3.chart.nflChart = function(){

    // private vars avaialbe to chart as closure -- only chart object can access, hidden from outside
    // add chart.funcname = function(){} to access and change these vars -- encapsulation

    var margin = {top: 100, right: 50, bottom: 100, left: 70},
    width = 760,
    height = 120,
    score = [],
    xValue = function(d) { return d.min; },
    yValue = function(d) { return d.ydline; },
    textValue = function(d) { return d.description; },
    //xScale = d3.time.scale(),
    xScale = d3.scale.linear(),
    yScale = d3.scale.linear(),
    xAxisScale = d3.scale.linear(),
    xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom").tickSize(6, 0),
    yAxis = d3.svg.axis().scale(yScale).orient("left"),
    area = d3.svg.area().x(X).y1(Y),
    line = d3.svg.line().x(X).y(Y);
   
    var team1='TEAM1',
    team2='TEAM2'
    title='TEAM1 VS. TEAM2';
    chartdata = [];
    halfrounds = [[],[]];

    // print to console -- debugging
    console.log("hello from nflChart");

    // private functions
    // The x-accessor for the path generator; xScale of xValue.
    function X(d) {
        return xScale(d[0]);
    }

    // The x-accessor for the path generator; yScale of yValue.
    function Y(d) {
        return yScale(d[1]);
    }

    // public: will return this object
    var chart = function(selection) {
        selection.each(function(data) {

            //console.log(data);
 
            // convert each data item from original format(e.g. a dict) to array of 2
            // use xValue and yValue function, mostly passed from chart's x() and y() function call
            chartdata = data.map(function(offdata, i){
                return offdata.map(function(sd, i){ 
                    return sd = sd.map(function(d, i) {
                        return [xValue.call(sd, d, i), yValue.call(sd, d, i), textValue.call(sd, d, i)];
                    });
                });
            });

            //console.log(chartdata);

            // Update the x-scale.
            xScale
                .domain([0, 3600])
                .range([0, width - margin.left - margin.right]);

            // Update the y-scale.
            yScale
                .domain([-50, 50])
                .range([height - margin.top - margin.bottom, 0]);

            xAxisScale
                .domain([0, 60])
                .range([0, width - margin.left - margin.right]);

            // Select the svg element, if it exists.
            //var svg = d3.select(this).append("svg");
            //console.log(svg.node());
            var svg = d3.select(this).selectAll("svg").data([chartdata]);
            if(svg[0][0] === null) svg = svg.enter().append("svg");
            else svg.selectAll("*").remove();

            // Otherwise, create the skeletal chart.
            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //console.log(gEnter.node());

            //console.log(xScale.range(), yScale.range());

            //field area and team name
            g.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", xScale.range()[1])
                .attr("height", yScale.range()[0] / 2)
                .style("fill", "#efe");

            g.append("text")
                .attr("x", xScale.range()[1] / 2)
                .attr("y", -20)
                .attr("dy", ".35em")
                .style("font-size", "14pt") 
                .attr("text-anchor", "middle")  
                .style("fill", "green")
                .text(team2);

            g.append("rect")
                .attr("x", 0)
                .attr("y", yScale.range()[0] / 2)
                .attr("width", xScale.range()[1])
                .attr("height", yScale.range()[0] / 2)
                .style("fill", "#fee");

            g.append("text")
                .attr("x", xScale.range()[1] / 2)
                .attr("y", yScale.range()[0] + 20)
                .attr("dy", ".35em")
                .style("font-size", "14pt") 
                .attr("text-anchor", "middle")  
                .style("fill", "red")
                .text(team1);

            //quarterly seperation line
            var quarter = xScale.range()[1] / 4;
            for(var i=1; i<4; i++){
                g.append("line")
                    .attr("x2", quarter*i).attr("y2", 0)
                    .attr("x1", quarter*i).attr("y1", yScale.range()[0])
                    .style("stroke", "black");
            }
            

            g.append("g").attr("class", "x axis");
            g.append("g").attr("class", "y axis");


            // Update the outer dimensions.
            svg .attr("width", width)
                .attr("height", height);

            g.append("text")
                .attr("x", (xScale.range()[1] / 2))             
                .attr("y", 20 - (margin.top))
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")  
                .style("font-size", "14pt") 
                .style("text-decoration", "underline")  
                .text(title);


            // Update the line path with start position mark.
            g.append("g").selectAll("."+team1+".line").data(chartdata[0])
                .enter().append("path")
                .attr("class", "line "+team1)
                .style("stroke", "red")
                .style("stroke-width", 3)
                .style("fill", "none")
                .attr("d", line);

            g.append("g").selectAll("."+team1+".start").data(chartdata[0])
                .enter().append("circle")
                .attr("class", "start "+team1)
                .attr("cx", function(d,i){return xScale(d[0][0]);})
                .attr("cy", function(d,i){return yScale(d[0][1]);})
                .attr("r", 4)
                .style("stroke", "red")
                .style("fill", "none");

            g.append("g").selectAll("."+team2+".line").data(chartdata[1])
                .enter().append("path")
                .attr("class", "line "+team2)
                .style("stroke", "green")
                .style("stroke-width", 3)
                .attr("d", line);

            g.append("g").selectAll("."+team2+".start").data(chartdata[1])
                .enter().append("circle")
                .attr("class", "start "+team2)
                .attr("cx", function(d,i){return xScale(d[0][0]);})
                .attr("cy", function(d,i){return yScale(d[0][1]);})
                .attr("r", 4)
                .style("stroke", "green")
                .style("fill", "none");        

            // draw scoreboard
            var scoreboard = g.append("g")
                .attr("class", "legend")
                .selectAll("g")
                .data(score)
                .enter().append("g")
                .attr("transform", function(d, i){ 
                    var x = xScale(d.time);
                    var y = yScale(d.endzone);
                    return "translate(" + x + "," + y + ")";
                });

 
            scoreboard.append("line")
                .style("stroke", function(d, i){ 
                    if (d.team === team1) return "red"; 
                    else return "green";})
                .style("stroke-dasharray", "4,4")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", function(d,i){return yScale(d.ydline) - yScale(d.endzone);});

            scoreboard.append("circle")
                .attr("r", 5) //function(d, i){return d.score;})
                .style("fill", function(d, i){ 
                    if (d.team === team1) return "red"; 
                    else return "green";
                });

            scoreboard.append("text")
                .attr("x", 10)
                .attr("y", function(d,i){
                    if(d.team == team1) return -5;
                    else return 5;
                })
                .attr("dy", ".35em")
                .text(function(d, i){ return d.score; });

            // Update the x-axis.
            g.select(".x.axis")
                .attr("transform", "translate(0," + (yScale.range()[0] + 40) + ")")
                .call(xAxis);

            g.append("text")
            .attr("x", xScale.range()[1] / 2)
            .attr("y", yScale.range()[0] + 80)
            .attr("dy", ".35em")
            .text("Time (minutes)")
            .attr("text-anchor", "middle")  
            .attr("font-family", "sans-serif")
            .attr("font-size", "12pt")

            //console.log("update y axis");
            g.select(".y.axis")
                .call(yAxis);

            var tx = xScale.range()[0] - 50;
            var ty = yScale.range()[0] / 2 ;
            g.append("text")
            .attr("x", tx)
            .attr("y", ty)
            .attr("dy", ".35em")
            .text("Field (yards)")
            .attr("text-anchor", "middle")  
            .attr("dominant-baseline", "central")
            .attr("font-family", "sans-serif")
            .attr("font-size", "12pt")
            .attr("transform", function(d) {
                return "rotate(-90,"+tx+","+ty+")" 
                });

        });
    };



    chart.annotate = function(team, color, levelid) {
        //var data = chartdata[id];
        var drive = d3.select("svg g").selectAll("."+team+".annotation").selectAll("g .drive");

        //levels: 0-'Successful Play', 1-'Unsuccessful Play', 2-'Score', 3-'Turnover', 4-'Penalty'
        var levels = [['pass ', 'guard', 'tackle', 'push'],
                      ['incomplete', 'sack', 'punt'],
                      ['field goal', 'No Good', 'TOUCHDOWN', 'REVERSED'],
                      ['INTERCEPTED', 'FUMBLE'],
                      ['Illegal', 'Holding', 'Interference', 'Neutral Zone Infraction', 'Encroachment', 'Roughing the Passer', 'False Start', 'Offside', 'Face Mask', 'Unnecessary Roughness', '12 On-field', 'Delay of Game', 'Personal Foul', 'enforced', 'declined']];

        drive.append("text")
            .text(function(d,i){ 
                var t = d[2];
                if(levelid == -1) return t.join(' ');
                var level = levels[levelid];
                var nt = [];
                t.forEach(function(td, ti){
                    level.forEach(function(ld, li){
                        if(td.search(new RegExp(ld, "i")) != -1) nt.push(td);
                    });
                });                
                return nt.join(' ');       
            })
            .style("fill", color)
            .attr("x", function(d,i){
                if(i % 2) return 5;
                else return -5;
            })
            .style("text-anchor", function(d,i) { 
                return i%2 > 0 ? "start" : "end"; 
            })
            .attr("y", function(d,i){
                //return 10 * (Math.random()*2-1);
                if(i % 2) return 5;
                else return -5;
            })
            .attr("dy", ".35em");
    };


    chart.annotationOn = function(team, levelid){
        var id = 0;
        var color = ["red", "green"];

        if(team == team1) id = 0;
        else if(team == team2) id = 1;
            
        var data = chartdata[id];

        var drive = d3.select("svg g").selectAll("."+team+".annotation").data(data);

        if(drive[0][0] === null){

            drive = drive.enter().append("g")
                .attr("class", "annotation "+team)
                .selectAll("g .drive")
                .data(function(d,i){return d;}).enter()
                .append("g").attr("class", "drive")
                .attr("transform", function(d,i){
                    var x = xScale(d[0]);
                    var y = yScale(d[1]);
                    return "translate(" + x + "," + y + ")";
                });

            drive.append("circle")
                .attr("class", "circle "+team)
                .attr("cx", 0) //function(d,i){return xScale(d[0]);})
                .attr("cy", 0) //function(d,i){return yScale(d[1]);})
                .attr("r", 4)
                .style("fill", "none") //function(d,i){return fillcolor(i);})
                //.style("fill-opacity", 0.5)
                .style("stroke", color[id]);

        }

        if(levelid == 0){
            //by default turn on annotation level 2: score, level 3: Turnover
            chart.annotate(team, color[id], 2);
            chart.annotate(team, color[id], 3);
        }
        else if(levelid > 0) chart.annotate(team, color[id], levelid-1);

        return chart;
    };

    chart.annotationOff = function(team){
        d3.selectAll("."+team+".annotation").remove();
        return chart;
    };

    chart.animate = function() {

        //team1 is processed to be the first team play offense
        //team1 always has equal or more rounds than team2
        //so it's safe to calculate team1's delay by plays, then team2's delay based on team1

        //team1class = '.'+ team.toLowerCase() + '.line';
        var team1class = '.'+team1+'.line';
        var team2class = '.'+team2+'.line';

        var team1paths = d3.selectAll(team1class);
        team1paths.attr("fill", "none");
        var team2paths = d3.selectAll(team2class);
        team2paths.attr("fill", "none");

        var team1startmarks = d3.selectAll("."+team1+".start");
        var team2startmarks = d3.selectAll("."+team2+".start");
        team1startmarks.attr("stroke-opacity", 0);
        team2startmarks.attr("stroke-opacity", 0);

        //console.log("team1paths: ", team1paths, team1paths[0].length);
        var n1 = team1paths[0].length;
        var n2 = team2paths[0].length;
        console.log("plays:", n1, n2);

        var delay1arr = [];
        var length1arr = [];
        var delay2arr = [];
        var length2arr = [];
        var btwplay = 1800;
        var durfac = 6;
        for(var i=0; i<n1; i++){
            delay1arr.push(100); //start of animation: delay 100
            length1arr.push(0);
        }
        for(var i=0; i<n2; i++){
            delay2arr.push(0);
            length2arr.push(0);
        }
        for(var i=0; i<n1; i++){
            var thispath = d3.select(team1paths[0][i]);
            var totalLength = thispath.node().getTotalLength();
            length1arr[i] = totalLength;
        }
        for(var i=0; i<n2; i++){
            var thispath = d3.select(team2paths[0][i]);
            var totalLength = thispath.node().getTotalLength();
            length2arr[i] = totalLength;
        }
        //-----------------------------------------------------------------------------
        // ERROR: assume team play interleaving, only works with halves. Wrong when half switchs. 
        //-----------------------------------------------------------------------------

        var firsthalf = halfrounds[0];
        var secondhalf = halfrounds[1];
        var play1 = 0, play2 = 0;

        // team1 is the first to play offense in first half
        firsthalf.forEach(function(d,i){
            if(i%2 == 0){
                //team1 rounds
                if(i>1){
                    delay1arr[d] = delay1arr[d-1] + play1 + play2; 
                }
                play1 = length1arr[d] * durfac + btwplay;
            }
            else{
                //team2 rounds
                delay2arr[d] = delay1arr[d] + play1;
                play2 = length2arr[d] * durfac + btwplay;
            }
              
        });

        var lastplay=0;
        console.log("play before and after halftime: ", firsthalf[firsthalf.length-1], secondhalf[0]);
        var hbr = firsthalf[firsthalf.length-1];
        var har = secondhalf[0];

        if((firsthalf.length) % 2 == 0) lastplay = delay2arr[hbr] + play2;
        else lastplay = delay1arr[hbr] + play1;

        //start of second half, team2 
        delay2arr[har] = lastplay;

        // team2 is the first to play offense in second half
        secondhalf.forEach(function(d,i){
            if(i%2 == 0){
                //team2 rounds
                if(i>1){
                    delay2arr[d] = delay2arr[d-1] + play1 + play2;
                }
                play2 = length2arr[d] * durfac + btwplay;
            }
            else{
                //team1 rounds
                delay1arr[d] = delay2arr[d] + play2;
                play1 = length1arr[d] * durfac + btwplay;
            }
        });

        console.log("length arrays: ", length1arr, length2arr);
        console.log("delay arrays: ", delay1arr, delay2arr);

        team1paths
            .attr("stroke-dasharray", function(d,i){ return length1arr[i] + " " + length1arr[i];})
            .attr("stroke-dashoffset", function(d,i){ return length1arr[i];})
            .transition()
            .delay(function(d,i){ return delay1arr[i];})
            .duration(function(d,i){ return length1arr[i] * durfac;})
            .ease("linear")
            .attr("stroke-dashoffset", 0);

        team2paths
            .attr("stroke-dasharray", function(d,i){ return length2arr[i] + " " + length2arr[i];})
            .attr("stroke-dashoffset", function(d,i){ return length2arr[i];})
            .transition()
            .delay(function(d,i){ return delay2arr[i];})
            .duration(function(d,i){ return length2arr[i] * durfac;})
            .ease("linear")
            .attr("stroke-dashoffset", 0);

        team1startmarks
            .transition().delay(function(d,i){return delay1arr[i];})
            .duration(100)
            .ease("linear")
            .attr("stroke-opacity", 1.0);

        team2startmarks
            .transition().delay(function(d,i){return delay2arr[i];})
            .duration(100)
            .ease("linear")
            .attr("stroke-opacity", 1.0);


        // animate scoreboard
        //d3.selectAll(".legend").style("visibility", "hidden");
        function scoredelay(d,i){
            if(d.team == team2)
                return delay2arr[d.round] + length2arr[d.round] * durfac + 500;
            else
                return delay1arr[d.round] + length1arr[d.round] * durfac + 500;
        }


        d3.selectAll(".legend").selectAll("line")
            .style("stroke-opacity", 0)
            .transition()
            .delay(scoredelay)
            .duration(300)
            .style("stroke-opacity", 1);


        d3.selectAll(".legend").selectAll("circle")
            .style("fill-opacity", 0)
            .transition()
            .delay(scoredelay)
            .style("fill-opacity", 1);


        d3.selectAll(".legend").selectAll("text")
            .style("fill-opacity", 0)
            .transition()
            .delay(scoredelay)
            .style("fill-opacity", 1);

        //return chart;
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
    chart.text = function(_) {
        if (!arguments.length) return textValue;
        textValue = _;
        return chart;
    };
    chart.scores = function(_) {
        if( !arguments.length) return score; 
        score = _;
        return chart;
    };
    chart.halfrounds = function(_) {
        if( !arguments.length) return halfrounds; 
        halfrounds = _;
        return chart;
    };    
    chart.teams = function(_) {
        if( !arguments.length) return teams; 
        team1 = _[0];
        team2 = _[1];
        return chart;
    };
    chart.title = function(_) {
        if( !arguments.length) return title; 
        title = _;
        return chart;
    };
    chart.chartdata = function(_) {
        if( !arguments.length) return chartdata; 
        chartdata = _;
        return chart;
    };
    return chart;
};
