var AppDispatcher = require('../dispatchers/ttt-dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/ttt-constants.js');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _gameBoard = _getDefaultBoard();
var _turn = true;

function _getDefaultBoard(){
  return [
  2, 2, 2,
  2, 2, 2,
  2, 2, 2
  ];
}

function _updateSquare(index) {
  if (index == undefined || index < 0 || index > 8) return;

  var oldTile = _gameBoard[index];
  if (oldTile != 2) return;

  var newTile = 0;
  if (_turn) newTile = 1;

  _gameBoard[index] = newTile;
  _turn = !_turn;
}

function _resetBoard() {
  _gameBoard = _getDefaultBoard();
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
