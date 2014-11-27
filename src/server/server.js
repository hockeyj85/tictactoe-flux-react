// server.js
// tic tac toe api server

// REQUIRED MODULES
// =============================================================================

var express = require('express');             // http server module
var bodyParser = require('body-parser');      // json parser
var router = require('./routes/ttt-api.js');  // api router


// BASIC SET UP
// =============================================================================

// configure app to use bodyParser
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

// Register routes, prefix all routes with api
app.use('/api', router);

// START THE SERVER
// =============================================================================

var server = app.listen(port, function() {
  console.log('Tic-tac-toe server listening on port', port);
});
