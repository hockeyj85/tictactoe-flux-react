/** @jsx React.DOM */

/// ttt.js


// REQUIRED MODULES
// =============================================================================

var React = require('react');
var GameFrame = require('../components/ttt-gameframe.js');


// REACT COMPONENT
// =============================================================================

var TicTacToe = React.createClass({
  render: function() {
    return <div>
      <GameFrame />
    </div>
  }
})

module.exports = TicTacToe
