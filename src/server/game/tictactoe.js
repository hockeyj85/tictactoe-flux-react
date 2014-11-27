// tictactoe.js
// This is the tic-tac-toe game.
// It can be run as a module.



// REQUIRED MODULES
// =============================================================================
var sqlite = require('sqlite3').verbose();
var AppConstants = require('../constants/server-constants.js');
var Error = require('../constants/errorcodes.js');




// DATABASE SCHEMA SET UP
// =============================================================================
var db = new sqlite.Database(':memory:');

var _tableUsers =
"CREATE TABLE Users (" +
"userId INTEGER PRIMARY KEY AUTOINCREMENT," +
"userName VARCHAR (256))";

var _tablePasswords =
"CREATE TABLE Passwords (" +
"userId INTEGER PRIMARY KEY," +
"userPass VARCHAR(256)," +
"FOREIGN KEY (userId) REFERENCES Users(userId))";

var _tableTicTacToe =
"CREATE TABLE TicTacToe (" +
"gameId INTEGER PRIMARY KEY AUTOINCREMENT,"+
"gameName VARCHAR(255) DEFAULT 'Lolcats'," +
"private INTEGER DEFAULT 0," +
"gameFinished INTEGER DEFAULT 0," +
"lastWinner INTEGER NULL," +
"p1Score INTEGER DEFAULT 0," +
"p2Score INTEGER DEFAULT 0," +
"p1Id INTEGER DEFAULT NULL," +
"p2Id INTEGER DEFAULT NULL," +
"moves INTEGER DEFAULT 0," +
"gamePass VARCHAR(256) DEFAULT NULL, " +
"p1Turn INTEGER DEFAULT 1," +
"FOREIGN KEY (p1Id) REFERENCES Users(UserId)," +
"FOREIGN KEY (p1Id) REFERENCES Users(UserId)," +
"FOREIGN KEY (p2Id) REFERENCES Users(UserId))" ;

var _tableGameBoard =
"CREATE TABLE GameBoard (" +
"gameId INTEGER," +
"arrayIndex INTEGER," +
"cellValue INTEGER NOT NULL," +
"PRIMARY KEY (gameId, arrayIndex)," +
"FOREIGN KEY (gameId) REFERENCES TicTacToe(gameId)," +
"CHECK (arrayIndex >= 0))";

var _tableGameBoardState =
"CREATE TABLE GameBoardState (" +
"gameId INTEGER," +
"arrayIndex INTEGER," +
"cellValue INTEGER NOT NULL," +
"PRIMARY KEY (gameId, arrayIndex)," +
"FOREIGN KEY (gameId) REFERENCES TicTacToe(gameId)," +
"CHECK (arrayIndex >= 0))";

db.serialize(function() {
  // Generate Schema
  db.run(_tableUsers);
  db.run(_tablePasswords);
  db.run(_tableTicTacToe);
  db.run(_tableGameBoard);
  db.run(_tableGameBoardState);
});

// ALLOW STACKTRACES TO BE SENT IN JSON
// =============================================================================
var DEV = true;


// GAME CONSTANTS
// =============================================================================
var BOARD_SIZE = 3;
var EMPTY = AppConstants.EMPTY;
var NAUGHT = AppConstants.NAUGHT;
var CROSS = AppConstants.CROSS;


// PUBLIC METHODS (game interaction)
// =============================================================================

// DB DUMPING!
// -----------------------------------------------------------------------------
exports.dbUsers = function (res) {
  var req = db.prepare("SELECT * FROM Users");

  req.all([],
    function(err, rows) {
      res.json(rows);
    });
  }

exports.dbPasswords = function (res) {
  var req = db.prepare("SELECT * FROM Passwords");

  req.all([],
    function(err, rows) {
      res.json(rows);
    });
  }

exports.dbTicTacToe = function (res) {
  var req = db.prepare("SELECT * FROM TicTacToe");

  req.all([],
    function(err, rows) {
      res.json(rows);
    });
  }

exports.dbGameBoard = function (res) {
  var req = db.prepare("SELECT * FROM GameBoard");

  req.all([],
    function(err, rows) {
      res.json(rows);
    });
  }

exports.dbGameBoardState = function (res) {
  var req = db.prepare("SELECT * FROM GameBoardState");

  req.all([],
    function(err, rows) {
      res.json(rows);
    });
  }


