// ttt-store.js


// REQUIRED MODULES
// =============================================================================

var AppDispatcher = require('../dispatchers/ttt-dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/ttt-constants.js');
var assign = require('object-assign');


// GAME LOGIC
// =============================================================================

var CHANGE_EVENT = 'change';
var BOARD_SIZE = 3;
var EMPTY = AppConstants.EMPTY;
var NAUGHT = AppConstants.NAUGHT;
var CROSS = AppConstants.CROSS;

var _currentGame = {
  gameBoard: _getDefaultBoard(),
  gameBoardState: _getDefaultBoardState(),
  gameFinished: false,
  lastWinner: null,
  score : {
    naughts: 0,
    crosses: 0
  },
  moves: 0,
  p1Turn: true
}


function _getDefaultBoard(){
  var len = BOARD_SIZE * BOARD_SIZE;
  var array = new Array(len);

  for (var i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    array[i] = EMPTY;
  }

  return array;
}

function _getDefaultBoardState() {
  var len = (2 * Number.parseInt(BOARD_SIZE)) + 2;
  var defaultArray = new Array(len);

  for (var i = 0; i < len; i++) {
    defaultArray[i] = 0;
  }

  return defaultArray;
}

function _setBoardState(index) {
  var x = index % 3;
  var y = Math.floor(index / 3);
  var modifier = 1;

  if(!_currentGame.p1Turn) {
    modifier = -1;
  }

  _currentGame.gameBoardState[x] += modifier;                               // row
  _currentGame.gameBoardState[BOARD_SIZE + y] += modifier;                  // col
  if (x == y) _currentGame.gameBoardState[2 * BOARD_SIZE] += modifier;      // diag
  if (x == BOARD_SIZE - 1 - y) _currentGame.gameBoardState[2 * BOARD_SIZE + 1] += modifier; // anti-diag

  for(x in _currentGame.gameBoardState) {
    if (_currentGame.gameBoardState[x] >= BOARD_SIZE) {
      console.log("Crosses wins");
      _currentGame.lastWinner = "Crosses";
      _currentGame.gameFinished = true;
      _currentGame.score.crosses++;
      break;
    }
    else if (_currentGame.gameBoardState[x] <= -BOARD_SIZE) {
      console.log("Naughts wins");
      _currentGame.lastWinner = "Naughts";
      _currentGame.gameFinished = true;
      _currentGame.score.naughts++;
      break;
    }

    if (!_currentGame.gameFinished && _currentGame.moves >= (BOARD_SIZE * BOARD_SIZE)) {
      _currentGame.gameFinished = true;
      _currentGame.lastWinner = null;
    }
  }
}

function _updateSquare(index) {
  /* Error Checking */
  if (
    index == undefined ||
    index < 0 ||
    index > 8 ||
    _currentGame.gameBoard[index] != EMPTY ||
    _currentGame.gameFinished == true) {
      return;
    }

  _currentGame.moves++;
  _setBoardState(index)

  var newTile = 0;
  if (_currentGame.p1Turn) newTile = 1;

  _currentGame.gameBoard[index] = newTile;
  _currentGame.p1Turn = !_currentGame.p1Turn;
}

function _resetBoard() {
  _currentGame.gameBoard = _getDefaultBoard();
  _currentGame.gameBoardState = _getDefaultBoardState();
  _currentGame.gameFinished = false;
  _currentGame.moves = 0;
}


// APP STORES
// =============================================================================

var TicTacToeStore = assign(new EventEmitter, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },

  getBoard: function() {
    return _currentGame.gameBoard;
  },

  getGameFinished: function() {
    message = null;
    if (_currentGame.gameFinished) {
      if (_currentGame.lastWinner == null) {
        message = "Game Finished"
      } else {
        message = _currentGame.lastWinner + " wins!";
      }
    }
    return {
      state: _currentGame.gameFinished,
      message: message
    };
  },

  getScore: function() {
    return _currentGame.score;
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    switch (action.actionType) {
      case AppConstants.MAKE_MOVE:
        _updateSquare(action.move.index)
        break;
      case AppConstants.RESET_GAME:
        _resetBoard();
        break;
    }

    TicTacToeStore.emitChange();

    return true;
  })
});

module.exports = TicTacToeStore;
