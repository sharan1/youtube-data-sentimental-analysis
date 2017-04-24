var eventSource = new EventSource("/stream");
var dataStream = document.getElementById("data-stream");
var eventList = document.getElementById("visual-stream");



var data = [];

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .domain([0.0, 4.0])
    .range([height, 0]);

var xAxis = d3.svg.axis();
    
    xAxis.scale(x).orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(eventList).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>VideoId:</strong> <span style='color:steelblue'>" + d[0] + "</span></br><strong>VideoTitle:</strong> <span style='color:steelblue'>" + d[1] + "</span></br><strong>VideoDesc:</strong> <span style='color:steelblue'>" + d[2] + "</span>";
    });


svg.call(tip);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", 900)
    .attr("y", 20)
    .style("font-weight", "bold")
    .attr("dx", ".71em")
    .style("text-anchor", "end")
    .text("Videos");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("font-weight", "bold")
    .style("text-anchor", "end")
    .text("Comment Score");

var sel = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d[0]);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d[3]);
        })
        .attr("height", function(d) {
            return height - y(d[3]);
        })
        .attr("fill", "steelblue");

var xval = -180;
var xlabel = 100;

eventSource.onmessage = function(e) {

    var newData = e.data.split("|");
    console.log(newData);

    if(newData.length == 4)
    {
        // Data Stream
        var htmlData = "<tr><td>"+newData[0]+"</td><td>"+newData[1]+"</td><td>"+newData[2]+"</td><td>"+newData[3]+"</td></tr>";
        $('#data-stream').after(htmlData);

        // Data Visualization
        var isData = false;
        var dataIndex ;
        for (var index = 0; index < data.length; index++) {
           if(data[index][0]== newData[0])
           {
                dataIndex = index;
                isData = true;
                break;
           }
           else
           {
               isData = false;
           }
        }

        if(isData)
        {
            var newDataSentiment = newData[3];
            var oldDataSentiment = data[dataIndex][3];
            var avg = (parseFloat(newDataSentiment)+ parseFloat(oldDataSentiment))/2.0;
            data[dataIndex][3] = avg;
        }
        else {
            var v = 200;
            xval += v;
            data.push(newData);
            x.domain(data.map(function(d) {
                return d[0]
            }));

            xlabel += 100;
        }
    console.log("updated data ");
    console.log(data);
    sel.remove();
    var test = -130;
   sel = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function() { test += 150; return test;})
        .attr("width", 80)
        .attr("y", function(d) {
            console.log(d[3]);
            return y(d[3]);
        })
        .attr("height", function(d) {
            console.log(d[3]);
            return height - y(d[3]);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .style("fill", function(d) {
            if (d[3] > 0 && d[3] < 2.0)
                return "red";
            if (d[3] == 2.0)
                return "yellow"
            if (d[3] > 2.0)
                return "green"
        });
    }
}