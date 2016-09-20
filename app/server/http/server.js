//implement your own nodejs http server
//http://blog.modulus.io/build-your-first-http-server-in-nodejs
// to run server : node myFirstHTTPServer.js


// we are actually using the http-server package
// so this is just to show how the basic implementation is


//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8080;

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