// Register user
// -----------------------------------------------------------------------------
// sqlite operations are asynchronous, they are daisy-chaned together.
exports.registerUser = function (name, pass, res) {
  // error checking
  if (!res || !name) return;
  if (!pass) pass = AppConstants.DEFAULT_PASS;

  // Authenticates, or registers if doesnt exist. (or fails)
  _registerUser(name, pass, runSendResponse);

  // Send a response
  function runSendResponse(e, user) {
    console.log("[senduserid]",e, user);
    if (e) {
      _sendError(res, e);
    }
    else if (!user || !user.userId) {
      _sendError(res, Error.DATABASE_ERROR); //close enough
    }
    else {
      res.json({
        success: true,
        userId: user.userId
      });
    }
  };
};


// Create Game
// -----------------------------------------------------------------------------
// TODO: Auth user.
exports.createGame = function(userId, userPass, gameName, priv, gamePass, res) {
  _authenticateUserWithId(userId, userPass, runCreateGame);

  function runCreateGame(e,user){
    if (e) {
      _sendError(res, e);
      return;
    }

    // User already authed.
    var newGame = _generateNewGame(userId, gameName, priv, gamePass);

    // Put the game into the db and forget about it.
    _serializeGame(newGame, gameSerialized);

    function gameSerialized(e, r) {
      res.json({success:true, game: r});
    }
  }
};


// Reset Game
// -----------------------------------------------------------------------------
exports.resetGame = function(gameId, userId, userPass, res) {
  console.log("[resetGame]");

  _authAndGetGame(userId, userPass, gameId, null, res, resetGame)

  function resetGame(e, game) {
    if (e) {
      _sendError(res, e);
      return
    }

    // Reset the game
    game = _resetGame(game);

    // Store it again
    _serializeGame(game, respond);
  }

  function respond(e, game) {
    if (!e)
    res.json({success:true, game: game});
  }
}


// Join Game
// -----------------------------------------------------------------------------
exports.joinGame = function(gameId, userId, userPass, gamePass, res) {
  console.log("[joinGame]");

  _authAndGetGame(userId, userPass, gameId, gamePass, res, joinGame);

  function joinGame(e, game) {
    if (e) _sendError(e);

    if (game.p2Id == userId || game.p1Id == userId) {
      _sendError(res, Error.ALREADY_JOINED);
    }
    else if (game.p2Id == null) {
      game.p2Id = userId;
      console.log(game);
      _serializeGame(game, respond);
    }
    else if (game.p2Id != null)
      res.json({success:false, error: Error.GAME_FULL});
  }

  function respond(e, game) {
    if (!e)
      res.json({success:true, game: game});
  }
}


// Get Current Board
// -----------------------------------------------------------------------------
// This hasn't been implemented as the function below could do it.
/*
exports.getGameBoard = function(gameId) {
  console.log("[getCurrentBoard]");

  var getBoard = db.prepare

}*/

// Get Current Game
// -----------------------------------------------------------------------------
exports.getGame = function(gameId, userId, userPass, res) {
  console.log("[getGame]");

  _authAndGetGame(userId, userPass, gameId, null, res, respond);

  function respond(e, game) {
    if (e) _sendError(e)
    else res.json({success:true, game: game});
  }
}


// Make Move
// -----------------------------------------------------------------------------
// Pull the game from the database, simulate the move then reinsert the updated game.
exports.makeMove = function(gameId, userId, userPass, move, res) {
  console.log("[makeMove]", move);

  _authAndGetGame(userId, userPass, gameId, null, res, makeMove);

  function makeMove(e, game) {
    if (e) _sendError(e)
    else {
      // Simulate move then store game back again.
      console.log("BEFORE MOVE:", game);

      // player 1 turn
      if (game.p1Turn && game.p1Id == userId) {
        console.log("move index:", move.index);

        game = _updateSquare(move.index, game);
        console.log("after MOVE:", game);

      }

      // player 2 turn
      else if (!game.p1Turn && game.p2Id == userId) {
        console.log("move index:", move.index);

        game = _updateSquare(move.index, game);
        console.log("after MOVE:", game);


      // not your turn.
      } else {
        _sendError(res, Error.NOT_YOUR_TURN);
        return;
      }

      if (game) {
        _serializeGame(game, respond);
      } else {
        _sendError(res, Error.INVALID_MOVE);
      }
    }
  }

  function respond(e, game) {
    if (e) _sendError(e)
      else res.json({success:true, game: game});
  }
}


