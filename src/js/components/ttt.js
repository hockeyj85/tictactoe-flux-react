/** @jsx React.DOM */
var React = require('react');
var GameFrame = require('../components/ttt-gameframe.js');

var TicTacToe = React.createClass({
  render: function() {
    return <div>
      <GameFrame />
    </div>
  }
})

module.exports = TicTacToe
