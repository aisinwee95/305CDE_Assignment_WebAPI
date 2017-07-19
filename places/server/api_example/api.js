var places = require('./place.js')
var restify = require('restify')
var server = restify.createServer()

/* import the required plugins to parse the body and auth header. */
server.use(restify.queryParser())		//to read querystring params
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())


server.get('/search', function(req, res) {
	const searchPlace = req.query.q
  console.log('GET /search?q=' + searchPlace)

  // this is where you access MongoDb

  // this is where you access the external API for data
  places.search(searchPlace, function(data) {
    console.log('Responding...' + JSON.stringify(data))
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    //res.setHeader("Access-Control-Allow-Origin", "*")	//https://cde305-permacultureprogrammer.c9users.io:8081
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    res.setHeader('Content-Type', 'application/json');
    res.send(data.code, data.response);
    console.log(JSON.stringify(data.response))
    res.end();
  })
})





//=========================================================================

var recipes = ['Recipe 1: milk, eggs, flour', 'Recipe 2: eggs, ham, bread'];

server.get('/recipes', function (request, response) {
    // this is where you access the DB OR access an external API for data
    var data = recipes;
    var dataJson = JSON.stringify(data);
    response.setHeader('content-type', 'application/json');
    response.send(200, dataJson);
    response.end();
});

server.post('/recipes', function (request, response) {
    const body = request.body;
    console.log(body);
    response.setHeader('content-type', 'application/json')
    response.send(201, 'POST/recipes respond: ' + body);
    response.end();
})


var port = 8081;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
})