// HELPER METHODS
// =============================================================================

// Error sending
// -----------------------------------------------------------------------------
// Sends an error back in json to the client.
function _sendError(httpObject, error, stacktrace) {
  if (!DEV) stacktrace = null;

  httpObject.json ({
    success: false,
    error: error,
    stacktrace: stacktrace
  })
};

// Sql checking.
// -----------------------------------------------------------------------------
// Checks sql return values for error, either sends an error back to the sender
// and terminates, or runs the callback.
function _checkSQL(e, r, res, callback) {
  if (e) _sendError(res, e);
  else if (callback) callback(r);
  else console.log("[_checkSQL]: no callback defined")
}


// AUTH
// -----------------------------------------------------------------------------
// sends error to callback if auth fails.
// sends null to callback if user doesn't exist.
// sends user details to callback if user auth successful.
function _authenticateUserWithUserName(name, pass, callback) {
  if (!name || !callback) return;

  // SQL request
  var getPassForName = db.prepare("SELECT * FROM Users NATURAL JOIN Passwords WHERE userName = ?");
  getPassForName.get([name], function(e,r) {checkPass( e, r )});

  // Check that the username and pass match. (callback)
  function checkPass(e, r) {
    // Database Error
    if (e)
      callback(e);

    // User doesn't exist.
    if (!r)
      callback(null, null);

    // User exists, check credientials.
    else {
      // good pass
      if (r.userPass == pass)
        callback(null, r);

      // Bad pass
      else
        callback(Error.WRONG_PASS, null);
    }
  }
}

function _authenticateUserWithId(userId, pass, callback) {
  if (!userId || !callback) return;

  // SQL request
  var getPassForId = db.prepare("SELECT * FROM Users NATURAL JOIN Passwords WHERE userId = ?");
  getPassForId.get([userId], function(e, r) {checkPass( e, r )});

  // Check that the username and pass match. (callback)
  function checkPass(e, r) {
    // Database Error
    if (e)
      callback(e);

    // User doesn't exist.
    if (!r)
      callback(null, null);

    // User exists, check credientials.
    else {
      // Bass pass
      if (r.userPass == pass)
        callback(null, r);

      // Good pass
      else
        callback(Error.WRONG_PASS, null);
    }
  }
}

// performs auth, if user doesn't exist creates user.
// callback: valid user, or invalid password.
function _registerUser(name, pass, callback) {
  // Sql transactions
  var insertUser = db.prepare("INSERT INTO Users(userName) VALUES (?)");
  var insertPass = db.prepare("INSERT INTO Passwords(userId, userPass) VALUES (?, ?)");
  var getUser = db.prepare("SELECT * FROM Users NATURAL JOIN Passwords WHERE userName = ? AND userPass = ?")

  // Try auth
  _authenticateUserWithUserName(name,pass, checkAuth);

  function checkAuth(e, user) {
    // Auth failed
    if (e)
      callback(e, null);

    // Auth succeeded
    else if (user)
      callback(null, user);

    // User doesn't exist
    else {

      // Insert user, db will generate user id
      insertUser.run([name], function(e,r){
        console.log("[insertUser] errorlist: ",e);

        // Get user id and then insert pass using this.
        _getUserId(name, function(userId) {
          console.log("[userID]", userId)

          insertPass.run([userId,pass], function(e,r) {
            console.log("[insertPass] errorlist: ",e)

            console.log("ERAERA", userId, pass)

            // Auth should pass now.
            _authenticateUserWithId(userId, pass, callback);
          });
        })
      });
    }
  }
}

// Get user info
// -----------------------------------------------------------------------------
function _getUserId(name, callback) {
  db.get( "SELECT * FROM Users WHERE userName = ?",
          [name],
          function(e,r) {
            if (e || !r) {
              console.log("[_getUserInfo]",e)
              return;
            }

            callback(r.userId);
          });
}

