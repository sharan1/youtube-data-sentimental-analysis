var eventSource = new EventSource("/stream");
var eventList = document.getElementById("data");

eventSource.onmessage = function(e)
{
    var newElement = document.createElement("li");
    var data = e.data;
    newElement.appendChild(document.createTextNode(data));
    eventList.appendChild(newElement);
}