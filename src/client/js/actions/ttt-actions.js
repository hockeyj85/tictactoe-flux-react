// ttt-actions.js


// REQUIRED MODULES
// =============================================================================

var AppConstants = require('../constants/ttt-constants.js');
var AppDispatcher = require('../dispatchers/ttt-dispatcher.js');


// APP ACTIONS
// =============================================================================

var AppActions = {
  makeMove: function(move) {
    //console.log("[action] move");
    AppDispatcher.handleViewAction({
      actionType: AppConstants.MAKE_MOVE,
      move: move
    });
  },
  resetGame: function() {
    //console.log("[action] reset");
    AppDispatcher.handleViewAction ({
      actionType: AppConstants.RESET_GAME
    });
  }
}

module.exports = AppActions;