function _authAndGetGame(userId, userPass, gameId, gamePass, res, callback) {

  // Check user exists and has correct pass
  _authenticateUserWithId(userId, userPass, runGetGame);

  // Grab the game.
  function runGetGame( e, r) {
    if (e) {
      _sendError(res, e);
    }
    else if (!r) {
      _sendError(res, Error.USER_NOT_FOUND)
    }
    else {
      _deserializeGame(gameId, runAuthGame)
    }
  }

  // Check this user has permission to this game and reset.
  function runAuthGame(e, game) {
    if (e) {
      _sendError(res, e);
      return;
    }
    // Check if user has permission to this game
    if (game.p1Id != userId && game.p2Id != userId && game.gamePass != gamePass) {
      _sendError(res, Error.WRONG_PERMISSIONS);
      return;
    }

    callback(e, game);
  }
}

// GAME DB SERIALIZATION
// =============================================================================

function _serializeGame(game, callback) {
  console.log("NUMBER", game.p2Id);


  // SQL operations
  var insertGame = db.prepare( "INSERT OR REPLACE INTO TicTacToe" +
    "(gameId, gameName, private, gameFinished, lastWinner, " +
    "p1Score, p2Score, p1Id, p2Id, moves, p1Turn)" +
    "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  var insertBoard = db.prepare (
    "INSERT OR REPLACE INTO GameBoard" +
    "(gameId, arrayIndex, cellValue)" +
    "VALUES(?, ?, ?)"
  )
  var insertState = db.prepare (
    "INSERT OR REPLACE INTO GameBoardState" +
    "(gameId, arrayIndex, cellValue)" +
    "VALUES(?, ?, ?)"
  )
  var retrieveGame = db.prepare (
    "SELECT gameId FROM TicTacToe WHERE gameId = ?"
  )
  var findNewGameId = db.prepare (
    "SELECT MAX(gameId) as gameId FROM TicTacToe WHERE p1Id = ?"
  )

  // convert all bools to int for sqlite.
  var priv = game.private ? 1 : 0;
  var p1Turn = game.p1Turn ? 1 : 0;

  // Insert game proper
  insertGame.run(
    game.gameId, game.gameName, priv, game.gameFinished, game.lastWinner,
    game.p1Score, game.p2Score, game.p1Id, game.p2Id, game.moves, p1Turn,
    function(e,r) {

      // If new game, must find the gameId
      if (game.gameId == null) {
        findNewGameId.get(game.p1Id, function(e, r) {
          updateBoard(r.gameId);
        });
      }
      else {
        updateBoard(game.gameId);
      }
    });

  // Insert the corrosponding boards (*must know gameId)
  // MUST RUN IN SERIAL (they don't).
  function updateBoard(gameId) {
    db.serialize (function() {
      // Insert board
      for (var i in game.gameBoard) {
        insertBoard.run(gameId, i, game.gameBoard[i]);
      }

      // Insert board state
      for (var i in game.gameBoardState) {
        insertState.run(gameId, i, game.gameBoardState[i]);
      }

      // Retrieve the inserted values above :/
      retrieveGame.get(gameId, function(e, r) {
          sendCallback(e,r);
      });
    });
  }

  // Sanity check, Grab the game, and send it to the callback.
  // Note game board and gameboard state are likely to be corrupt at this stage.
  function sendCallback(e,r) {
    if (callback)
      if (r)
      _deserializeGame(r.gameId, callback);
    }
}

