var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/register"] = requestHandlers.register;
handle["/login"] = requestHandlers.login;
handle["/logout"] = requestHandlers.logout;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/find"] = requestHandlers.find;

server.start(router.route, handle);
