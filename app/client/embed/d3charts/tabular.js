

//create namespace
d3.chart = d3.chart || {};
console.log("name space d3.chart is:", d3.chart);


d3.chart.tabularChart = function(){
    //function tabulate(data, columns) {

    
    var margin = {top: 30, right: 10, bottom: 10, left: 30},
    width = 960,
    height = 540;


    console.log("hello from tabularchart");


    var chart = function(selection) {

        selection.each(function(data) {

            var table = d3.select(this).append("table"),
            thead = table.append("thead"),
            tbody = table.append("tbody");

            var columns = d3.keys(data[0]);

            // append the header row
            thead.append("tr")
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function(d) { return d; });

            // create a row for each object in the data
            var rows = tbody.selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

            // create a cell in each row for each column
            var cells = rows.selectAll("td")
                .data(function(row) {
                    return columns.map(function(column) {
                        return {column: column, value: row[column]};
                    });
                })
                .enter()
                .append("td")
                .text(function(d) { return d.value; });
            
            //return table;
        });

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

    return chart;
};
