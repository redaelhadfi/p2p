function route(handle, pathname, response, request, query) {
    console.log("About to route a request for " + pathname);
    
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request, query);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
        response.write("<html><head><title>404 - Page non trouvée</title></head>");
        response.write("<body><h1>404 - Page non trouvée</h1>");
        response.write("<p>La ressource demandée n'existe pas.</p>");
        response.write("<a href='/'>Retour à l'accueil</a></body></html>");
        response.end();
    }
}

exports.route = route;
