var router = require("./router.js");
var http = require('http');

http.createServer(function (request, response) {
  router.home(request, response);
  router.user(request, response);
}).listen(2000);
console.log('Server running at localhost:2000');
