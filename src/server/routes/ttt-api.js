
// ttt-api.js
// A router for the tic-tac-toe server
// The router is responsible for hooking up the api requests to the correct game logic
// It is not responsible for replying, the game logic do that itself.



// REQUIRED MODULES
// =============================================================================

var error = require('../constants/errorcodes.js');    // Error codes
var express = require('express');                     // http server module
var tictactoe = require('../game/tictactoe.js');      // Game logic



// ROUTES FOR API
// =============================================================================

var router = express.Router();


// default action for all requests.
// -----------------------------------------------------------------------------

router.use(function(req, res, next) {
  console.log(req.protocol, 'request from ', req.ip)
  next();
});


// Register User
// -----------------------------------------------------------------------------
router.put('/register_user', function(req, res) {
  var user = req.body.userName;
  var pass = req.body.userPass;

  // Check request
  if (user == undefined) {
    res.send({sucess: false, error: error.NO_USERNAME});
    return;
  }

  // Pass on request to game.
  tictactoe.registerUser(user, pass, res);
});


// Create game
// -----------------------------------------------------------------------------
router.put('/create_game', function(req, res) {
  var userId = req.body.userId;
  var priv = req.body.priv;
  var userPass = req.body.userPass;
  var gameName = req.body.gameName;
  var gamePass = req.body.gamePass;

  // Check request
  if (userId == null) {
    res.json( { success: false, message: error.NO_USERNAME });
    return;
  }
  if (priv == null) priv = false;

  tictactoe.createGame(userId, userPass, gameName, priv, gamePass, res);
});


// Reset Game
// -----------------------------------------------------------------------------
router.put('/reset_game', function(req, res) {
  var userId = req.body.userId;
  var gameId = req.body.gameId;
  var userPass = req.body.userPass;

  // Check request
  if (userId == null) {
    res.json( { success: false, message: error.NO_USERNAME });
    return;
  }

  if (gameId == null) {
    res.json({ success: false, message: error.NO_GAMEID });
    return;
  }

  tictactoe.resetGame(gameId, userId, userPass, res);
});


// Join Game
// -----------------------------------------------------------------------------
router.put('/join_game', function(req, res) {
  var userId = req.body.userId;
  var gameId = req.body.gameId;
  var userPass = req.body.userPass;
  var gamePass = req.body.gamePass;

  // Check request
  if (userId == null) {
    res.json( { success: false, message: error.NO_USERNAME });
    return;
  }

  if (gameId == null) {
    res.json({ success: false, message: error.NO_GAMEID });
    return;
  }

  tictactoe.joinGame(gameId, userId, userPass, gamePass, res);
});


// Get Current Board -- NOT IMPLEMENTED
// -----------------------------------------------------------------------------
// This is optional to implement. The route is here but it's not implemented further on.
// The function below covers this anyways.
/*
router.put('/get_current_board', function(req, res) {
  var gameId = req.body.gameId;

  if (gameId == null) {
    res.json({ success: false, message: error.NO_GAMEID });
    return;
  }

  tictactoe.getGameBoard(gameId, res);
});
*/

// Get Current game
// -----------------------------------------------------------------------------
router.put('/get_current_game', function(req, res) {
  var gameId = req.body.gameId;
  var userId = req.body.userId;
  var userPass  = req.body.userPass;

  if (userId == null) {
    res.json( { success: false, message: error.NO_USERNAME });
    return;
  }

  if (gameId == null) {
    res.json({ success: false, message: error.NO_GAMEID });
    return;
  }

  tictactoe.getGame(gameId, userId, userPass, res);
});

// Make Move
// -----------------------------------------------------------------------------
router.put('/make_move', function(req, res) {
  var userId = req.body.userId;
  var gameId = req.body.gameId;
  var userPass = req.body.userPass;
  var move = req.body.move;

  // Check request
  if (userId == null) {
    res.json( { success: false, message: error.NO_USERNAME });
    return;
  }

  if (gameId == null) {
    res.json({ success: false, message: error.NO_GAMEID });
    return;
  }

  if (move == null) {
    res.json({ success: false, message: error.NO_MOVE });
  }

  tictactoe.makeMove(gameId, userId, userPass, move, res);
});


// DATABASE REQUESTS
// =============================================================================
// Dump all of the passwords in plain text!
// Ultra secure.

router.get('/dbUsers', function(req, res){
  tictactoe.dbUsers(res);
});

router.get('/dbPasswords', function(req, res){
  tictactoe.dbPasswords(res);
});

router.get('/dbTictactoe', function(req, res){
  tictactoe.dbTicTacToe(res);
});

router.get('/dbGameBoard', function(req, res){
  tictactoe.dbGameBoard(res);
});

router.get('/dbGameBoardState', function(req, res){
  tictactoe.dbGameBoardState(res);
});

module.exports = router;
