/** @jsx React.DOM */

// main.js


// REQUIRED MODULES
// =============================================================================

var TicTacToe = require('./components/ttt.js');
var React = require('react');


// RENDER COMPONENT
// =============================================================================

React.render(
  <TicTacToe />,
  document.getElementById('mainframe')
);
