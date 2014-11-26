//  server.js


// BASIC SETUP
// =============================================================================

// set up sqlite
var sqlite = require('sqlite').verbose();
var db = new sqlite.Database(':memory');

db.serialize(function() {

})


// get the server packages that we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// configure app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;


// ROUTES FOR API
// =============================================================================
var router = express.Router();

// Create game
router.put('/create_game', function(req, res) {

  console.log(req.message);
  res.json( { message: 'PUT: create_game request recieved successfully.'});
});


// Register routes, prefix all routes with api
app.use('/api', router);


// START THE SERVER
// =============================================================================

var server = app.listen(port, function() {

  console.log('Tic-tac-toe server listening on port', port);

});
