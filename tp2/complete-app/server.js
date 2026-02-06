var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var query = url.parse(request.url, true).query;
        
        console.log("Request for " + pathname + " received.");

        route(handle, pathname, response, request, query);
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started on http://localhost:8888");
}

exports.start = start;
