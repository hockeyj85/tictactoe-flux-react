//  server.js


// BASIC SETUP
// =============================================================================

// get the packages that we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// configure app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;


// ROUTES FOR API
// =============================================================================

app.put('/create_game', function(req, res) {
  console.log(req.param("arg", "foo"));
  res.send("PUT Request recieved. create_game");
});


// START THE SERVER
// =============================================================================

var server = app.listen(port, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Tic-tac-toe server listening on port', port);
});
