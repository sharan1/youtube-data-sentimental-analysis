var eventSource = new EventSource("/stream");
var eventList = document.getElementById("data");


var data = [];
var width = Math.max($('.bar-chart').width(), 960), //960,
    height = Math.max($('.bar-chart').height(), 500);
var chart = d3.select(".bar-chart").append("svg")
    .attr("width", width)
    .attr("height", height);
var frameSize = 10;
var chartFrame = chart.append("g")
    .append("rect")
    .attr("class", "frame")
    .attr("x", frameSize)
    .attr("y", frameSize)
    .attr("width", (width - frameSize * 2))
    .attr("height", (height - frameSize * 2))
    .attr("stroke", "#ffffff")
    .attr("stroke-width", frameSize);
var chartDefs = chart.append("defs");
var chartMask = chartDefs.append("mask").attr("id", "masterMask")
    .append("rect")
    .attr("x", frameSize)
    .attr("y", frameSize)
    .attr("width", (width - frameSize * 2))
    .attr("height", (height - frameSize * 2))
    .attr("fill", "#ffffff");
var chartRecords = chart.append("g")
    .attr("mask", "url(#masterMask)");

eventSource.onmessage = function(e) {
    var test = e.data.split("|");
    console.log(test);
    // var newData = e.data;

    // // Append new data
    // data = data.concat(newData)
    //     // Remove old data (i.e., avoid overflows)
    // var maxNumberOfRecords = 200;
    // while (data.length > maxNumberOfRecords) {
    //     delete data.shift();
    // }
    // // Setup scaling
    // var dateScale = d3.time.scale()
    //     .domain(_.map(data, function(value, index) {
    //         return value.date;
    //     }))
    //     .range([0, (width - frameSize) / maxNumberOfRecords]);
    // var valueScale = d3.scale.linear()
    //     .range([0, (height - frameSize)]);

    // // DATA JOIN (i.e., join new data with old elements, if any)
    // var record = chartRecords.selectAll("rect")
    //     .data(data);
    // // UPDATE (i.e., Update old elements as needed.)
    // record.attr("class", "update");
    // // ENTER (i.e., Create new elements as needed.)
    // record.enter().append("rect")
    //     .attr("class", "enter")
    //     .attr("x", (width - frameSize))
    //     .attr("y", (height - frameSize));
    // // ENTER + UPDATE (i.e., Appending to the enter selection expands the update selection to include entering elements; so, operations on the update selection after appending to the enter selection will apply to both entering and updating nodes.)
    // record
    //     .transition()
    //     // .duration(200)
    //     .attr("x", function(d, i) {
    //         return Math.floor(dateScale(d.date));
    //     })
    //     .attr("y", function(d, i) {
    //         return height - valueScale(d.value)
    //     })
    //     .attr("width", function(d, i) {
    //         return Math.ceil(width / maxNumberOfRecords); // Ensure overlap with neighbors
    //     })
    //     .attr("height", function(d, i) {
    //         return valueScale(d.value);
    //     })
    //     .attr('fill', 'white');


    // var newElement = document.createElement("li");
    // var data = e.data;
    // newElement.appendChild(document.createTextNode(data));
    // eventList.appendChild(newElement);
}