function _deserializeGame(gameId, callback) {
  console.log("GAMEID", gameId);

  // SQL operations
  var retrieveGame = db.prepare (
    "SELECT * FROM TicTacToe WHERE gameId = ?");
  var retrieveBoard = db.prepare (
    "SELECT * FROM GameBoard WHERE gameId = ?");
  var retrieveGameState = db.prepare (
    "SELECT * FROM GameBoardState WHERE gameId = ?");

  var game = {gameId:null};
  var gameBoard = [];
  var gameBoardState = [];

  // Get the board.
  retrieveBoard.each(gameId, function(e, r) {
    if (e) {
      callback(e);
      return;
    }
    gameBoard[r.arrayIndex] = r.cellValue;
  },
  function(e, r) {
    if (e) {
      callback(e)
      return;
    }
    game.gameBoard = gameBoard;
    runRetrieveGameState();
  });

  // Get the state of the board.
  function runRetrieveGameState () {
    retrieveGameState.each(gameId, function(e, r) {
      if (e) {
        callback(e);
        return;
      }
      gameBoardState[r.arrayIndex] = r.cellValue;
    },
    function(e, r) {
      if (e) {
        callback(e);
        return;
      }
      runRetrieveGame();
    });
  }

  // Get the game object
  function runRetrieveGame() {
    retrieveGame.get(gameId, function(e, r) {
      if (e) {
        callback(e);
        return;
      }
      else if (!r) {
        callback (Error.GAME_NOT_FOUND);
        return;
      }

      game.gameId =       r.gameId;
      game.gameName =     r.gameName;
      game.gameBoard =    gameBoard;
      game.gameBoardState = gameBoardState;
      game.gameFinished = r.isFinished;
      game.lastWinner =   r.lastWinner;
      game.private =      r.private;
      game.gamePass =     r.gamePass;
      game.p1Score =      r.p1Score;
      game.p2Score =      r.p2Score;
      game.p1Id =         r.p1Id;
      game.p2Id =         r.p2Id;
      game.moves =        r.moves;
      game.p1Turn =       r.p1Turn;

      if (callback)
        callback(null, game);
    });
  };
}


// GAME METHODS
// =============================================================================
function _generateNewGame(userId, gameName, priv, gamePass) {
  return {
    gameId : null,
    gameName: gameName,
    gameBoard: _generateDefaultBoard(),
    gameBoardState: _generateDefaultBoardState(),
    gameFinished: false,
    lastWinner: null,
    private: priv,
    gamePass: gamePass,
    p1Score : 0,
    p2Score : 0,
    p1Id : userId,
    p2Id : undefined,
    moves: 0,
    p1Turn: true
  }
}

function _resetGame(game) {
  game.gameBoard = _generateDefaultBoard();
  game.gameBoardState = _generateDefaultBoardState();
  game.gameFinished = false;
  game.moves = 0;
  return game;
}

function _generateDefaultBoard() {
  var len = BOARD_SIZE * BOARD_SIZE;
  var array = new Array(len);

  for (var i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    array[i] = EMPTY;
  }

  return array;
}

function _generateDefaultBoardState() {
  var len = 2 * BOARD_SIZE + 2;
  var defaultArray = new Array(len);

  for (var i = 0; i < len; i++) {
    defaultArray[i] = 0;
  }

  return defaultArray;
}

function _setBoardState(index, game) {
  if (!game) return null;

  var x = index % 3;
  var y = Math.floor(index / 3);
  var modifier = 1;

  if(!game.p1Turn) {
    modifier = -1;
  }

  game.gameBoardState[x] += modifier;                               // row
  game.gameBoardState[BOARD_SIZE + y] += modifier;                  // col
  if (x == y) game.gameBoardState[2 * BOARD_SIZE] += modifier;      // diag
  if (x == BOARD_SIZE - 1 - y) game.gameBoardState[2 * BOARD_SIZE + 1] += modifier; // anti-diag

  for(x in game.gameBoardState) {
    if (game.gameBoardState[x] >= BOARD_SIZE) {
      console.log("p1 wins");
      game.lastWinner = "p1";
      game.gameFinished = true;
      game.p1Score++;
      break;
    }
    else if (game.gameBoardState[x] <= -BOARD_SIZE) {
      console.log("p2 wins");
      game.lastWinner = "p2";
      game.gameFinished = true;
      game.p2Score++;
      break;
    }

    if (!game.gameFinished && game.moves >= (BOARD_SIZE * BOARD_SIZE)) {
      game.gameFinished = true;
      game.lastWinner = null;
    }
  }

  return game;
}

function _updateSquare(index, game) {
  /* Error Checking */
  console.log("{UPDATESQUARE: INDEX:", index);

  if (
    index == undefined ||
    index < 0 ||
    index > 8 ||
    game.gameBoard[index] != EMPTY ||
    game.gameFinished == true) {
      console.log("[UPDATESQUARE] FAILED")
      return;
    }

    game.moves++;
    game = _setBoardState(index, game);

    if (!game) return;

    var newTile = 0;
    if (game.p1Turn) newTile = 1;

    game.gameBoard[index] = newTile;
    console.log(game.p1Turn, typeof(game.p1Turn));

    game.p1Turn = !game.p1Turn;

    console.log(game.p1Turn, typeof(game.p1Turn));

    return game;
}
