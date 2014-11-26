/** @jsx React.DOM */

// ttt-scoreboard.js


// REQUIRED MODULES
// =============================================================================

var React = require('react');


// REACT COMPONENT
// =============================================================================

var ScoreBoard = React.createClass({
  getDefaultProps: function() {
    return {
      score : {
        naughts: 0,
        crosses: 0
      }
    }
  },
  render: function() {
    var containerStyle = {
      width: this.props.width+"px",
      padding: "15px"
    }

    return (
      <table style={containerStyle} className="table table-striped">
      <thead>
      <tr>
        <th colSpan="2"> Score </th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Naughts: {this.props.score.naughts}</td>
        <td>Crosses: {this.props.score.crosses}</td>
      </tr>
      </tbody>
      </table>
    )
  }
})

module.exports = ScoreBoard;
