// ttt-dispatcher.js


// REQUIRED MODULES
// =============================================================================

var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');


// APP DISPATCHER
// =============================================================================

var AppDispatcher = assign(new Dispatcher(), {

  handleViewAction: function(action) {
    //console.log("[Dispatcher] " + action.actionType)
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    })
  }
});

module.exports = AppDispatcher;
