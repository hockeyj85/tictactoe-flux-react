var AppDispatcher = require('../dispatchers/ttt-dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/ttt-constants.js');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var BOARD_SIZE = 3;

var _gameBoard = _getDefaultBoard();
var _gameBoardState = _getDefaultBoardState();
var _gameFinished = false;
var _score = {
  naughts: 0,
  crosses: 0
};
var _p1Turn = true;
var _moves = 0;


function _getDefaultBoard(){
  return [
  2, 2, 2,
  2, 2, 2,
  2, 2, 2
  ];
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

  if(!_p1Turn) {
    modifier = -1;
  }

  _gameBoardState[x] += modifier;                               // row
  _gameBoardState[BOARD_SIZE + y] += modifier;                  // col
  if (x == y) _gameBoardState[2 * BOARD_SIZE] += modifier;      // diag
  if (x == 2-y) _gameBoardState[2 * BOARD_SIZE + 1] += modifier; // anti-diag

    console.log(_gameBoardState)

  for(x in _gameBoardState) {
    if (_gameBoardState[x] >= BOARD_SIZE) {
      console.log("crosses wins");
      _lastWinner = "crosses";
      _gameFinished = true;
      _score.crosses++;
    }
    else if (_gameBoardState[x] <= -BOARD_SIZE) {
      console.log("naughts wins");
      _lastWinner = "naughts";
      _gameFinished = true;
      _score.naughts++;
    }

    if (_moves >= (BOARD_SIZE * BOARD_SIZE)) {
      _gameFinished = true;
      _lastWinner = null;
    }
    console.log(_gameFinished, _moves);
  }
}

function _updateSquare(index) {
  /* Error Checking */
  if (
    index == undefined ||
    index < 0 ||
    index > 8 ||
    _gameBoard[index] != 2 ||
    _gameFinished == true) {
      return;
    }

  _moves++;
  _setBoardState(index)

  var newTile = 0;
  if (_p1Turn) newTile = 1;

  _gameBoard[index] = newTile;
  _p1Turn = !_p1Turn;
}

function _resetBoard() {
  _gameBoard = _getDefaultBoard();
  _gameBoardState = _getDefaultBoardState();
  _gameFinished = false;
  _moves = 0;
}

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
    return _gameBoard;
  },

  getGameFinished: function() {
    message = null;
    if (_gameFinished) {
      if (_lastWinner == null) {
        message = "Game Finished"
      } else {
        message = _lastWinner + " wins!";
      }
    }
    return {
      state: _gameFinished,
      message: message
    };
  },

  getScore: function() {
    return _score;
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
